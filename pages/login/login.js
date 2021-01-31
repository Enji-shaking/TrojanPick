// pages/login/login.js
let app =  getApp();

Page({
  data:{
    isChinese: true,
    showModal: false
  },
  hideModal: function(){
    this.setData({
      showModal: false
    })
  },
  displayModal: function(){
    this.setData({
      showModal: true
    })
  },
  onGetUserInfo(e){
    console.log(e);
    if(e.detail.userInfo){
      this.processUserInfo(e.detail.userInfo)
    }
  },
  processUserInfo(data){
    console.log(data);
    //1. set user info
    wx.setStorageSync('userInfo', {
      avatarUrl: data.avatarUrl,
      nickName: data.nickName
    });

    //2. insert userinfo to database as well as set the openID
    wx.cloud.callFunction({
      name: "userRelatedFn",
      data: {
        target: "login",
        avatarUrl: data.avatarUrl,
        nickName: data.nickName,
        openID: this.data.openID,
      },
      success: res=>{
        console.log(res);
        wx.setStorageSync('openID', res.result);
        app.globalData.hasPersonalInfo = true
        wx.redirectTo({
          url: '/pages/home/home',
        });
      }
    })
  },
  onLoad: function(){
    this.setData({
      isChinese: app.globalData.isChinese
    })
  }
})