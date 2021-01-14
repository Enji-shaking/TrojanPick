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
  
  getProfessorInfo(professorID,courseID){
    wx.cloud.callFunction({
      name:'getInfoById',
      data:{
        professorID: professorID,
        openID: this.data.openID,
        target:'getProfessorInfo',
        courseID:courseID
      },
      success: (res)=>{
        console.log(res);
        console.log(res.result.data[0]);
        let professor = res.result.data.data[0];
        let overall = (parseFloat(professor.difficultyRating+professor.teachingRating+professor.workloadRating+professor.interestingRating)/4.0).toFixed(2);
        this.setData({
          professorName:professor.professorName,
          overallRating:overall,
          difficultyRating:professor.difficultyRating,
          interestRating:professor.interestingRating,
          teachingRating:professor.teachingRating,
          workloadRating:professor.workloadRating,
        })
        if(res.result.rating){
          let rating = res.result.rating.data[0];
          overall = parseFloat(rating.difficultyRating+rating.teachingRating+rating.workloadRating+rating.interestingRating)/4.0;
          this.setData({
            overallRating:overall,
            difficultyRating:rating.difficultyRating,
            interestRating:rating.interestingRating,
            teachingRating:rating.teachingRating,
            workloadRating:rating.workloadRating,
          })
        }
      },
      fail(err){
        console.log(err)
      }
    })
  },
  getTotalPageForReviewsForCourseForProfessor: function(courseID, professorID){
    wx.cloud.callFunction({
      name:'getReviews',
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

  getReviewsForCourseForProfessorForPage: function (page, courseID, professorID) { 
    wx.cloud.callFunction({
      name:'getReviews',
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
          reviews: res.result
        })
      },
      fail(err){
        console.log(err)
      }
    })
   },
  onLoad: function (options) {
    //load the data from database, calculate the average of ratings and overall ratings
    // options.professorID="2424fa985fe1e0bf005e75e61823f605"
    //在编译模式里面设置
    
    const { professorID } = options
    const openID = wx.getStorageSync("openID");
    this.setData({professorID, openID: openID})
    this.getProfessorInfo(professorID,undefined)
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
    console.log(e);
    const courseID = e.detail
    this.setData({currentPageInReviews: 1, courseID: courseID})
    this.getTotalPageForReviewsForCourseForProfessor(this.data.courseID, professorID)
    this.getReviewsForCourseForProfessorForPage(1, this.data.courseID, professorID)
    this.getProfessorInfo(this.data.professorID,this.data.courseID);
  }
})