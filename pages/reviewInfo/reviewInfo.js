// pages/ratingInfo/ratingInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFavorite:false,
    courseCode:"",
    professorName:"",
    difficultyRating:0,
    interestRating:0,
    workloadRating:0,
    teachingRating:0,
    reviews:[],
    questions:[1,2,3],
    totalPage: 0,
    currentPageInReviews: 1,
    professorID: undefined,
    openID: "",
    comments:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    wx.cloud.callFunction({
      name:'getReviews',
      data:{
        target:'get_review_detail',
        reviewID:'2f6ab8515fe21c000057b09d2c15653f',
      }
    })
    .then(res => {
      console.log(res);
      this.setData({
        reviews:res.result.list

      })
    })
    .catch(console.error)
    wx.cloud.callFunction({
      name:'getInfoById',
      data:{
        target:'get_comments_by_reviewID',
        reviewID:"2f6ab8515fe21c000057b09d2c15653f",
        openID:"oH5r15EPI59JgaNhhebzuDsOpPEo"
      }
    })
    .then(res => {
      console.log(res.result);
      self.setData({
        comments:res.result.list
      })
      console.log(self.data.comments);
      console.log(self.data.comments[0].content);
    })
    .catch(console.error)
  }
})