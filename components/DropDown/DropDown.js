// components/DropDown/DropDown.js
let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type:{
      type:"int",
      value:1
    },
    professorName:{
      type:"string",
      value:""
    },
    courseName:{
      type:"string",
      value:""
    }
    //1 for showing professor, 2 for showing courses, 3 for showing both
  },

  /**
   * 组件的初始数据
   */
  data: {
    isChinese: true
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  ready: function () { 
    this.setData({
      isChinese: app.globalData.isChinese
    })
   }
})
