// pages/viewQuestion/viewQuestion.js
Page({
  data: {
    questions: [],
    courseID: "",
  },

  loadEmptyQuestions: function(){
    this.setData({
      questions: []
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
        this.setData({
          questions: res.result.list,
        })
        if(res.result.list[0] === undefined){
          this.loadEmptyQuestions()
        }
      },
      fail: err=>{
        console.log(err)
      }
    })
  },

  onLoad: function (options) {
    this.setData({
      courseID: options.courseID
    })
    this.searchQuestionsAndAnswers()
  },
})