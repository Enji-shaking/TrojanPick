// components/Rating/Rating.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userName:{
      type:"string",
      value:"User Name"
    },
    professorName:{
      type:"string",
      value:"professor name"
    },
    courseCode:{
      type:"string",
      value:"course code"
    },
    content:{
      type:"string",
      value:"评价..."
    },
    difficultRat:{
      type:"int",
      value:0
    },
    interestRat:{
      type:"int",
      value:0
    },
    workloadRat:{
      type:"int",
      value:0
    },
    teachRat:{
      type:"int",
      value:0
    },
    voteUp:{
      type:"int",
      value:0
    },
    voteDown:{
      type:"int",
      value:0
    },
    comment:{
      type:"int",
      value:0
    },
    favorite:{
      type:"int",
      value:0
    },
    type:{
      type:"int",
      value:1
    },
    //if type is 1, show user and courseCode. 2 show user and professorName
    //3 show professor and coursecode
    detail:{
      type:"boolean",
      value:false
    }
    //if detail is true, show all content
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

  },
  attached:function(){
    console.log(this.properties.type);
  }
})
