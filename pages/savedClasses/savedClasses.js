// pages/savedClasses/savedClasses.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    favorite_classes_prefix:["ITP", "CSCI"],
    prefix_index: 0,
    course_cards_info:[
      {
        courseID: 0,
        courseCode: "ITP 115",
        courseName: "Introduction to Python"
      },
      {
        courseID: 1,
        courseCode: "ITP 115",
        courseName: "Introduction to Python"
      },
      {
        courseID: 2,
        courseCode: "ITP 115",
        courseName: "Introduction to Python"
      }
    ]
  },
  onPickerChange(e){
    console.log(e);
    const {value} = e.detail
    this.setData({
      picker_index: value
    })
    // wx request, update info accordingly
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