// components/ClassCards/ClassCards.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    course_cards_info:{
      type: "array",
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // course_cards_info:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  attached:function(){
    // this.setData({
    //   course_cards_info:this.properties.course_cards_info
    // })
  }
})
