// components/numericRating/numericRating.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dropDownType:{
      type:"int",
      value:1
    },
    //if 1 load all courses
    //if 2 load all professors
    //if 3 load all
    interestRating:{
      type:"float",
      value:1
    },difficultyRating:{
      type:"float",
      value:1
    },workloadRating:{
      type:"float",
      value:1
    },teachRating:{
      type:"float",
      value:1
    },
    infoID:{
      type:"string",
      value:""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  attached:function(){
    let self = this;
    console.log(this.properties.infoID);
    if(this.properties.dropDownType==1){
      wx.cloud.callFunction({
        name:'getWithRelation',
        data:{
          id:this.properties.infoID,
          target:"fromProfessor"
        },
        success(res){
          let temp = [];
          let result = res.result.data.list;
          console.log(result);
          for(let i=0;i<result.length;i++){
            temp.push(result[i].list[0].courseCode);
          }
          self.setData({
            list:temp
          })
        },
        fail(res){
          console.log("fail");
        }
      })
    }else if(this.properties.dropDownType==2){
      wx.cloud.callFunction({
        name:'getWithRelation',
        data:{
          id:this.properties.infoID,
          target:"fromCourse"
        },
        success(res){
          let temp = [];
          let result = res.result.data.list;
          console.log(result);
          for(let i=0;i<result.length;i++){
            temp.push(result[i].list[0].professorName);
          }
          self.setData({
            list:temp
          })
          console.log(temp);
        },
        fail(res){
          console.log("fail");
        }
      }
      )
    }else if(this.properties.dropDownType==3){

    }
  }
})
