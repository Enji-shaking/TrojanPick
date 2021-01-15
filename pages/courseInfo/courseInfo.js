// pages/courseInfo/courseInfo.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    courseID: "a8831daa5fe0cf9d00657ae1018fcc6d",
    isFavorite: false,
    courseCode: "",
    courseName: "",
    overallRating: "",
    courseDescript: "",
    courseUnit: 2,
    difficultyRating: 0,
    interestRating: 0,
    workloadRating: 0,
    teachingRating: 0,
    reviews: [],
    questions: [1, 2, 3],
    totalPage: 0,
    currentPageInReviews: 0,
    professorID: undefined,
    openID: "",
    dummy: 1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  //load the data from database, calculate the average of ratings and overall ratings
  getCourseInfo: function (courseID, professorID) {
    wx.cloud.callFunction({
      name: 'getInfoById',
      data: {
        courseID: courseID,
        openID: this.data.openID,
        target: 'getCourseInfo',
        professorID: professorID
      },
      success: (res) => {
        console.log(res);
        let course = res.result.data.data[0];
        //this needs to be fixed
        let overall = (parseFloat(course.difficultyRating + course.teachingRating + course.workloadRating + course.interestingRating) / 4.0).toFixed(2);
        this.setData({
          courseCode: course.courseCode,
          courseName: course.courseName,
          overallRating: overall,
          difficultyRating: (course.difficultyRating).toFixed(2),
          interestRating: (course.interestingRating).toFixed(2),
          teachingRating: (course.teachingRating).toFixed(2),
          workloadRating: (course.workloadRating).toFixed(2),
          courseDescript: course.courseDescrpt,
          courseUnit: course.courseUnit,
          isFavorite: course.isFavorite
        })
        if (res.result.rating) {
          let rating = res.result.rating.data[0];
          overall = parseFloat(rating.difficultyRating + rating.teachingRating + rating.workloadRating + rating.interestingRating) / 4.0;
          this.setData({
            overallRating: (overall).toFixed(2),
            difficultyRating: (rating.difficultyRating).toFixed(2),
            interestRating: (rating.interestingRating).toFixed(2),
            teachingRating: (rating.teachingRating).toFixed(2),
            workloadRating: (rating.workloadRating).toFixed(2),
          })
        }
        this.counter--;
        if (this.counter === 0) {
          wx.hideLoading();
        }
      },
      fail(res) {
        console.log(res)
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
        console.log(res)
        this.setData({ totalPage: res.result })
        this.counter--;
        if (this.counter === 0) {
          wx.hideLoading();
        }
      }
    })
  },
  getReviewsForCourseForProfessorForPage: function (page, courseID, professorID) {
    this.getCourseInfo(courseID, professorID);
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
    app.globalData.onHome = false;
    app.globalData.onProfile = false;
    app.globalData.onCreate = false;
    console.log("onload");
    const { courseID } = options
    // console.log(courseID);
    const openID = wx.getStorageSync("openID");
    console.log(openID);
    this.setData({
      courseID: courseID,
      openID: openID
    })
  },
  counter: 0,

  onShow: function () {
    this.counter = 3
    wx.showLoading({
      title: "loading",
      mask: true,
    });

    this.getCourseInfo(this.data.courseID, undefined)
    //default with no professor
    this.getTotalPageForReviewsForCourseForProfessor(this.data.courseID, undefined)
    this.getReviewsForCourseForProfessorForPage(1, this.data.courseID, undefined)
  },
  handlePagination(e) {
    console.log(e.detail);
    this.setData({ currentPageInReviews: e.detail })
    this.counter = 1
    wx.showLoading({
      title: "loading",
      mask: true,
    });
    this.getReviewsForCourseForProfessorForPage(e.detail, this.data.courseID, this.data.professorID)
  },

  deleteTappedFromReview(e) {
    console.log(e);
    const d = this.data.reviews
    d.splice(e.target.dataset.index, 1);
    this.setData({ reviews: d })
    console.log(d);
  },
  favoriteCourseTap(options) {
    //Here we need to call a function to change favorite course
    if (this.data.isFavorite) {
      wx.cloud.callFunction({
        name: 'vote_save',
        data: {
          courseID: this.data.courseID,
          openID: this.data.openID,
          target: 'unsave_course',
        },
      })
    } else {
      wx.cloud.callFunction({
        name: 'vote_save',
        data: {
          courseID: this.data.courseID,
          openID: this.data.openID,
          target: 'save_course'
        },
      })
    }
    this.setData({
      isFavorite: !this.data.isFavorite
    })
  },
  //set this.data.professorID here
  handlePicker(e) {
    console.log(e);
    this.counter = 2
    wx.showLoading({
      mask: true,
    });

    const professorID = e.detail
    this.setData({ currentPageInReviews: 1, professorID: professorID })
    this.getTotalPageForReviewsForCourseForProfessor(this.data.courseID, professorID)
    this.getReviewsForCourseForProfessorForPage(1, this.data.courseID, professorID)
  }
})