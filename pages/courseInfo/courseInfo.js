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
    ratings:[],
    pageNumber:1,
    itemNumberPerPage:2,
    questions:[1,2,3]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //load the data from database, calculate the average of ratings and overall ratings
    let self = this;
    wx.cloud.callFunction({
      name:'getRating',
      data:{
        courseID:self.data.courseID,
        target:'fromCourse'
      },
      success(res){
        let course = res.result.data.list[0];
        let overall = parseFloat(course.difficultyRating+course.teachingRating+course.workloadRating+course.interestingRating)/4.0;
        self.setData({
          courseCode:course.courseCode,
          courseName:course.courseName,
          overallRating:overall,
          difficultyRating:course.difficultyRating,
          interestRating:course.interestingRating,
          teachingRating:course.teachingRating,
          workloadRating:course.workloadRating,
          ratings:course.ratinglist
        })
      },
      fail(res){
        console.log(res.result)
      }
    })

    this.setData({
      isFavorite:false,
      courseDescript:"英文字体：Avenir Next",
      courseUnit:2,
    })
  },
  FavoriteCourseTap(options){
    //Here we need to call a function to change favorite course
    this.setData({
      isFavorite:!this.data.isFavorite
    })
  },
  moreRating(options){
    //in the future, track the page numbers, and concact new ratings into existed ratings
    this.setData({
      ratings:this.data.ratings.concat([1])
    })
  },
  handlePicker(e){
    let self = this;
    wx.cloud.callFunction({
      name:'getRating',
      data:{
        courseID:this.data.courseID,
        professorID: e.detail,
        target:'professor_course'
      },
      success(res){
        console.log(res.result);
        let profess_course = res.result.rating.data[0];
        let overall = parseFloat(profess_course.difficultyRating+profess_course.teachingRating+profess_course.workloadRating+profess_course.interestingRating)/4.0;
        self.setData({
          overallRating:overall,
          difficultyRating:profess_course.difficultyRating,
          interestRating:profess_course.interestingRating,
          teachingRating:profess_course.teachingRating,
          workloadRating:profess_course.workloadRating,
          ratings:res.result.data.data
        })
        
      },
      fail(res){
        console.log(res.result)
      }
    })
  }
})