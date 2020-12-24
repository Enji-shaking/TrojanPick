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
    professorID:{
      type:"string",
      value:"professor id"
    },
    courseID:{
      type:"string",
      value:""
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
    comments:{
      type:"array",
      value:[]
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
    },
    //if detail is true, show all content
    couseID:{
      type:"string",
      value:""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    professorName:"",
    courseCode:""
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  attached:function(){
    let self = this;
    if(this.data.type==2){ 
      wx.cloud.callFunction({
        name:'getInfoById',
        data:{
          courseID:self.properties.courseID,
          target:'fromProfessor'
        },
        success(res){
          self.setData({
          
            courseCode:res.result.data[0].courseCode
          })
        },
        fail(res){
          console.log("fail");
        }
      })
    }else if(this.data.type==1){
      wx.cloud.callFunction({
        name:'getInfoById',
        data:{
          professorID:this.properties.professorID,
          target:'fromCourse'
        },
        success(res){
         self.setData({
           professorName:res.result.data[0].professorName
         })
        },
        fail(res){
          console.log("fail");
        }
      })
    }
  }
})
