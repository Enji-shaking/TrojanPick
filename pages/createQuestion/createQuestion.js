const app =  getApp();

  
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
    app.globalData.questionNeedRefresh = true
    if(this.newQuestion.trim() === ""){
      wx.showToast({
        title: 'Input can\'t be empty',
        icon: 'none'
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
        console.log(res);
        if(res.result.success){
          app.globalData.needRefresh = true
          wx.showToast({
            title: "success",
            icon: 'success',
            duration: 2000,
            mask: false,
            success: (result) => {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 2000)
            },
          })
        }else{
          wx.showToast({
            title: 'You can\'t ask more than 3 questions to a course',
            icon: 'none',
            image: '',
            duration: 2000,
            mask: false,
            success: (result) => {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 2000)
            },
          });
            
        }
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

})