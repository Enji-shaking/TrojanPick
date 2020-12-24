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
    // onButtonTapped:{
    //   type: Function,
    //   value: ()=>0
    // },
    loginbutton:{
      type: Boolean,
      value: false
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
      if(this.triggerEvent("onConfirm")){
        wx.navigateBack({
          delta: 1
        })
        wx.showToast({
          title: 'Added Successfully',
          icon: 'none',
        })
      }else{
        console.log("returned false");
      }
    }
  }
})
