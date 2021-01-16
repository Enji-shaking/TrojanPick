// pages/viewQuestion/viewQuestion.js
const app =  getApp();
  
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
        console.log(res);
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
  onShow: function () {
    if(app.globalData.needRefresh){
      console.log("HEY");
      this.searchQuestionsAndAnswers()
      app.globalData.needRefresh = false
    }  
  }
})