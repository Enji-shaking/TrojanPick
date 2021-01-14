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
        // console.log(res.result.list[0].answers[0].content)
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
      courseID: "023ce9555ff3d8bd0360a85d194020ab"
      // courseID: options.courseID
    })
    this.searchQuestionsAndAnswers()
  },
})