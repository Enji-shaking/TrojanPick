// components/Header/Header.js
let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    onHome: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTapHome: function () {  
      if(!this.data.onHome){
        wx.reLaunch({
          url: '/pages/home/home',
        });
        app.globalData.onHome = true;
      }else{
        wx.showToast({
          title: 'At Home Page',
          icon: 'none',
          duration: 1500,
          mask: true,
        }); 
      } 
    },
  },
  ready: function () {  
    const {onHome} = app.globalData
    this.setData({onHome})
  }
})
