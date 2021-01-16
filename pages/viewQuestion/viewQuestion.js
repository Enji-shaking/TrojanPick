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
        this.setData({
          questions: res.result.list,
        })
        // if(res.result.list[0] === undefined){
        //   this.loadEmptyQuestions()
        //   return false
        // }
        // for(var i = 0; i < this.data.questions.length; i++){
        //   if(this.data.questions[i].openID === this.data.openID){
        //     this.data.own_questions.push(true)
        //   }
        //   else{
        //     this.data.own_questions.push(false)
        //   }
        // }
        // this.setData({
        //   own_questions: this.data.own_questions
        // })
      },
      fail: err=>{
        console.log(err)
      }
    })
    // find user's favored questions
    // wx.cloud.callFunction({
    //   name: "getQuestions",
    //   data:{
    //     target: "question_favored",
    //     courseID: this.data.courseID,
    //     openID: this.data.openID
    //   },
    //   success: res=>{
    //     console.log(res)
    //     if(res.result.length === 0){
    //       for(let i = 0; i < this.data.questions.length; i++){
    //         this.data.favored.push(false)
    //       }
    //     }
    //     else{
    //       for(let i = 0; i < this.data.questions.length; i++){
    //         inter:
    //         for(let j = 0; j < res.result.length; j++){
    //           if(this.data.questions[i]._id === res.result[j]){
    //             this.data.favored.push(true)
    //             break inter
    //           }
    //           if(j === res.result.length - 1){
    //             this.data.favored.push(false)
    //           }
    //         }
    //       }
    //     }
    //     this.setData({
    //       favored: this.data.favored
    //     })
    //     console.log(this.data.favored)
    //   }
    // })
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