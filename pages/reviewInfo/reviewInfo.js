// pages/ratingInfo/ratingInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    review:{},
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
    wx.cloud.callFunction({
      name:'getReviews',
      data:{
        target:'get_review_detail',
        reviewID:options.reviewID,
      }
    })
    .then(res => {
      console.log(res);
      this.setData({
        review:res.result
      })
    })
    .catch(console.error)

    wx.cloud.callFunction({
      name:'getInfoById',
      data:{
        target:'get_comments_by_reviewID',
        reviewID:options.reviewID,
        openID:"oH5r15EPI59JgaNhhebzuDsOpPEo"
      }
    })
    .then(res => {
      console.log(res.result);
      this.setData({
        comments:res.result.list
      })
      console.log(this.data.comments);
      console.log(this.data.comments[0].content);
    })
    .catch(console.error)
  }
})