// pages/addProfessor/addProfessor.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  professorName: '',
  onProfessorNameInput(e){
    console.log(e);
    this.professorName = e.detail.value
    // console.log(this.courseName);
  },
  onConfirm(e){
    console.log("Confirm button pressed from adding professors");
    if(this.professorName.trim() === ""){
      wx.showToast({
        title: 'Please enter valid text',
      })
      return false
    }
    wx.cloud.callFunction({
      name: 'addInfo',
      data:{
        target: 'professor',
        professorName: this.professorName.trim(),
      },
      success: res=>{
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
})