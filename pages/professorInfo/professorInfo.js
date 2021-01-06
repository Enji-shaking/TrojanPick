// pages/professorInfo/professorInfo.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    professorName:"",
    overallRating:"",
    difficultyRating:0,
    interestRating:0,
    workloadRating:0,
    teachingRating:0,
    reviews:[],
    // pageNumber:1,
    // itemNumberPerPage:2,
    courseTaught:[{
      courseCode:"ITP 115",
      courseUnit:2,
    }],
    professorID: -1,
    totalPage: 0,
    currentPageInReviews: 1,
    openID: ""
  },
  
  getProfessorInfo(professorID){
    wx.cloud.callFunction({
      name:'getRating',
      data:{
        professorID: professorID,
        openID: this.data.openID,
        target:'getProfessorInfo',
      },
      success: (res)=>{
        console.log(res);
        console.log(res.result.data[0]);
        let professor = res.result.data[0];
        let overall = parseFloat(professor.difficultyRating+professor.teachingRating+professor.workloadRating+professor.interestingRating)/4.0;
        this.setData({
          professorName:professor.professorName,
          overallRating:overall,
          difficultyRating:professor.difficultyRating,
          interestRating:professor.interestingRating,
          teachingRating:professor.teachingRating,
          workloadRating:professor.workloadRating,
        })
      },
      fail(err){
        console.log(err)
      }
    })
  },
  getTotalPageForReviewsForCourseForProfessor: function(courseID, professorID){
    wx.cloud.callFunction({
      name:'getRating',
      data:{
        courseID: courseID,
        target:'get_total_page_of_reviews_for_course_for_professor',
        openID: this.data.openID,
        professorID: professorID
      },
      success: (res)=>{
        console.log(res);
        this.setData({totalPage: res.result})
      }
    })
  },
  // getTotalPageForReviewsForProfessor(professorID){
  //   let self = this;
  //   wx.cloud.callFunction({
  //     name:'getRating',
  //     data:{
  //       professorID: professorID,
  //       target:'get_total_page_of_reviews_for_professor'
  //     },
  //     success(res){
  //       console.log(res);
  //       self.setData({totalPage: res.result})
  //     }
  //   })
  // },
  getReviewsForCourseForProfessorForPage: function (page, courseID, professorID) { 
    wx.cloud.callFunction({
      name:'getRating',
      data:{
        courseID: courseID,
        target:'get_reviews_for_course_for_professor_for_page',
        professorID: professorID,
        openID: this.data.openID,
        currentPageInReviews: page
      },
      success: (res)=>{
        console.log(res);
        this.setData({
          reviews: res.result.data
        })
      },
      fail(err){
        console.log(err)
      }
    })
   },
  // getReviewsForProfessorForPage(page, professorID){
  //   let self = this;
  //   wx.cloud.callFunction({
  //     name:'getRating',
  //     data:{
  //       professorID: professorID,
  //       target:'get_reviews_for_professor_for_page',
  //       currentPageInReviews: page
  //     },
  //     success(res){
  //       console.log(res);
  //       self.setData({
  //         reviews: res.result.data
  //       })
  //     },
  //     fail(err){
  //       console.log(err)
  //     }
  //   })
  // },
  onLoad: function (options) {
    //load the data from database, calculate the average of ratings and overall ratings
    //professorID=2424fa985fe1e0bf005e75e61823f605
    //在编译模式里面设置
    const { professorID } = options
    const openID = wx.getStorageSync("openID");
    this.setData({professorID, openID: openID})
    this.getProfessorInfo(professorID)
    // this.getTotalPageForReviewsForProfessor(professorID)
    // this.getReviewsForProfessorForPage(1, professorID)
    this.getTotalPageForReviewsForCourseForProfessor(undefined, professorID)
    this.getReviewsForCourseForProfessorForPage(1, undefined, professorID)
  },
  handlePagination(e){
    console.log(e.detail);
    this.setData({currentPageInReviews: e.detail})
    this.getReviewsForCourseForProfessorForPage(e.detail, this.data.courseID, this.data.professorID)
  },

  handlePicker(e){
    // let self = this;
    // wx.cloud.callFunction({
    //   name:'getRating',
    //   data:{
    //     courseID:e.detail,
    //     professorID: this.data.professorID,
    //     target:'professor_course'
    //   },
    //   success(res){
    //     console.log(res);
    //     let profess_course = res.result.rating.data[0];
    //     let overall = parseFloat(profess_course.difficultyRating+profess_course.teachingRating+profess_course.workloadRating+profess_course.interestingRating)/4.0;
    //     self.setData({
    //       overallRating:overall,
    //       difficultyRating:profess_course.difficultyRating,
    //       interestRating:profess_course.interestingRating,
    //       teachingRating:profess_course.teachingRating,
    //       workloadRating:profess_course.workloadRating,
    //       ratings:res.result.data.data
    //     })
        
    //   },
    //   fail(res){
    //     console.log("fail");
    //   }
    // })
    console.log(e);
    const professorID = e.detail
    this.setData({currentPageInReviews: 1, professorID: professorID})
    this.getTotalPageForReviewsForCourseForProfessor(this.data.courseID, professorID)
    this.getReviewsForCourseForProfessorForPage(1, this.data.courseID, professorID)
  }
})