// TODO:
// 1. 修改picker-view样式，hidden的时间太快了
// 2. transfer courseCode and professorName to courseID and professorID in order to save review
// 3. console.log all data to enji
// 4. calculate all averages and update information in the professors/classes review
// 5. future update with UI (the modal: 如何可以使用户pull up键盘的时候它处于页面上端； 最大字数限制等)

Page({
  /**
   * Page initial data
   */
  data: {
    evaluateTitle:['课程难度', '内容趣味性', 'workload', 'teaching'],
    stars:[0, 1, 2, 3, 4],
    unselectedSrc: "/icon/others/rate-star.svg",
    selectedSrc: "/icon/others/favorite.svg",
    score: 0,
    scores: [0, 0, 0, 0],
    gradeIndex: 0,
    gradeArray: [' ', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'P', 'F', 'IP'],
    showModal: false,

    grade: "",
    courseCode: "",
    courseID: "",
    classCode: "",
    professorName: "",
    professorID: "",
    course_professor_ID: "",
    anonymous: false,
    content: "",
    commentCount: 0,
    up_vote_count: 0,
    down_vote_count: 0,
    favoriteCount: 0,
    hidden1: true,
    hidden2: true,
    course_data: [],
    professor_data: []
  },

  // 调用云函数按照用户输入找到相应courseCode
  saveCourseCode(e){
    wx.cloud.callFunction({
      name: "getRelatedInfo",
      data: {
        target: "courses",
        courseCode: e.detail.value
      },
      success: (res)=>{
        console.log(res.result.data);
        this.setData({
          course_data: res.result.data
        })
      },
      fail: err=>{
        console.log(err)
      }
    })
    
    this.setData({
      courseCode: e.detail.value,
      hidden1: false
    })
    console.log("成功选择course为 ", this.data.courseCode)
  },

  // picker-view选择course
  selectCourse: function(e){
    console.log("current index selected is" , e.detail.value)
    this.setData({
      courseID: this.data.course_data[e.detail.value]._id,
      courseCode: this.data.course_data[e.detail.value].courseCode,
      hidden1: true
    })
    console.log("current course selected is ", this.data.courseID)
  },

  // 调用云函数按照用户输入找到相应professor name
  saveProfName(e){
    wx.cloud.callFunction({
      name: "getRelatedInfo",
      data: {
        target: "professors",
        professorName: e.detail.value
      },
      success: (res)=>{
        console.log(res);
        this.setData({
          professor_data: res.result.data
        })
      },
      fail: err=>{
        console.log(err)
      }
    })
    
    this.setData({
      professorName: e.detail.value,
      hidden2: false
    })
    console.log("成功选择professor为 ", this.data.professorName)
  },

  // picker-view选择professor
  selectProfessor: function(e){
    console.log("current index selected is" , e.detail.value)
    this.setData({
      professorID: this.data.professor_data[e.detail.value]._id,
      professorName: this.data.professor_data[e.detail.value].professorName,
      hidden2: true
    })
    console.log("current professor selected is ", this.data.professorID)
  },

  // 保存评价
  saveContent(e){
    this.setData({
      content: e.detail.value
    })
    console.log("成功填写评价为 ", this.data.content)
  },

  // 选择成绩
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      gradeIndex: e.detail.value,
    })
    console.log("成功填写成绩为 ", this.data.gradeArray[this.data.gradeIndex])
  },
  
  // 选择星星
  selectStar: function(e){
    var score = e.currentTarget.dataset.score
    this.data.scores[e.currentTarget.dataset.idx] = score
    this.setData({
      scores: this.data.scores,
      score: score
    })
    console.log("成功填写评分为 ", this.data.scores)
  },

  // 选择匿名
  changeAnonymous:function(e){
    this.setData({
      anonymous: e.detail.value
    })
    console.log("checkbox选择改变，携带值为", this.data.anonymous)
  },

  // 提交问题
  submitQuestion:function(e){
    if(this.data.courseCode.trim() === "" || this.data.professorName.trim() === "" || this.data.content.trim() === ""){
      wx.showToast({
        title: '未填写完成',
      })
      return false;
    }
    wx.cloud.callFunction({
      name: "createReview",
      data: {
        courseID: this.data.courseID,
        professorID: this.data.professorID,
        difficultyRating: this.data.scores[0],
        interestingRating: this.data.scores[1],
        workloadRating: this.data.scores[2],
        teachingRating: this.data.scores[3],
        grade: this.data.gradeArray[this.data.gradeIndex],
        anonymous: this.data.anonymous,
        content: this.data.content,
        commentCount: this.data.commentCount,
        up_vote_count: this.data.up_vote_count,
        down_vote_count: this.data.down_vote_count,
        favoriteCount: this.data.favoriteCount
      },

      sucess: res=>{
        console.log("获取数据成功", res)
        // console.log一份数据给后台？
      },
      fail: err=>{
        console.log("获取数据失败", err)
      }
    })
  },

  showDialogBtn: function() {
    this.setData({
      showModal: true
    })
  },

  preventTouchMove: function () {
  },

  hideModal: function () {
    this.setData({
      showModal: false
    });
  },

  onCancel: function () {
    this.hideModal();
  },

  onConfirm: function () {
    this.hideModal();
  },

})