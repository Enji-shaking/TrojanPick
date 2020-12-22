// pages/courseInfo/courseInfo.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
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
    ratings:[1,2],
    pageNumber:1,
    itemNumberPerPage:2,
    questions:[1,2,3]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //load the data from database, calculate the average of ratings and overall ratings
    this.setData({
      isFavorite:false,
      courseCode:"ITP115",
      courseName:"Introduction to Python",
      overallRating:4.7,
      courseDescript:"英文字体：Avenir Next",
      courseUnit:2,
      difficultyRating:4.9,
      interestRating:4.5,
      workloadRating:4.7,
      teachingRating:4.4
    })
  },
  FavoriteCourseTap(options){
    this.setData({
      isFavorite:!this.data.isFavorite
    })
  },
  moreRating(options){
    //in the future, track the page numbers, and concact new ratings into existed ratings
    this.setData({
      ratings:this.data.ratings.concat([1])
    })
  }

})