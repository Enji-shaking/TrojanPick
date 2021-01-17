//app.js
App({
  originalOnLoadFunction(){
 // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onLaunch: function () {
    console.log("launched");
    wx.cloud.init({
      env: "test-0gbtzjgqaae3f2b2"
    })
    wx.getSetting({
      success: res=>{
        // console.log(res);
        // if(res.authSetting['scope.userInfo']){

          wx.getUserInfo({
            withCredentials: 'false',
            lang: 'zh_CN',
            timeout:10000,
            success: (result) => {
              console.log(result);
              this.globalData.nickName = result.userInfo.nickName
              this.globalData.avatarUrl = result.userInfo.avatarUrl
            },
            fail: () => {},
            complete: () => {}
          });
        }
        // else{
        //   wx.openSetting({
        //     success: (result) => {
        //       console.log(result);
        //     },
        //     fail: () => {},
        //     complete: () => {}
        //   });
            
        // }
          
    })
  },
  globalData: {
    userInfo: null,
    onHome: true,
    onProfile: false,
    onCreate: false,
    needRefresh: false,
  }
})