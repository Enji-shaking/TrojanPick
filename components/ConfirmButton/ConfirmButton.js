// components/ConfirmButton/ConfirmButton.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type: String,
      value: "title"
    },
    onButtonTapped:{
      type: Function,
      value: ()=>0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onConfirmButtonTapped(){
      this.triggerEvent("onConfirm")
      // wx.navigateBack({
      //   delta: 1
      // });
      wx.showToast({
        title: 'Added Successfully',
        icon: 'none',
      });      
    }
  }
})
