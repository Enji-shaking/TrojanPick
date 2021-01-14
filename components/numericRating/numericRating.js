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
      type:"Number",
      value:1
    },difficultyRating:{
      type:"Number",
      value:1
    },workloadRating:{
      type:"Number",
      value:1
    },teachRating:{
      type:"Number",
      value:1
    },
    courseID:{
      type:"string",
      value: undefined
    },
    professorID:{
      type: "string",
      value: undefined
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list:[{
      item_id:"",
      item_value:""
    }],
    professorName:"professor",
    courseName:"course"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    choosePicker(option){
      if(this.data.dropDownType==1){
        this.setData({
          courseName:this.data.list[option.detail.value].item_value,
        })
      }else if(this.data.dropDownType==2){
        this.setData({
          professorName:this.data.list[option.detail.value].item_value
        })
      }
      this.triggerEvent("choosePicker",this.data.list[option.detail.value].item_id);
    }
  },
  ready:function(){
    if(this.properties.dropDownType==1){
      wx.cloud.callFunction({
        name:'getInfoById',
        data:{
          professorID:this.properties.professorID,
          target:"get_information_for_class_professor"
        },
        success: (res)=>{
          console.log(res);
          let temp = [{item_id: undefined, item_value: "course"}];
          let courseList = res.result.list;
          for(let i=0;i<courseList.length;i++){
            let item = {
              item_id:courseList[i].courseID,
              item_value:courseList[i].courseInfo[0].courseCode
            };
            temp.push(
              item
            );
          }
          this.setData({
            list:temp
          })
        },
        fail(res){
          console.log("fail");
        }
      })
    }else if(this.properties.dropDownType==2){
      wx.cloud.callFunction({
        name:'getInfoById',
        data:{
          courseID:this.properties.courseID,
          target:"get_information_for_class_professor"
        },
        success: (res)=>{
          console.log(res);
          let temp = [{item_id: undefined, item_value: "professor"}];
          let professorList = res.result.list;
          for(let i=0;i<professorList.length;i++){
            let item = {
              item_id:professorList[i].professorID,
              item_value:professorList[i].professorInfo[0].professorName
            }
            temp.push(
              item
            )
          }
          this.setData({
            list:temp
          })
          console.log(this.data.list);
        },
        fail(res){
          console.log("fail");
        }
      })
    }
  }
})
