// pages/profile/profile.js
const app =  getApp();
  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: "",
    avatarUrl: "/icon/ours/empty_icon.png",
    openID:"",
    hasPersonalInfo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: 'loading',
    })
    console.log("hey");
    console.log("hey2");
    console.log(this.data.openID);
    if(this.data.openID === ""){
      const data = wx.getStorageSync('openID');
      console.log(data);
      this.setData({openID: data})
    }
    console.log(this.data.openID);
    if(!this.data.hasPersonalInfo){
      wx.getStorage({
        key: "userInfo",
        success: (res)=>{
          console.log(res);
          //set data
          this.setData({
            hasPersonalInfo: true,
            avatarUrl: res.data.avatarUrl,
            nickName: res.data.nickName
          })
        },
        fail: e=>{
          this.getPersonalInfoFromDatabase()
        },
        complete(c){
          wx.hideLoading()
        }
      });
    }
  },

  getPersonalInfoFromDatabase(){
    wx.cloud.callFunction({
      name: "userRelatedFn",
      data: {
        target: "checkUserInfo",
        openID: this.data.openID
      },
      success: (e)=>{
        console.log(e);
        const personalInfo = e.result.data
        //only if we saved avatarUrl to the database, we obtained the related information
        if(personalInfo.length > 0 && personalInfo[0].avatarUrl){
          this.setData({
            hasPersonalInfo: true,
            avatarUrl: personalInfo[0].avatarUrl,
            nickName: personalInfo[0].nickName
          });
          wx.setStorage({
            key: 'userInfo',
            data: {
              hasPersonalInfo: true,
              avatarUrl: personalInfo[0].avatarUrl,
              nickName: personalInfo[0].nickName
            },
            success: (result) => {
              console.log(result);
            },
            fail: (err) => {console.log(err);}
          });
        }
        // else{do nothing}
      },
      fail: (e)=>{
        console.log("fail");
        console.log(e);
      }
    })
  },
  //print a placeholder
    //the placeholder have a button
    //if the user allows, insert userinfo into database, save it locally, goto **

  //**check if we have personal info locally
    //if we do, print data, allow the user to reload personal info
      //if the user reload data, update database, update local data
  //if we don't have one locally
    //go check if we have user info in the database
      //if we do, pull it to locally, go to the 
      
      //if we don't, do nothing, go to *** 
      
  processUserInfo(data, type){
    console.log(data);
    //1. set user info
    wx.setStorage({
      key: 'userInfo',
      data: {
        hasPersonalInfo: true,
        avatarUrl: data.avatarUrl,
        nickName: data.nickName
      },
      success: (result) => {
        console.log(result);
      },
      fail: (err) => {console.log(err);}
    });
    console.log(this.data.openID);
    //2. insert to database
    wx.cloud.callFunction({
      name: "userRelatedFn",
      data: {
        target: "updateUser",
        avatarUrl: data.avatarUrl,
        nickName: data.nickName,
        openID: this.data.openID,
      },
    })
    //3. set page info
    this.setData({
      hasPersonalInfo: true,
      avatarUrl: data.avatarUrl,
      nickName: data.nickName
    });
  },
  onGetUserInfoNewUser(e){
    //would only be triggered when we don't have userInfo in the storage, neither did we get any information from the database
    console.log(e);
    if(e.detail.userInfo){
      this.processUserInfo(e.detail.userInfo)
    }
  },
  onTapUpdateInfo(){
    wx.getUserInfo({
      withCredentials: 'false',
      lang: 'zh_CN',
      timeout:10000,
      success: (result) => {
        this.processUserInfo(result.rawData);
      },
      fail: () => {},
      complete: () => {}
    });
  },

})