// pages/pastReviews/pastReviews.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reviews: [],
    courses: [],
    professors: [],
    professor_list: [{
      list_id: "",
      list_value: ""
    }],
    course_list: [{
      list_id: "",
      list_value: ""
    }],
    courseName: "全部",
    professorName: "全部",
    curProfessorID: "",
    curCourseID: "",
    openID: "",
    totalPage: 0,
    currentPageInReviews: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  counter: 3,
  onLoad: function (options) {
    // options.openID="oH5r15EPI59JgaNhhebzuDsOpPEo";
    wx.showLoading({
      title: "loading",
      mask: true,
    });
    this.setData({
      openID: options.openID
    })
    
   this.getReviewsForCourseForProfessorForPage(1,this.data.curCourseID,this.data.curProfessorID,true);
   this.getTotalPage();
   this.getAllPicker();
  },
  chooseCoursePicker(e) {
    this.setData({
      curCourseID: this.data.course_list[e.detail.value].list_id,
      courseName: this.data.course_list[e.detail.value].list_value
    })
    this.getTotalPage();
    this.setData({
      currentPageInReviews:1
    })
    this.getReviewsForCourseForProfessorForPage(1,this.data.curCourseID,this.data.curProfessorID,false)
  },
  chooseProPicker(e) {
    this.setData({
      curProfessorID: this.data.professor_list[e.detail.value].list_id,
      professorName: this.data.professor_list[e.detail.value].list_value
    })
    this.getTotalPage();
    this.setData({
      currentPageInReviews:1
    })
    this.getReviewsForCourseForProfessorForPage(1,this.data.curCourseID,this.data.curProfessorID,false);
  },
  handlePagination(e){
    console.log(e.detail);
    this.setData({currentPageInReviews: e.detail})
    this.getReviewsForCourseForProfessorForPage(e.detail, this.data.curCourseID, this.data.curProfessorID,false)
  },
  //update
  getReviewsForCourseForProfessorForPage: function (page, courseID, professorID,onLoad) { 
    wx.cloud.callFunction({
      name:'getProfileInfo',
      data:{
        courseID: courseID,
        target:'pastReviews',
        professorID: professorID,
        openID: this.data.openID,
        currentPageInReviews: page
      },
      success: (res)=>{
        console.log(res.result);
        let reviews = [];
        let cloud_result = res.result;
        console.log(cloud_result);
        for(let i=0;i<cloud_result.length;i++){
          if(cloud_result[i]==undefined){
            reviews.push(this.data.deleted);
          }else{
            reviews.push(cloud_result[i]);
          }
        }
        this.setData({
          reviews:reviews,
        });
        this.counter--
        if (this.counter === 0) {
          wx.hideLoading();
        }
      },
      fail(err){
        console.log(err)
        wx.hideLoading();
        wx.showToast({
          title: 'Error, try again later',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
        });
      }
    })
   },
   getAllPicker(){
    wx.cloud.callFunction({
      name:'getProfileInfo',
      data:{
        target:"getAllPickerPastReviews",
        openID:this.data.openID
      }
    })
    .then(res => {
      let cloud_result = res.result;
      let visitedProfessor = new Set();
      let visitedCourse = new Set();
      let professor_list = [{list_id:undefined,list_value:"全部"}];
      let course_list = [{list_id:undefined,list_value:"全部"}];
      for(let i=0;i<cloud_result.length;i++){
        if(cloud_result[i]){
          if(!visitedProfessor.has(cloud_result[i].professorInfo[0]._id)){
            let professorItem = {
              list_id:cloud_result[i].professorInfo[0]._id,
              list_value:cloud_result[i].professorInfo[0].professorName
            }
            professor_list.push(professorItem);
            visitedProfessor.add(cloud_result[i].professorInfo[0]._id);
          }
          if(!visitedCourse.has(cloud_result[i].courseInfo[0]._id)){
            let courseItem = {
              list_id:cloud_result[i].courseInfo[0]._id,
              list_value:cloud_result[i].courseInfo[0].courseCode
            }
            course_list.push(courseItem);
            visitedCourse.add(cloud_result[i].courseInfo[0]._id);
          }
        }
      }
      this.setData({
        course_list:course_list,
        professor_list:professor_list
      })
      console.log(res);
      this.counter--
        if (this.counter === 0) {
          wx.hideLoading();
        }
    })
    .catch(err => {
      console.error(err);
      wx.hideLoading();
      wx.showToast({
        title: 'Error, try again later',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
    })
  },
   getTotalPage(){
    wx.cloud.callFunction({
      name:'getProfileInfo',
      data:{
        target:"countTotalPagesPastReviews",
        professorID:this.data.curProfessorID,
        courseID:this.data.curCourseID,
        openID:this.data.openID,
        currentPageInReviews:this.data.currentPageInReviews
      }
    })
    .then(res=>{
      console.log(res.result);
      this.setData({
        totalPage:res.result
      })
      this.counter--
      if (this.counter === 0) {
        wx.hideLoading();
      }
    })
    .catch(err => {
      console.error(err);
      wx.hideLoading();
      wx.showToast({
        title: 'Error, try again later',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
    })
  },
  deleteTappedFromReview(e) {
    const d = this.data.reviews
    d.splice(e.target.dataset.index, 1);
    this.setData({ reviews: d })
  },
})