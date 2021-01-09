// pages/createQuestion/createQuestion.js
Page({

  /**
   * Page initial data
   */
  newQuestion: '',
  courseID: '',
  openID: '',

  saveQuestion(e){
      this.newQuestion = e.detail.value;
  },

  submitQuestion(e){
    if(this.newQuestion.trim() === ""){
      wx.showToast({
        title: '输入不能为空',
        icon: 'loading'
      })
      return false;
    }
    wx.cloud.callFunction({
      name: 'addEntries',
      data: {
        //在onload那里接受“我要提问”button传来的courseID
        courseID: this.courseID,
        content: this.newQuestion.trim(),
        openID: this.openID,
        target: 'createQuestion'
      },
      success: res=>{
        wx.showToast({
          title: "提交成功",
          icon: 'success',
          duration: 1000
        })
        // setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        // }, 1000)
        console.log(res);
      },
      fail: err=>{
        console.error(err)
      }
    })
  },
  /**
   * Lifecycle function--Called when page load
   */

  onLoad: function (options) {
    this.courseID = options.courseID
    this.openID = wx.getStorageSync('openID');
    console.log(this.openID);
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})