// pages/courseInfo/courseInfo.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    courseID: "",
    isFavorite: false,
    courseCode: "",
    courseName: "",
    overallRating: 0,
    courseDescript: "",
    courseUnit: 2,
    difficultyRating: 0,
    entertainmentRating: 0,
    workloadRating: 0,
    enrichmentRating: 0,
    overall: 0,
    reviews: [],
    questions: [],
    totalPage: 0,
    currentPageInReviews: 1,
    professorID: "",
    professorName: "",
    openID: "",
    dummy: 1,
    isHot:true,
    isChinese: true
  },

  getQuestions: function(){
    wx.cloud.callFunction({
      name: "getQuestions",
      data:{
        target: "top_questions",
        courseID: this.data.courseID
      },
      success: res=>{
        console.log(res);
        this.setData({
          questions: res.result.list
        })
        this.counter--;
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
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  //load the data from database, calculate the average of ratings and overall ratings
  getCourseInfo: function (courseID, professorID) {
    console.log(courseID);
    console.log(professorID);
    wx.cloud.callFunction({
      name: 'getInfoById',
      data: {
        courseID: courseID,
        openID: this.data.openID,
        target: 'getCourseInfo',
        professorID: professorID
      },
      success: (res) => {
        console.log(res)
        let course = res.result.data.data[0]
        if(!course){
          console.log("no course found")
          return
        }
        if(course.numReviews != undefined){
          this.setData({
            overallRating: (course.overallRating).toFixed(2),
            difficultyRating: (course.difficultyRating).toFixed(2),
            entertainmentRating: (course.entertainmentRating).toFixed(2),
            enrichmentRating: (course.enrichmentRating).toFixed(2),
            workloadRating: (course.workloadRating).toFixed(2),
          })
          if (res.result.rating) {
            let rating = res.result.rating.data[0];
            this.setData({
              overallRating: (rating.overallRating).toFixed(2),
              difficultyRating: (rating.difficultyRating).toFixed(2),
              entertainmentRating: (rating.entertainmentRating).toFixed(2),
              enrichmentRating: (rating.enrichmentRating).toFixed(2),
              workloadRating: (rating.workloadRating).toFixed(2),
            })
          }
        }
        // else{
          // this.setData({})
        // }
        this.setData({
          courseCode: course.courseCode,
          courseName: course.courseName,
          courseDescript: course.courseDescript,
          courseUnit: course.courseUnit,
          isFavorite: course.isFavorite
        })
        this.counter--;
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
        })
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
        })
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
        wx.hideLoading();
        wx.showToast({
          title: 'Error, try again later',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
        })
      }
    })
  },
  counter: 0,
  onLoad: function (options) {
    wx.showShareMenu({
      // 要求小程序返回分享目标信息
      withShareTicket: true
    }); 
    //This line could be considered to remove. This is to reset the info under the professor list in the numericRating component
    this.myNumeric = this.selectComponent("#myNumeric")
    this.counter = 4
    wx.showLoading({
      title: "loading",
      mask: true,
    });
    app.globalData.onHome = false;
    app.globalData.onProfile = false;
    app.globalData.onCreate = false;
    // options.courseID="429d17da60052ed9000642326f246b24";
    console.log("onload");
    const { courseID } = options
    // console.log(courseID);
    const openID = wx.getStorageSync("openID");
    console.log(openID);
    this.setData({
      courseID: courseID,
      openID: openID
    })
    this.setData({
      isChinese: app.globalData.isChinese
    })
    this.getQuestions()
    this.getCourseInfo(this.data.courseID, undefined)
    this.getTotalPageForReviewsForCourseForProfessor(this.data.courseID, undefined)
    this.getHotReviewsForCourseForProfessor(this.data.courseID,undefined);

  },
  onShow: function () {
    if(app.globalData.needRefresh){
      //works together with the line in onLoad, to update information
      this.myNumeric.ready()
      this.counter = 3
      wx.showLoading({
        title: "loading",
        mask: true,
      });
      this.getCourseInfo(this.data.courseID, undefined)
      this.getTotalPageForReviewsForCourseForProfessor(this.data.courseID, undefined)
      this.getReviewsForCourseForProfessorForPage(1, this.data.courseID, this.data.professorID)
      app.globalData.needRefresh = false
    }
    if(app.globalData.questionNeedRefresh){
      this.getQuestions()
      app.globalData.questionNeedRefresh = false
    }

  },
  handlePagination(e) {
    console.log(e.detail);
    if(e.detail==0){
      this.setData({
        isHot:true
      })
      this.getHotReviewsForCourseForProfessor(this.data.courseID,this.data.professorID);
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
    
  },

  deleteTappedFromReview(e) {
    //works together with the line in onLoad, to update information
    this.myNumeric.ready()
    console.log(e);
    const d = this.data.reviews
    d.splice(e.target.dataset.index, 1);
    this.setData({ reviews: d })
    console.log(d);
    this.counter = 1
    wx.showLoading({
      title: "loading",
      mask: true,
    });
    this.getCourseInfo(this.data.courseID, undefined)
    // this.getTotalPageForReviewsForCourseForProfessor(this.data.courseID, undefined)
    // this.getHotReviewsForCourseForProfessor(this.data.courseID,undefined);
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
    app.globalData.needRefresh = true
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

    const professorID = e.detail.id
    const professorName = e.detail.value
    // console.log(professorID, professorName);
    if(e.detail.value === "professor"){
      this.setData({currentPageInReviews: 1, professorID: "", professorName:"" })
    }else{
      this.setData({ currentPageInReviews: 1, professorID, professorName })
    }
    this.getTotalPageForReviewsForCourseForProfessor(this.data.courseID, professorID)
    this.getReviewsForCourseForProfessorForPage(1, this.data.courseID, professorID)
    // console.log(this.data);
  },
  getHotReviewsForCourseForProfessor(courseID,professorID){
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
    .catch(err => {
      console.log(err)
      wx.hideLoading();
      wx.showToast({
        title: 'Error, try again later',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      })
    })
  },
  onTapCreateQuestion: function (){
    wx.navigateTo({
      url: '/pages/createQuestion/createQuestion?courseID='+this.data.courseID,
    });   
  },
  onTapCreateReview: function () {  
    // if(!app.globalData.couldMakeReview){
    //   wx.showToast({
    //     title: 'Please go to profile and login first',
    //     icon: 'none',
    //     duration: 1500,
    //     mask: false,
    //   });
    //   return;
    // }
    console.log(this.data);
    wx.navigateTo({
      url: `/pages/createReview/createReview?courseID=${this.data.courseID}&courseCode=${this.data.courseCode}&professorID=${this.data.professorID}&professorName=${this.data.professorName}&forProf=${true}`,
    });
  }
})