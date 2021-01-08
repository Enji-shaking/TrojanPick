// pages/favoriteRatings/favoriteRatings.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reviews:[],
    professor_list:[{
      list_id:"",
      list_value:""
    }],
    course_list:[{
      list_id:"",
      list_value:""
    }],
    courses:[],
    professors:[],
    professorName:"全部",
    courseName:"全部",
    curProfessorID:"",
    curCourseID:"",
    openID:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    this.setData({
      openID:options.openID
    })
    wx.cloud.callFunction({
      name:'getProfileInfo',
      data:{
        target:"favoriteRatings",
        openID:options.openID
      }
    })
    .then(res =>{
      let reviews = [];
      let cloud_result = res.result.list;
      let professors = new Set();
      let courses = new Set();
      for(let i=0;i<cloud_result.length;i++){
        reviews.push(...cloud_result[i].reviews);
        professors.add(cloud_result[i].reviews[0].professorID);
        courses.add(cloud_result[i].reviews[0].courseID);
      }
      self.setData({
        reviews:reviews,
        courses:Array.from(courses),
        professors:Array.from(professors)
      });
    })
    .then(() => {
      //retrieve course list and professor list
      wx.cloud.callFunction({
        name:'getInfoById',
        data:{
          target:"list",
          professors:self.data.professors,
          courses:self.data.courses
        },
        success(res){
          console.log(self.data.courses);
          console.log(res);
          let professor_list = [];
          let course_list = [];
          let item = {
            list_id:undefined,
            list_value:"全部"
          }
          professor_list.push(item);
          course_list.push(item);
          res.result.course_data.forEach( e => {
            let item = {
              list_id:e._id,
              list_value:e.courseCode
            }
            course_list.push(item);
          })
          res.result.professor_data.forEach( e =>{
            let item = {
              list_id:e._id,
              list_value:e.professorName
            }
            professor_list.push(item);
          })
          self.setData({
            course_list:course_list,
            professor_list:professor_list
          })
          console.log(self.data.course_list);
        },
        fail(err){
        }
      })
    })
    .catch(console.error)
  },

  chooseCoursePicker(e){
    console.log(this.data.course_list);
    let self = this;
    this.setData({
      curCourseID:this.data.course_list[e.detail.value].list_id,
      courseName:this.data.course_list[e.detail.value].list_value
    })
    console.log(this.data.curProfessorID);
    console.log(this.data.curCourseID);
    
    wx.cloud.callFunction({
      name:"getReviews",
      data:{
        courseID:this.data.curCourseID,
        pfessorID:this.data.curProfessorID,
        openID:this.data.openID,
        target:'get_rating_saved_reviews'
      }
    })
    .then(res => {
      console.log(res.result);
      let list = res.result.data.list;
      let reviews = []; 
      list.forEach( e => {
        if(e.review.length!=0){
          reviews.push(e.review[0])
        }
      })
      self.setData({
        reviews:reviews
      })
    })
    .catch(console.error)
  },
  chooseProPicker(e){
    console.log(e.detail);
    console.log(this.data.professor_list);
    let self = this;
    this.setData({
      curProfessorID:this.data.professor_list[e.detail.value].list_id,
      professorName:this.data.professor_list[e.detail.value].list_value
    })
    console.log(this.data.curProfessorID);
    console.log(this.data.curCourseID);
    
    wx.cloud.callFunction({
      name:"getReviews",
      data:{
        courseID:this.data.curCourseID,
        pfessorID:this.data.curProfessorID,
        openID:this.data.openID,
        target:'get_rating_saved_reviews'
      }
    })
    .then(res => {
      console.log(res.result);
      let list = res.result.data.list;
      let reviews = []; 
      list.forEach( e => {
        if(e.review.length!=0){
          reviews.push(e.review[0])
        }
      })
      self.setData({
        reviews:reviews
      })
    })
    .catch(console.error)
  }
})