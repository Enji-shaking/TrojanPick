// pages/professorInfo/professorInfo.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    professorID:"2424fa985fe1e0bf005e75e61823f605",
    professorName:"",
    overallRating:"",
    difficultyRating:0,
    interestRating:0,
    workloadRating:0,
    teachingRating:0,
    ratings:[],
    pageNumber:1,
    itemNumberPerPage:2,
    courseTaught:[{
      courseCode:"ITP 115",
      courseUnit:2,
    }]
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
        professorID:self.data.professorID,
        target:'fromProfessor'
      },
      success(res){
        let professor = res.result.data.list[0];
        let overall = parseFloat(professor.difficultyRating+professor.teachingRating+professor.workloadRating+professor.interestingRating)/4.0;
        self.setData({
          professorName:professor.professorName,
          overallRating:overall,
          difficultyRating:professor.difficultyRating,
          interestRating:professor.interestingRating,
          teachingRating:professor.teachingRating,
          workloadRating:professor.workloadRating,
          ratings:professor.ratinglist
        })
      },
      fail(res){
        console.log(res.result)
      }
    })
  },
  moreRating(options){
    //in the future, track the page numbers, and concact new ratings into existed ratings
    this.setData({
      ratings:this.data.ratings.concat([1])
    })
  }

})