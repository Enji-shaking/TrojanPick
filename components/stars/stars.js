// components/stars/stars.js
Component({
  /**
   * 组件的属性列表
   */
  observers:{
    'Rating': function () { 
      console.log("rating is changed");
      this.setData({
        rating: this.properties.Rating,
        ratingRest: 5-this.properties.Rating
      })
    }
  },
  properties: {
    Rating:{
      type:"Number",
      value:-1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // ratingArray:[],
    // restArray:[]
    rating: 0,
    ratingRest: 5
  },

  /**
   * 组件的方法列表
   */
  methods: {
 
  },
  attached:function(){
    this.setData({
      rating: this.properties.Rating,
      ratingRest: 5-this.properties.Rating
    })
  }
})
