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

  onAddNewComment: function (e) { 
    console.log(e);
    const userInfo = wx.getStorageSync("userInfo")
    const newComment = {
      content: e.detail.content,
      down_vote_count: 0,
      up_vote_count: 0,
      openID: this.data.openID,
      posted_by_me: true,
      reviewID: this.data.reviewID,
      voted_by_me: 0,
      userInfo: [userInfo],
      _id: e.detail._id
    }
    const comments = this.data.comments
    comments.push(newComment)
    this.setData({comments})
  },
  onTapDeleteFromComment: function (e) {  
    console.log(e);
    const d = this.data.comments
    d.splice(e.target.dataset.index, 1);
    this.setData({comments: d})
    console.log(d);
    this.review.onDeleteComment()
  },
  onTapDeleteFromReviewInDetail: function (e) {  
    wx.navigateBack({
      delta: 1
    });     
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.review = this.selectComponent("#review")
    const openID = wx.getStorageSync("openID");
    const reviewID = options.reviewID
    console.log(openID);
    this.setData({ openID, reviewID })

    wx.cloud.callFunction({
      name:'getReviews',
      data:{
        target:'get_review_detail',
        reviewID:reviewID,
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
        reviewID:reviewID,
        openID: this.data.openID
      }
    })
    .then(res => {
      console.log(res.result);
      this.setData({
        comments:res.result.list
      })
      console.log(this.data.comments);
      // console.log(this.data.comments[0].content);
    })
    .catch(console.error)
  }
})