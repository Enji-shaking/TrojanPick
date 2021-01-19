let app = getApp();

  
// components/BottomNav/BottomNav.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    courseID: {
      type: String,
      value: ""
    },
    courseCode: {
      type: String,
      value: ""
    },
    professorID: {
      type: String,
      value: ""
    },
    professorName: {
      type: String,
      value: ""
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    onHome: false,
    onProfile: false,
    onCreate: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTapHome: function () {  
      console.log("home");
      if(!this.data.onHome){
        wx.navigateTo({
          url: '/pages/home/home',
        });
        app.globalData.onHome = true;
        app.globalData.onProfile = false;
        app.globalData.onCreate = false;
      }else{
        wx.showToast({
          title: 'At Home Page',
          icon: 'none',
          duration: 1500,
          mask: true,
        });
          
      }
        
    },
    onTapProfile: function () {  
      console.log("profile");
      if(!this.data.onProfile){
        wx.navigateTo({
          url: '/pages/profile/profile',
        });
        app.globalData.onHome = false;
        app.globalData.onProfile = true;
        app.globalData.onCreate = false;
      }else{
        wx.showToast({
          title: 'At Profile Page',
          icon: 'none',
          duration: 1500,
          mask: true,
        });
      }
    },
    onTapCreate: function () {  
      // if(!app.globalData.couldMakeReview){
      //   wx.showToast({
      //     title: 'Please go to profile and login first',
      //     icon: 'none',
      //     duration: 1500,
      //     mask: false,
      //   });
      //   return;
      // }
      console.log("create");
      if(!this.data.onCreate){
        wx.navigateTo({
          url: `/pages/createReview/createReview?courseID=${this.properties.courseID}&courseCode=${this.properties.courseCode}&professorID=${this.properties.professorID}&professorName=${this.properties.professorName}`,
        });
        app.globalData.onHome = false;
        app.globalData.onProfile = false;
        app.globalData.onCreate = true;
      }else{
        wx.showToast({
          title: 'At Create Page',
          icon: 'none',
          duration: 1500,
          mask: true,
        });
      }
    },
  },
  ready: function () {  
    // console.log("bottom");
    const {onHome, onProfile, onCreate} = app.globalData
    this.setData({onHome, onProfile, onCreate})
  }
})
