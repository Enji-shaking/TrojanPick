// pages/addClass/addClass.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  courseCode: '',
  courseName: '',

  onCourseIdInput(e){
    console.log(e);
    this.courseCode = e.detail.value
    // console.log(this.courseId);
  },

  onCourseNameInput(e){
    console.log(e);
    this.courseName = e.detail.value
    // console.log(this.courseName);
  },

  onConfirm(e){
    console.log("Confirm button pressed from adding class");
    if(this.courseCode.trim() === "" || this.courseName.trim() === "" ){
      wx.showToast({
        title: 'Invalid Text',
        icon: 'none'
      })
      return false
    }
    wx.cloud.callFunction({
      name: 'addInfo',
      data:{
        target: 'class',
        courseCode: this.courseCode.trim(), 
        courseName: this.courseName.trim()
      },
      success: res=>{
        console.log(res);
        wx.showToast({
          title: 'Success',
          duration: 1500,
          mask: true,
          success: (result) => {
            wx.navigateBack({
              delta: 1
            });
          },
        });
      },
      fail: err=>{
        console.error(err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})