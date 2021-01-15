// TODO:
// 1. PostedTime
// 3. Upvote Downvote

Page({
  data: {
    questionID: "",
    question: "",
    answers: [],
    showModal: false,
    content: "",
    content_len: 0,
    own_question: false,
    own_answer: [],

    openID: "",
  },

  searchAnswers: function(){
    wx.cloud.callFunction({
      name: "getQuestions",
      data:{
        target: "answers",
        questionID: this.data.questionID
      },
      success: res=>{
        this.setData({
          question: res.result.list[0],
          answers: res.result.list[0].answers
        })
        if(res.result.list[0].answers[0] === undefined){
          this.loadEmptyAnswers()
        }
        if(this.data.question.openID === this.data.openID){
          this.setData({
            own_question: true
          })
        }
        for(var i = 0; i < this.data.answers.length; i++){
          if(this.data.answers[i].openID === this.data.openID){
            this.data.own_answer.push(true)
          }
          else{
            this.data.own_answer.push(false)
          }
        }
        this.setData({
          own_answer: this.data.own_answer
        })
      },
      fail: err=>{
        console.log(err)
      }
    })
  },

  loadEmptyAnswers: function(){
    this.setData({
      answers: [],
    })
  },

  onLoad: function (options) {
    const openID = wx.getStorageSync("openID");
    this.setData({openID})
    this.setData({
      questionID: "21ded5cb5ffd6ed804b50c3f4caa6f28"
      // questionID: options.questionID
    })
    this.searchAnswers()
  },

  createAnswer: function(){
    this.setData({
      showModal: true
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

  onSave: function () {
    this.hideModal();
  },

  // 提交
  onSubmit: function () {
    if(this.data.content === ""){
      wx.showToast({
        icon: 'none',
        title: '请填写回答'
      })
      return false
    }
    wx.cloud.callFunction({
      name: 'createAnswer',
      data: {
        questionID: this.data.questionID,
        openID: this.data.openID,
        content: this.data.content,
        up_vote_count: 0,
        down_vote_count: 0,
        postedTime: "111-11-11"
      },
      success: res=>{
        wx.showToast({
          icon: 'success',
          title: '回答成功'
        })
        this.hideModal();
        this.data.answers.push({
          questionID: this.data.questionID,
          openID: this.data.openID,
          content: this.data.content,
          up_vote_count: 0,
          down_vote_count: 0,
          postedTime: "111-11-11"
        });
        this.data.own_answer.push(true),
        this.setData({
          answers: this.data.answers,
          own_answer: this.data.own_answer
        })
      }
    })
  },

  deleteQuestion: function(){
    wx.cloud.callFunction({
      name: "deleteQuestionAnswer",
      data:{
        target: "deleteQuestion",
        questionID: this.data.question._id
      },
      success: res=>{
        this.setData({
          question: ""
        })
        this.loadEmptyAnswers()
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  },

  deleteAnswer: function(e){
    console.log(this.data.answers[e.currentTarget.dataset.index]._id)
    wx.cloud.callFunction({
      name: 'deleteQuestionAnswer',
      data:{
        target: 'deleteAnswer',
        answerID: this.data.answers[e.currentTarget.dataset.index]._id
      },
      success: res=>{
        this.data.answers.splice(e.currentTarget.dataset.index, 1),
        this.data.own_answer.splice(e.currentTarget.dataset.index, 1),
        this.setData({
          answers: this.data.answers,
          own_answer: this.data.own_answer
        })
      },
      fail: err=>{
        console.log(err)
      }
    })
  }
})