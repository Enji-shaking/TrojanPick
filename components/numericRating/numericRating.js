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
    list:[{
      list_id:"",
      list_value:""
    }],
    professorName:"professor",
    courseName:"course"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    choosePicker(option){
      console.log(this.data.list[option.detail.value].list_id + this.data.list[option.detail.value].list_value);
      if(this.data.dropDownType==1){
        this.setData({
          courseName:this.data.list[option.detail.value].list_value,
        })
      }else if(this.data.dropDownType==2){
        this.setData({
          professorName:this.data.list[option.detail.value].list_value
        })
      }
      this.triggerEvent("itemclick",this.data.list[option.detail.value].list_id);
      
    }
  },
  attached:function(){
    let self = this;
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
          for(let i=0;i<result.length;i++){
            let item = {
              list_id:result[i].class_id,
              list_value:result[i].list[0].courseCode
            };
            temp.push(item);
          }
          self.setData({
            list:temp
          })
          console.log(self.data.list);
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
          for(let i=0;i<result.length;i++){
            let item = {
              list_id:result[i].professor_id,
              list_value:result[i].list[0].professorName
            };
            temp.push(
              item
            );
          }
          self.setData({
            list:temp
          })
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
