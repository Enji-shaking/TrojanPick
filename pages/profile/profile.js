// pages/profile/profile.js
const app =  getApp();
  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: "",
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

    if(this.data.openID === ""){
      const data = wx.getStorageSync("openID");
      console.log(data);
      this.setData({openID: data})
    }

    if(!this.data.hasPersonalInfo){
      wx.getStorage({
        key: "userInfo",
        success: (res)=>{
          console.log(res);
          //set data
          this.setData({
            hasPersonalInfo: true,
            avatarUrl: res.data.avatarUrl,
            userName: res.data.userName
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
      
  processUserInfo(rawData, type){
    const data = JSON.parse(rawData)
    console.log(data);
    //1. set user info
    wx.setStorage({
      key: 'userInfo',
      data: {
        hasPersonalInfo: true,
        avatarUrl: data.avatarUrl,
        userName: data.userName
      },
      success: (result) => {
        console.log(result);
      },
      fail: (err) => {console.log(err);}
    });
    //2. insert to database
    wx.cloud.callFunction({
      name: "userRelatedFn",
      data: {
        target: type==="add"?"addNewUser":"updateUser",
        avatarUrl: data.avatarUrl,
        userName: data.userName,
        openID: this.data.openID,
      },
    })
    //3. set page info
    this.setData({
      hasPersonalInfo: true,
      avatarUrl: data.avatarUrl,
      userName: data.userName
    });
  },
  onGetUserInfoNewUser(e){
    //would only be triggered when we don't have userInfo in the storage, neither did we get any information from the database
    console.log(e);
    processUserInfo(e.detail, "add")
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
        if(personalInfo.length > 0){
          this.setData({
            hasPersonalInfo: true,
            avatarUrl: personalInfo[0].avatarUrl,
            userName: personalInfo[0].userName
          });
          wx.setStorage({
            key: 'userInfo',
            data: {
              hasPersonalInfo: true,
              avatarUrl: personalInfo[0].avatarUrl,
              userName: personalInfo[0].userName
            },
            success: (result) => {
              console.log(result);
            },
            fail: (err) => {console.log(err);}
          });
            
        }
      },
      fail: (e)=>{
        console.log("fail");
        console.log(e);
      }
    })
  },
})