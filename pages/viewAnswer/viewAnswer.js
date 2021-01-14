// TODO:
// 1. PostedTime
// 2. Delete Answer
// 3. Upvote Downvote

Page({
  data: {
    questionID: "",
    question: "",
    showModal: false,
    content: "",
    content_len: 0,
    submittedNewAnswer: false,

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
        })
        if(res.result.list[0].answers[0] === undefined){
          this.loadEmptyAnswers()
        }
      },
      fail: err=>{
        console.log(err)
      }
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
        this.data.question.answers.push({
          questionID: this.data.questionID,
          openID: this.data.openID,
          content: this.data.content,
          up_vote_count: 0,
          down_vote_count: 0,
          postedTime: "111-11-11"
        });
        this.setData({
          question: this.data.question
        })
      }
    })
  }
})