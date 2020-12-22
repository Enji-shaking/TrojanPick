// components/stars/stars.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    "Rating":{
      type:"int",
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    ratingArray:[],
    restArray:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
 
  },
  attached:function(){
    let rating = this.data.ratingArray;
    let rest = this.data.restArray;
    for(let i=0;i<this.properties.Rating;i++){
      rating.push(1);
    }
    for(let i=0;i<5-this.properties.Rating;i++){
      rest.push(1);
    }
    this.setData({
      ratingArray:rating,
      restArray:rest
    })
    console.log(this.data.ratingArray);
    console.log(this.data.restArray);
  }
})
