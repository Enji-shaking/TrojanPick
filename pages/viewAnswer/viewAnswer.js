let app =  getApp();

  
Page({
  data: {
    questionID: "",
    question: [],
    answers: [],
    showModal: false,
    content: "",
    content_len: 0,
    own_question: false,
    own_answer: [],
    attitude_on_answer: [],
    votes: [],
    openID: "",
  },

  getAnswers: function(){
    wx.cloud.callFunction({
      name: "getQuestions",
      data:{
        target: "answersForAQuestion",
        questionID: this.data.questionID,
        openID: this.data.openID
      },
      success: res=>{
        console.log(res)
        // return
        this.setData({
          question: res.result[0],
          answers: res.result[0].answers
        })
        if( !res.result[0].answers ){
          this.setAnswersEmpty()
        }
        if(this.data.question.openID === this.data.openID){
          this.setData({
            own_question: true
          })
        }
      },
      fail: err=>{
        console.log(err)
      }
    })
  },
  
  setAnswersEmpty: function(){
    this.setData({
      answers: [],
    })
  },

  onLoad: function (options) {
    const openID = wx.getStorageSync("openID");
    this.setData({
      openID,
      // questionID: "21ded5cb5ffd6ed804b50c3f4caa6f28"
      questionID: options.questionID
    })
    this.getAnswers()
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
      name: 'addEntries',
      data: {
        target: "createAnswer",
        questionID: this.data.questionID,
        openID: this.data.openID,
        content: this.data.content,
        up_vote_count: 0,
        down_vote_count: 0,
      },
      success: res=>{
        wx.showToast({
          icon: 'success',
          title: '回答成功'
        })
        this.hideModal();
        this.data.answers.push({
          _id: res.result._id,
          questionID: this.data.questionID,
          openID: this.data.openID,
          content: this.data.content,
          up_vote_count: 0,
          down_vote_count: 0,
          postedTime: this.getCurrentTime(),
          posted_by_me: true,
          voted_by_me: 0

        });
        this.data.own_answer.push(true)
        this.data.votes.push(0)
        this.setData({
          answers: this.data.answers,
          own_answer: this.data.own_answer,
          votes: this.data.votes
        })
      }
    })
  },
  getCurrentTime: function(){
    const date = new Date()
    const year = date.getFullYear()
    let month = date.getMonth()+1
    if(month < 10) month = "0"+month
    let day = date.getDate()
    if(day < 10) day = "0"+day
    return (`${year}-${month}-${day}`);
  },
  deleteQuestion: function(){
    wx.cloud.callFunction({
      name: "deleteEntries",
      data:{
        target: "deleteQuestion",
        questionID: this.data.questionID,
        openID: this.data.openID,
      },
      success: res=>{
        this.setData({
          question: ""
        })
        this.setAnswersEmpty()
        app.globalData.needRefresh = true
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  },

  deleteAnswerTapped: function(e){
    wx.cloud.callFunction({
      name: 'deleteEntries',
      data:{
        target: 'deleteAnswer',
        answerID: this.data.answers[e.currentTarget.dataset.index]._id,
      openID: this.data.openID,
      },
      success: res=>{
        this.data.answers.splice(e.currentTarget.dataset.index, 1)
        this.setData({
          answers: this.data.answers,
        })
      },
      fail: err=>{
        console.log(err)
      }
    })
  },
  upVoteTapped: function (e) {
    console.log(this.data.answers[e.currentTarget.dataset.index]);
    const answer = this.data.answers[e.currentTarget.dataset.index]
    if(answer.voted_by_me === 0){
      this.vote_answer_up_new(answer)
    }else if(answer.voted_by_me === -1){
      this.vote_answer_up_fromDown(answer)
    }else{
      this.vote_answer_up_cancel(answer)
    }
    this.setData({answers: this.data.answers})
  },
  downVoteTapped: function (e) {  
    console.log(this.data.answers[e.currentTarget.dataset.index]);
    const answer = this.data.answers[e.currentTarget.dataset.index]
    if(answer.voted_by_me === 0){
      this.vote_answer_down_new(answer)
    }else if(answer.voted_by_me === -1){
      this.vote_answer_down_cancel(answer)
    }else{
      this.vote_answer_down_fromUp(answer)
    }
    this.setData({answers: this.data.answers})
  },
  vote_answer_up_cancel: function(answer){
    answer.voted_by_me = 0
    answer.up_vote_count--
    wx.cloud.callFunction({
      name: "vote_save",
      data:{
        target: "vote_answer_up_cancel",
        openID: this.data.openID,
        answerID: answer._id,
      }
    })
  },
  vote_answer_down_cancel: function(answer){
    answer.voted_by_me = 0
    answer.down_vote_count--
    wx.cloud.callFunction({
      name: "vote_save",
      data:{
        target: "vote_answer_down_cancel",
        openID: this.data.openID,
        answerID: answer._id,
      }
    })
  },

  vote_answer_down_fromUp: function(answer){
    answer.voted_by_me = -1
    answer.up_vote_count--
    answer.down_vote_count++
    wx.cloud.callFunction({
      name: "vote_save",
      data:{
        target: "vote_answer_down_fromUp",
        openID: this.data.openID,
        answerID: answer._id,
      }
    })
  },

  vote_answer_up_fromDown: function(answer){
    answer.voted_by_me = 1
    answer.up_vote_count++
    answer.down_vote_count--
    wx.cloud.callFunction({
      name: "vote_save",
      data:{
        target: "vote_answer_up_fromDown",
        openID: this.data.openID,
        answerID: answer._id,
      }
    })
  },

  vote_answer_up_new: function(answer){
    answer.voted_by_me = 1
    answer.up_vote_count++
    wx.cloud.callFunction({
      name: "vote_save",
      data:{
        target: "vote_answer_up_new",
        openID: this.data.openID,
        answerID: answer._id,
        questionID: this.data.questionID
      }
    })
  },

  vote_answer_down_new: function(answer){
    answer.voted_by_me = -1
    answer.down_vote_count++
    wx.cloud.callFunction({
      name: "vote_save",
      data:{
        target: "vote_answer_down_new",
        openID: this.data.openID,
        answerID: answer._id,
        questionID: this.data.questionID
      },
    })
  },

  favored_cancel: function(e){
    app.globalData.questionNeedRefresh = true
    wx.cloud.callFunction({
      name: "vote_save",
      data:{
        target: "favored_question_cancel",
        questionID: this.data.questionID,
        openID: this.data.openID
      },
      success: res=>{
        // this.data.favored[e.currentTarget.dataset.index] = false
        this.data.question.favoredCount--
        this.data.question.favored_by_me = false
        this.setData({
          // favored: this.data.favored,
          question: this.data.question
        })
      }
    })
  },

  favored_new: function(e){
    app.globalData.questionNeedRefresh = true
    console.log(this.data.question)
    wx.cloud.callFunction({
      name: "vote_save",
      data:{
        target: "favored_question_new",
        questionID: this.data.questionID,
        courseID: this.data.courseID,
        openID: this.data.openID
      },
      success: res=>{
        this.data.question.favoredCount++
        this.data.question.favored_by_me = true
        this.setData({
          question: this.data.question
        })
      }
    })
  },
})