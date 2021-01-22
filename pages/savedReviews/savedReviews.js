// pages/savedReviews/savedReviews.js
let app =  getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    reviews: [],
    professor_list: [{
      list_id: "",
      list_value: ""
    }],
    course_list: [{
      list_id: "",
      list_value: ""
    }],
    courses: [],
    professors: [],
    professorName: "全部",
    courseName: "全部",
    curProfessorID: "",
    curCourseID: "",
    openID: "",
    deleted: {
      deleted: true,
      content: "[The user has deleted this review]",
      down_vote_count: 0,
      favoriteCount: 0,
      commentCount: 0,
      up_vote_count: 0
    },
    totalPage: 0,
    currentPageInReviews: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  counter: 3,
  onLoad: function (options) {
    // options.openID = "oH5r15EPI59JgaNhhebzuDsOpPEo";
    app.globalData.onProfile = false
    wx.showLoading({
      title: "loading",
      mask: true,
    });

    this.setData({
      openID: options.openID
    })
    this.getReviewsForCourseForProfessorForPage(1, this.data.curCourseID, this.data.curProfessorID, true);
    this.getTotalPage();
    this.getAllPicker();
  },

  chooseCoursePicker(e) {
    this.counter = 2
    // wx.showLoading({
    //   title: "loading",
    //   mask: true,
    // });
    console.log(this.data.course_list);
    let self = this;
    this.setData({
      curCourseID: this.data.course_list[e.detail.value].list_id,
      courseName: this.data.course_list[e.detail.value].list_value
    })
    this.setData({
      currentPageInReviews: 1
    })
    this.getReviewsForCourseForProfessorForPage(this.data.currentPageInReviews, this.data.curCourseID, this.data.curProfessorID, false);
    this.getTotalPage();
  },
  chooseProPicker(e) {
    this.counter = 2
    // wx.showLoading({
    //   title: "loading",
    //   mask: true,
    // });
    this.setData({
      curProfessorID: this.data.professor_list[e.detail.value].list_id,
      professorName: this.data.professor_list[e.detail.value].list_value
    })
    this.setData({
      currentPageInReviews: 1
    })
    this.getReviewsForCourseForProfessorForPage(this.data.currentPageInReviews, this.data.curCourseID, this.data.curProfessorID, false);
    this.getTotalPage();
  },
  //update
  getReviewsForCourseForProfessorForPage: function (page, courseID, professorID, onLoad) {
    console.log(arguments);
    wx.cloud.callFunction({
      name: 'getProfileInfo',
      data: {
        courseID: courseID,
        target: 'savedReviews',
        professorID: professorID,
        openID: this.data.openID,
        currentPageInReviews: page
      },
      success: (res) => {
        console.log(res.result);
        let reviews = [];
        let cloud_result = res.result;
        console.log(cloud_result);
        for (let i = 0; i < cloud_result.length; i++) {
          // if(cloud_result[i].deleted){
          // reviews.push(cloud_result[i]);
          // }else{
          reviews.push(cloud_result[i]);
          // }
        }
        console.log(reviews);
        this.setData({
          reviews: reviews,
        });
        this.counter--
        if (this.counter === 0) {
          wx.hideLoading();
        }
      },
      fail(err) {
        console.log(err)
        wx.hideLoading();
        wx.showToast({
          title: 'Error, try again later',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
        });
      }
    })
  },
  handlePagination(e) {
    this.counter = 1
    // wx.showLoading({
    //   title: "loading",
    //   mask: true,
    // });
    console.log(e.detail);
    this.setData({ currentPageInReviews: e.detail })
    this.getReviewsForCourseForProfessorForPage(e.detail, this.data.curCourseID, this.data.curProfessorID, false)
  },
  getAllPicker() {
    wx.cloud.callFunction({
      name: 'getProfileInfo',
      data: {
        target: "getAllPickerSavedReviews",
        openID: this.data.openID
      }
    })
      .then(res => {
        console.log(res);
        let cloud_result = res.result;
        let visitedProfessor = new Set();
        let visitedCourse = new Set();
        let professor_list = [{ list_id: undefined, list_value: "全部" }];
        let course_list = [{ list_id: undefined, list_value: "全部" }];
        for (let i = 0; i < cloud_result.length; i++) {
          if (cloud_result[i]) {
            if (!visitedProfessor.has(cloud_result[i].professorInfo[0]._id)) {
              let professorItem = {
                list_id: cloud_result[i].professorInfo[0]._id,
                list_value: cloud_result[i].professorInfo[0].professorName
              }
              professor_list.push(professorItem);
              visitedProfessor.add(cloud_result[i].professorInfo[0]._id);
            }
            if (!visitedCourse.has(cloud_result[i].courseInfo[0]._id)) {
              let courseItem = {
                list_id: cloud_result[i].courseInfo[0]._id,
                list_value: cloud_result[i].courseInfo[0].courseCode
              }
              course_list.push(courseItem);
              visitedCourse.add(cloud_result[i].courseInfo[0]._id);
            }
          }
        }
        this.setData({
          course_list: course_list,
          professor_list: professor_list
        })
        console.log(res);
        this.counter--
        if (this.counter === 0) {
          wx.hideLoading();
        }
      })
      .catch(err => {
        console.error(err);
        wx.hideLoading();
        wx.showToast({
          title: 'Error, try again later',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
        });
      })
  },
  getTotalPage() {
    wx.cloud.callFunction({
      name: 'getProfileInfo',
      data: {
        target: "countTotalPagesSavedReviews",
        professorID: this.data.curProfessorID,
        courseID: this.data.curCourseID,
        openID: this.data.openID
      }
    })
      .then(res => {
        console.log(res);
        this.setData({
          totalPage: res.result
        })
        this.counter--
        if (this.counter === 0) {
          wx.hideLoading();
        }
      })
      .catch(err => {
        console.error(err);
        wx.hideLoading();
        wx.showToast({
          title: 'Error, try again later',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
        });
      })
  },
  unsaveADeletedReview: function (e) {
    const d = this.data.reviews
    d.splice(e.currentTarget.dataset.index, 1)
    this.setData({ reviews: d })
  },
  deleteTappedFromReview(e) {
    const d = this.data.reviews
    d.splice(e.target.dataset.index, 1);
    this.setData({ reviews: d })
  },
})