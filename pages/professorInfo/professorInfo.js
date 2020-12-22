// pages/professorInfo/professorInfo.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isFavorite:false,
    professorName:"",
    overallRating:"",
    difficultyRating:0,
    interestRating:0,
    workloadRating:0,
    teachingRating:0,
    ratings:[1,2],
    pageNumber:1,
    itemNumberPerPage:2,
    courseTaught:[{
      courseCode:"",
      courseUnit:2,
    }]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //load the data from database, calculate the average of ratings and overall ratings
    this.setData({
      isFavorite:false,
      professorName:"Professor Name",
      overallRating:4.7,
      difficultyRating:4.9,
      interestRating:4.5,
      workloadRating:4.7,
      teachingRating:4.4,
      courseTaught:[{
        courseCode:"ITP115",
        courseUnit:2,
      },{
        courseCode:"ITP265",
        courseUnit:4
      }
    ]
    })
  },
  moreRating(options){
    //in the future, track the page numbers, and concact new ratings into existed ratings
    this.setData({
      ratings:this.data.ratings.concat([1])
    })
  }

})