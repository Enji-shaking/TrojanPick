// components/GradingInfo/gradingInfo.js
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
    tapped: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    iconTapped: function (e) {  
      console.log(this.data.tapped);
      this.setData({tapped: !this.data.tapped})
    }
  }
})
