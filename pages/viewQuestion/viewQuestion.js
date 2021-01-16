// pages/viewQuestion/viewQuestion.js
const app =  getApp();
Page({
  data: {
    questions: [],
    courseID: "",
    own_questions: [],
    openID: "",
    // favored: []
  },

  loadEmptyQuestions: function(){
    this.setData({
      questions: [],
      own_questions: []
    })
  },

  searchQuestionsAndAnswers: function(){
    wx.cloud.callFunction({
      name: "getQuestions",
      data: {
        target: "questionsAndAnswers",
        courseID: this.data.courseID
      },
      success: res=>{
        console.log(res);
        this.setData({
          questions: res.result.list,
        })

      },
      fail: err=>{
        console.log(err)
      }
    })

  },

  deleteQuestion: function(e){
    wx.cloud.callFunction({
      name: "deleteEntries",
      data:{
        target: "deleteQuestion",
        questionID: this.data.questions[e.currentTarget.dataset.index]._id
      },
      success: res=>{
        this.data.questions.splice(e.currentTarget.dataset.index, 1)
        // this.data.own_questions.splice(e.currentTarget.dataset.index, 1)
        this.setData({
          questions: this.data.questions,
          // own_question: this.data.own_questions,
        })
        app.globalData.needRefresh = true
      }
    })
  },

  favored_cancel: function(e){
    wx.cloud.callFunction({
      name: "vote_save",
      data:{
        target: "favored_question_cancel",
        questionID: this.data.questions[e.currentTarget.dataset.index]._id,
        openID: this.data.openID
      },
      success: res=>{
        // this.data.favored[e.currentTarget.dataset.index] = false
        this.data.questions[e.currentTarget.dataset.index].favoredCount--
        this.data.questions[e.currentTarget.dataset.index].favored_by_me = false
        this.setData({
          // favored: this.data.favored,
          questions: this.data.questions
        })
      }
    })
  },

  favored_new: function(e){
    console.log(this.data.questions[e.currentTarget.dataset.index].content)
    wx.cloud.callFunction({
      name: "vote_save",
      data:{
        target: "favored_question_new",
        questionID: this.data.questions[e.currentTarget.dataset.index]._id,
        courseID: this.data.courseID,
        openID: this.data.openID
      },
      success: res=>{
        // this.data.favored[e.currentTarget.dataset.index] = true
        this.data.questions[e.currentTarget.dataset.index].favoredCount++
        this.data.questions[e.currentTarget.dataset.index].favored_by_me = true
        this.setData({
          // favored: this.data.favored,
          questions: this.data.questions
        })
      }
    })
  },

  onLoad: function (options) {
    const openID = wx.getStorageSync("openID");
    this.setData({openID})
    this.setData({
      courseID: options.courseID
    })
    this.searchQuestionsAndAnswers()
  },
  onShow: function () {
    if(app.globalData.needRefresh){
      console.log("HEY");
      this.searchQuestionsAndAnswers()
      app.globalData.needRefresh = false
    }  
  },
  navigateToCreateQuestion: function (){
    wx.navigateTo({
      url: '/pages/createQuestion/createQuestion?courseID='+this.data.courseID,
    })
  }
})