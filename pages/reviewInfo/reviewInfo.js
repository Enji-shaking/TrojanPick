// pages/ratingInfo/ratingInfo.js
const app = getApp();

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
    comments:[],
    isChinese: true,
  },
  getCurrentTime(){
    const date = new Date()
    const year = date.getFullYear()
    let month = date.getMonth()+1
    if(month < 10) month = "0"+month
    let day = date.getDate()
    if(day < 10) day = "0"+day
    return (`${year}-${month}-${day}`)
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
      _id: e.detail._id,
      postedTime: this.getCurrentTime()
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
    wx.showShareMenu({
      // 要求小程序返回分享目标信息
      withShareTicket: true
    }); 
    this.setData({
      isChinese: true,
    })
    app.globalData.onHome = false;
    app.globalData.onProfile = false;
    app.globalData.onCreate = false;
    wx.showLoading({
      mask: true,
      title: "loading"
    });
      
    this.review = this.selectComponent("#review")
    const openID = wx.getStorageSync("openID");
    const reviewID = options.reviewID
    console.log(openID);
    this.setData({ openID, reviewID })
    let counter = 2
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
      counter--;
      if(counter === 0){
        wx.hideLoading();
      }
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
      counter--;
      if(counter === 0){
        wx.hideLoading();
      }
    })
    .catch(console.error)
  }
})