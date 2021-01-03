// pages/courseInfo/courseInfo.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    courseID:"a8831daa5fe0cf9d00657ae1018fcc6d",
    isFavorite:false,
    courseCode:"",
    courseName:"",
    overallRating:"",
    courseDescript:"",
    courseUnit:2,
    difficultyRating:0,
    interestRating:0,
    workloadRating:0,
    teachingRating:0,
    reviews:[],
    questions:[1,2,3],
    totalPage: 0,
    currentPageInReviews: 1,
    professorID: undefined
  },
  /**
   * 生命周期函数--监听页面加载
   */
  //load the data from database, calculate the average of ratings and overall ratings
  getCourseInfo: function(courseID){
    wx.cloud.callFunction({
      name:'getRating',
      data:{
        courseID:courseID,
        target:'getCourseInfo'
      },
      success: (res)=>{
        console.log(res);
        let course = res.result.data[0];
        //this needs to be fixed
        let overall = parseFloat(course.difficultyRating+course.teachingRating+course.workloadRating+course.interestingRating)/4.0;
        this.setData({
          courseCode:course.courseCode,
          courseName:course.courseName,
          overallRating:overall,
          difficultyRating:course.difficultyRating,
          interestRating:course.interestingRating,
          teachingRating:course.teachingRating,
          workloadRating:course.workloadRating,
          courseDescript: course.courseDescrpt,
          courseUnit: course.courseUnit
        })
      },
      fail(res){
        console.log(res)
      }
    })
  },
  getTotalPageForReviewsForCourseForProfessor: function(courseID, professorID){
    wx.cloud.callFunction({
      name:'getRating',
      data:{
        courseID: courseID,
        target:'get_total_page_of_reviews_for_course_for_professor',
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
      name:'getRating',
      data:{
        courseID: courseID,
        target:'get_reviews_for_course_for_professor_for_page',
        professorID: professorID,
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
  onLoad: function (options) {
    const { courseID } = options
    // console.log(courseID);
    this.setData({courseID})
    this.getCourseInfo(courseID)
    //default with no professor
    this.getTotalPageForReviewsForCourseForProfessor(courseID, undefined)
    this.getReviewsForCourseForProfessorForPage(1, courseID, undefined)

    this.setData({
      isFavorite:false,
    })
  },
  handlePagination(e){
    console.log(e.detail);
    this.setData({currentPageInReviews: e.detail})
    this.getReviewsForCourseForProfessorForPage(e.detail, this.data.courseID, this.data.professorID)
  },

  FavoriteCourseTap(options){
    //Here we need to call a function to change favorite course
    this.setData({
      isFavorite:!this.data.isFavorite
    })
  },  
  //set this.data.professorID here
  handlePicker(e){
    console.log(e);
    const professorID = e.detail
    this.setData({currentPageInReviews: 1, professorID: professorID})
    this.getTotalPageForReviewsForCourseForProfessor(this.data.courseID, professorID)
    this.getReviewsForCourseForProfessorForPage(1, this.data.courseID, professorID)
  }
})