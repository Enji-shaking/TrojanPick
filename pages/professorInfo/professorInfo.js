// pages/professorInfo/professorInfo.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    overallRating: 0,
    difficultyRating: 0,
    entertainmentRating: 0,
    workloadRating: 0,
    enrichmentRating: 0,
    reviews: [],
    // pageNumber:1,
    // itemNumberPerPage:2,
    courseTaught: [{
      courseCode: "ITP 115",
      courseUnit: 2,
    }],
    professorName: "",
    professorID: "",
    courseID: "",
    courseCode: "",
    totalPage: 0,
    currentPageInReviews: 1,
    openID: "",
    isHot:true,
  },

  getProfessorInfo(professorID, courseID) {
    wx.cloud.callFunction({
      name: 'getInfoById',
      data: {
        professorID: professorID,
        openID: this.data.openID,
        target: 'getProfessorInfo',
        courseID: courseID
      },
      success: (res) => {
        // console.log(professorID)
        // console.log(courseID)
        console.log(res);
        console.log(res.result.data.data[0]);
        let professor = res.result.data.data[0];
        if(!professor){
          console.log("No professor found");
          return;
        }
        if(professor.workloadRating){
          let overall = (parseFloat(professor.difficultyRating + professor.enrichmentRating + professor.workloadRating + professor.entertainmentRating) / 4.0).toFixed(2);
          this.setData({
            overallRating: overall,
            difficultyRating: (professor.difficultyRating).toFixed(2),
            entertainmentRating: (professor.entertainmentRating).toFixed(2),
            enrichmentRating: (professor.enrichmentRating).toFixed(2),
            workloadRating: (professor.workloadRating).toFixed(2),
          })
          if (res.result.rating) {
            let rating = res.result.rating.data[0];
            overall = parseFloat(rating.difficultyRating + rating.enrichmentRating + rating.workloadRating + rating.entertainmentRating) / 4.0;
            this.setData({
              overallRating: (overall).toFixed(2),
              difficultyRating: (rating.difficultyRating).toFixed(2),
              entertainmentRating: (rating.entertainmentRating).toFixed(2),
              enrichmentRating: (rating.enrichmentRating).toFixed(2),
              workloadRating: (rating.workloadRating).toFixed(2),
            })
          }
        }
        this.setData({
          professorName: professor.professorName,
          courseTaught: res.result.courseCode
        })
        this.counter--;
        if (this.counter === 0) {
          wx.hideLoading();
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  getTotalPageForReviewsForCourseForProfessor: function (courseID, professorID) {
    wx.cloud.callFunction({
      name: 'getReviews',
      data: {
        courseID: courseID,
        target: 'get_total_page_of_reviews_for_course_for_professor',
        openID: this.data.openID,
        professorID: professorID
      },
      success: (res) => {
        console.log(res);
        this.setData({ totalPage: res.result })
        this.counter--;
        if (this.counter === 0) {
          wx.hideLoading();
        }
      }
    })
  },

  getReviewsForCourseForProfessorForPage: function (page, courseID, professorID) {
    wx.cloud.callFunction({
      name: 'getReviews',
      data: {
        courseID: courseID,
        target: 'get_reviews_for_course_for_professor_for_page',
        professorID: professorID,
        openID: this.data.openID,
        currentPageInReviews: page
      },
      success: (res) => {
        console.log(res);
        this.setData({
          reviews: res.result
        })
        this.counter--;
        if (this.counter === 0) {
          wx.hideLoading();
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  onLoad: function (options) {
    //load the data from database, calculate the average of ratings and overall ratings
    // options.professorID="2f6ab8515fe173e6004a1af22778d7e7"
    //在编译模式里面设置
    this.counter = 3
    app.globalData.onHome = false;
    app.globalData.onProfile = false;
    app.globalData.onCreate = false;
    const { professorID } = options
    const openID = wx.getStorageSync("openID");
    this.setData({ professorID, openID })

    this.getProfessorInfo(this.data.professorID, undefined)
    this.getTotalPageForReviewsForCourseForProfessor(undefined, this.data.professorID)
    this.getHotReviewsForCourseForProfessor(this.data.professorID,undefined)
  },
  counter: 0,
  
  onShow: function (param) {
    if(app.globalData.needRefresh){
      this.counter = 3
      wx.showLoading({
        title: "loading",
        mask: true,
      });
      this.getProfessorInfo(this.data.professorID, undefined)
      this.getTotalPageForReviewsForCourseForProfessor(undefined, this.data.professorID)
     this.getReviewsForCourseForProfessorForPage(1, this.data.courseID, this.data.professorID)
      app.globalData.needRefresh = false
    }
  },

  handlePagination(e) {
    console.log(e.detail);
    if(e.detail==0){
      this.setData({
        isHot:true
      })
      this.getHotReviewsForCourseForProfessor(this.data.professorID,this.data.courseID);
    }else{
      this.setData({
        isHot:false
      })
      this.setData({ currentPageInReviews: e.detail })
      this.counter = 1
      wx.showLoading({
        title: "loading",
        mask: true,
      });
      
      this.getReviewsForCourseForProfessorForPage(e.detail, this.data.courseID, this.data.professorID)
    }
    this.counter = 1
    wx.showLoading({
      title: "loading",
      mask: true,
    });
    this.getReviewsForCourseForProfessorForPage(e.detail, this.data.courseID, this.data.professorID)
  },
  handlePicker(e) {
    console.log(e);
    this.counter = 3
    wx.showLoading({
      title: "loading",
      mask: true,
    });
    const courseID = e.detail.id
    const courseCode = e.detail.value
    this.setData({ currentPageInReviews: 1, courseID, courseCode })
    this.getProfessorInfo(this.data.professorID, this.data.courseID);
    this.getTotalPageForReviewsForCourseForProfessor(this.data.courseID, this.data.professorID)
    this.getReviewsForCourseForProfessorForPage(1, this.data.courseID, this.data.professorID)
    this.getProfessorInfo(this.data.professorID, this.data.courseID);
  },
  getHotReviewsForCourseForProfessor(professorID,courseID){
    wx.cloud.callFunction({
      name:"getReviews",
      data:{
        courseID:courseID,
        professorID:professorID,
        target:"get_hot_reviews_for_course_for_professor",
        openID:this.data.openID
      }
    })
    .then(res => {
        console.log(res);
        this.setData({
          reviews: res.result
        })
        this.counter--;
        if (this.counter === 0) {
          wx.hideLoading();
        }
    })
  },
  onTapCreateReview: function () {  
    if(!app.globalData.couldMakeReview){
      wx.showToast({
        title: 'Please go to profile and login first',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
      return;
    }
    wx.navigateTo({
      url: `/pages/createReview/createReview?courseID=${this.data.courseID}&courseCode=${this.data.courseCode}&professorID=${this.data.professorID}&professorName=${this.data.professorName}`,
    });
  }
})