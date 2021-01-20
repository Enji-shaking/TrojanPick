let app =  getApp();
// TODO:
  
Page({
  data: {
    evaluateTitle:['Difficulty', 'Entertainmaint', 'Workload', 'Enrichment'],
    stars:[0, 1, 2, 3, 4],
    unselectedSrc: "/icon/others/rate-star.svg",
    selectedSrc: "/icon/others/favorite.svg",
    score: 0,
    scores: [0, 0, 0, 0],
    gradeIndex: 0,
    gradeArray: [' ', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'P', 'F', 'IP'],
    showModal: false,

    grade: "N/A",
    courseCode: "",
    courseID: "",
    classCode: "",
    professorName: "",
    professorID: "",
    anonymous: false,
    content: "",
    commentCount: 0,
    up_vote_count: 0,
    down_vote_count: 0,
    favoriteCount: 0,
    course_data: [],
    professor_data: [],
    show_course: false, // 是否显示下拉框
    show_prof: false,
    correctCourse: false, // 判断user是否选择了正确的课程
    correctProfessor: false,
    course_blurred: false, // 判断input框是否失焦
    prof_blurred: false,
    content_len: 0, // 评价字数
    text_color: "#953A3A", // 默认字的颜色
    text_color_prof: "#953A3A",
    openID: "",
  },

  // input搜索节流var
  course_timer: -1,
  prof_timer: -1,

  onLoad: function (options) { 
    const openID = wx.getStorageSync("openID");
    console.log(options);
    if(options.courseID){
      console.log("there is courseID");
      this.setData({
        courseCode: options.courseCode,
        courseID: options.courseID,
        openID: openID,
        correctCourse: true,
        text_color: "#953A3A"
      })
    }
    if(options.professorID){
      console.log("there is professorID");
      this.setData({
        professorID: options.professorID,
        professorName: options.professorName,
        openID: openID,
        correctProfessor: true,
        text_color_prof: "#953A3A"
      })
    }
  },

  // course input失焦时下拉框消失
  bindBlurCourse(e){
    if(this.data.active)
    this.setData({
      show_course: false,
      course_blurred: true
    })
  },

  // professor input失焦时下拉框消失
  bindBlurProf(e){
    this.setData({
      show_prof: false,
      prof_blurred: true
    })
  },

  // user没有input或输入courseCode查找不到
  loadEmptyCourse(){
    this.setData({
      course_data: [],
      show_course: false,
      correctCourse: false,
      text_color: "#6A6868"
    })
  },

  // user没有input或输入professorName查找不到
  loadEmptyProf(){
    this.setData({
      professor_data: [],
      show_prof: false,
      correctProfessor: false,
      text_color_prof: "#6A6868"
    })
  },

  // 保存输入courseCode & 从数据库找课程信息
  saveCourseCode(e){
    clearTimeout(this.course_timer)
    if(e.detail.value === ""){
      this.loadEmptyCourse()
    }
    else{
      this.setData({
        courseCode: e.detail.value,
        course_blurred: false,
        correctCourse: false,
        text_color: "#6A6868"
      })
      // setTimeout不可以直接传参数
      this.course_timer = setTimeout(this.searchCourse,1000)
    }
  },

  /*
  bindTapCourse: function(){
    this.setData({
      course_blurred: false
    })
  },
  */

  // search in the database for courseCode
  searchCourse: function(){
    console.log("search course");
    if(!this.data.course_blurred){
      wx.cloud.callFunction({
        name: "getRelatedInfo",
        data: {
          target: "courses",
          courseCode: this.data.courseCode
        },
        success: (res)=>{
          this.setData({
            course_data: res.result.data,
          })
          if(res.result.data[0] === undefined){
            this.loadEmptyCourse()
          }
          else{
            this.setData({
              show_course: true,
            })
            // user自己输入了完全正确的courseCode
            if(res.result.data[0].courseCode === this.data.courseCode){
              this.setData({
                correctCourse: true,
                text_color: "#953A3A",
                courseID: this.data.course_data[0]._id,
                show_course: false
              })
            }
          }
        },
        fail: err=>{
          console.log(err)
        }
      })
    }
 },

  // 点击选择课程
  selectCourse: function(e){
    this.setData({
      courseCode: this.data.course_data[e.currentTarget.dataset.index].courseCode,
      courseID: this.data.course_data[e.currentTarget.dataset.index]._id,
      show_course: false,
      correctCourse: true,
      text_color: "#953A3A"
    });
  },

  // 保存输入professorName & 从数据库找教授信息
  saveProfName(e){
    clearTimeout(this.prof_timer)
    if(e.detail.value === ""){
      this.loadEmptyProf()
    }
    else{
      this.setData({
        professorName: e.detail.value,
        prof_blurred: false,
        correctProfessor: false,
        text_color_prof: "#6A6868"
      })
      // setTimeout不可以直接传参数
      this.prof_timer = setTimeout(this.searchProfessor,1000)
    }
  },

  // search in the database for professorName
  searchProfessor: function(){
    if(!this.data.prof_blurred){
      wx.cloud.callFunction({
        name: "getRelatedInfo",
        data: {
          target: "professors",
          professorName: this.data.professorName
        },
        success: (res)=>{
          this.setData({
            professor_data: res.result.data
          })
          if(res.result.data[0] === undefined){
            this.loadEmptyProf()
          }
          else{
            this.setData({
              show_prof: true,
            })
            // user自己输入了完全正确的professorName
            if(res.result.data[0].professorName == this.data.professorName){
              this.setData({
                correctProfessor: true,
                text_color_prof: "#953A3A",
                professorID: this.data.professor_data[0]._id,
                show_prof: false
              })
            }
          }
        },
        fail: err=>{
          console.log(err)
        }
      })
    }
  },

  // 点击选择professor
  selectProfessor: function(e){
    this.setData({
      professorID: this.data.professor_data[e.currentTarget.dataset.index]._id,
      professorName: this.data.professor_data[e.currentTarget.dataset.index].professorName,
      show_prof: false,
      correctProfessor: true,
      text_color_prof: "#953A3A"
    })
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

  // 提交Review
  submitReview:function(e){
    if(this.data.courseCode.trim() === ""){
      wx.showToast({
        icon: 'none',
        title: 'Please enter a course code'
      })
      return false;
    } else if(this.data.professorName.trim() === "") {
      wx.showToast({
        icon: 'none',
        title: 'Please enter a professor name'
      })
      return false;
    }
    else if(this.data.content.trim() === ""){
      wx.showToast({
        icon: 'none',
        title: 'Please enter content'
      })
      return false;
    }
    else if(!this.data.correctCourse){
      wx.showToast({
        icon: 'none',
        title: 'Invalid Course'
      })
      return false;
    }
    else if(!this.data.correctProfessor){
      wx.showToast({
        icon: 'none',
        title: 'Invalid Professor'
      })
      return false;
    }
    wx.showLoading({
      title: "Loading",
      mask: true,
    });
    wx.cloud.callFunction({
      name: "addEntries",
      data: {
        target: "createReview",
        openID: this.data.openID,
        courseID: this.data.courseID,
        professorID: this.data.professorID,
        difficultyRating: this.data.scores[0],
        entertainmentRating: this.data.scores[1],
        workloadRating: this.data.scores[2],
        enrichmentRating: this.data.scores[3],
        grade: this.data.gradeArray[this.data.gradeIndex],
        anonymous: this.data.anonymous,
        content: this.data.content,
        commentCount: this.data.commentCount,
        up_vote_count: this.data.up_vote_count,
        down_vote_count: this.data.down_vote_count,
        favoriteCount: this.data.favoriteCount
      },
      success: res=>{
        console.log("提交Review成功")
        console.log(res);
        if(res.result && res.result.success === false){
          wx.hideLoading();
          wx.showToast({
            icon: "none",
            title: res.result.content
          })
        }else{
          app.globalData.needRefresh = true
          wx.hideLoading();
          wx.showToast({
            title: 'Success',
            mask: true,
            success: (result) => {
              setTimeout(function(){
                wx.navigateBack({
                  delta: 1,
                })
               }, 2000)
            },
          });
        }
        // 返回上一页面
      },
      fail: err=>{
        console.log("提交Review失败", err)
      }
    })
  },

  // 保存评价
  saveContent(e){
    this.setData({ 
      content: e.detail.value,
      content_len: parseInt(e.detail.value.length)
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
    this.setData({
      content: "",
      content_len: 0
    })
    this.hideModal();
  },

  onConfirm: function () {
    this.hideModal();
  }
})