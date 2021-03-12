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
  onShareAppMessage(){
    wx.onAppRoute(function (res) {
      console.log('当前页面路由发生变化 触发该事件onShareAppMessage')
      const pages = getCurrentPages() //获取加载的页面
      const view = pages[pages.length - 1] //获取当前页面的对象
      if(!view)  return false
      view.onShareAppMessage = () => { //重写分享配置
        return {
          title: 'TrojanPick',
          path: '/pages/home/home'
        };
      }
    })
  },
  onLaunch: function () {
    this.onShareAppMessage();
    console.log("launched");
    wx.cloud.init({
      env: "test-0gbtzjgqaae3f2b2"
    })
    const userInfo = wx.getStorageSync("userInfo");
    if(userInfo){
      this.globalData.hasPersonalInfo = true
    }
  },
  globalData: {
    hasPersonalInfo: false,
    onHome: true,
    onProfile: false,
    onCreate: false,
    needRefresh: false,
    questionNeedRefresh: false,
    isChinese: true,
    // couldMakeReview: false,
  }
})