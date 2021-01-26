// pages/addProfessor/addProfessor.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    forProf: true,
    isChinese: true,
  },
  professorName: '',
  onProfessorNameInput(e){
    console.log(e);
    this.professorName = e.detail.value
    // console.log(this.courseName);
  },
  tapSwitch(){
    const forProf = !this.data.forProf
    this.setData({
      forProf
    })
  },
  onConfirm(e){
    console.log("Confirm button pressed from adding professors");
    if(this.professorName.trim() === ""){
      wx.showToast({
        title: 'Invalid Text',
        icon: 'none'
      })
      return false
    }
    wx.cloud.callFunction({
      name: 'addInfo',
      data:{
        target: 'professor',
        professorName: this.professorName.trim(),
        forProf: this.data.forProf
      },
      success: res=>{
        wx.navigateBack({
          delta: 1,
          success() {
            wx.showToast({
              title: 'Success',
              duration: 1500,
              mask: true,
            })
          }
        })
      },
      fail: err=>{
        console.error(err)
      }
    })
  },
  onLoad: function(){
    this.setData({
      isChinese: app.globalData.isChinese
    })
  }
})