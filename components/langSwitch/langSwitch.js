// components/langSwitch/langSwitch.js
let app = getApp()
Component({
  /**
   * Component properties
   */
  properties: {

  },

  /**
   * Component initial data
   */
  data: {
    isChinese: true,
  },

  /**
   * Component methods
   */
  methods: {
    switchLanguage: function(){
      if(this.data.isChinese){
        app.globalData.isChinese = false
        console.log("current lang is Chinese", app.globalData.isChinese)
        this.setData({
          isChinese: false
        })
      }
      else{
        app.globalData.isChinese = true
        console.log("current lang is Chinese", app.globalData.isChinese)
        this.setData({
          isChinese: true
        })
      }
    }
  },
  ready:function(){
    this.setData({
      isChinese: app.globalData.isChinese
    })
  }
})
