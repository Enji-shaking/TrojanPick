// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picker_arr:['数字（默认）','难度从低到高'],
    picker_index: 0,
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
    ],
    prof_cards_info:[
      {
        professorID: 0,
        professorName: "Tommy Trojan"
      },
      {
        professorID: 1,
        professorName: "Tommy Trojan"
      },
      {
        professorID: 2,
        professorName: "Tommy Trojan"
      }
    ],
    activeTab: 0
  },
  onPickerChange(e){
    console.log(e);
    const {value} = e.detail
    this.setData({
      picker_index: value
    })
  },
  onTabTapped(e){
    // let {activeTab} = this.data
    // activeTab = (activeTab===0?1:0)
    console.log(e);
    const {index} = e.currentTarget.dataset
    console.log(index);
    this.setData({activeTab: index})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: "getInfo",
      data:{
        target: "recommended_classes"
      },
      success: res=>{
        console.log(res);
      }
    })
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