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
    tapped: true,
    showModal: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    iconTapped: function (e) {  
      if(this.data.showModal){
        this.setData({
          showModal: false
        })
      }
      else{
        this.setData({
          showModal: true
        })
      }
    },
    hideModal: function(e){
      this.setData({
        showModal: false
      })
    },
  }
})
