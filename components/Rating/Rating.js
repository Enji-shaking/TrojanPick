// components/Rating/Rating.js
Component({
  /**
   * 组件的属性列表
   */
  observers: {
    'index': function () {
      const openID = wx.getStorageSync("openID");
      this.setData({
        voteUp: this.properties.voteUpProp,
        voteDown: this.properties.voteDownProp,
        commentCount: this.properties.commentCountProp,
        favoriteCount: this.properties.favoriteCountProp,
        voted_by_me: this.properties.voted_by_me_prop,
        saved_by_me: this.properties.saved_by_me_prop,
        openID: openID
      })
    }
  },
  properties: {
    reviewID: {
      type: "String",
      value: ""
    },
    deleted:{
      type:"Bool",
      value:false
    },
    index: {
      type: "Number",
      value: ""
    },
    nickName: {
      type: "String",
      value: "User Name"
    },
    avatarUrl: {
      type: "String",
      value: "https://www.impactplus.com/hubfs/404-error-page-examples-best.jpg"
    },
    anonymous:{
      type: "Boolean",
      value: false
    },
    anonymousAvatarUrl:{
      type: "String",
      value: ""
    },
    professorName: {
      type: "String",
      value: "professor id"
    },
    courseID: {
      type: "String",
      value: ""
    },
    courseCode: {
      type: "String",
      value: ""
    },
    content: {
      type: "String",
      value: "评价..."
    },
    difficultRat: {
      type: "Number",
      value: 0
    },
    interestRat: {
      type: "Number",
      value: 0
    },
    workloadRat: {
      type: "Number",
      value: 0
    },
    teachRat: {
      type: "Number",
      value: 0
    },
    voteUpProp: {
      type: "Number",
      value: 0
    },
    voteDownProp: {
      type: "Number",
      value: 0
    },
    commentCountProp: {
      type: "Number",
      value: 20
    },
    favoriteCountProp: {
      type: "Number",
      value: 0
    },
    type: {
      type: "Number",
      value: 1
    },
    //if type is 1, show user and professor. 2 show user and courseCode
    //3 show professor and coursecode
    detail: {
      type: "Boolean",
      value: false
    },
    //if detail is true, show all content
    courseID: {
      type: "String",
      value: ""
    },
    posted_by_me: {
      type: "Boolean",
      value: false,

    },
    voted_by_me_prop: {
      type: "Number",
      value: 0
    },
    saved_by_me_prop: {
      type: "Boolean",
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    professorName: "",
    courseCode: "",
    openID: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    upVoteTapped: function () {
      if (this.data.voted_by_me === 0) {
        this.setData({
          voted_by_me: 1,
          voteUp: this.data.voteUp + 1
        })
        wx.cloud.callFunction({
          name: 'vote_save',
          data: {
            target: "vote_review_up_new",
            openID: this.data.openID,
            reviewID: this.properties.reviewID
          },
          success: (res) => {

          }
        })
      } else if (this.data.voted_by_me === -1) {
        this.setData({ voted_by_me: 1, voteUp: this.data.voteUp + 1, voteDown: this.data.voteDown - 1 })
        wx.cloud.callFunction({
          name: 'vote_save',
          data: {
            target: "vote_review_up_fromDown",
            openID: this.data.openID,
            reviewID: this.properties.reviewID
          },
          success: (res) => {

          }
        })
      } else if (this.data.voted_by_me === 1) {
        this.setData({ voted_by_me: 0, voteUp: this.data.voteUp - 1 })
        wx.cloud.callFunction({
          name: 'vote_save',
          data: {
            target: "vote_review_up_cancel",
            openID: this.data.openID,
            reviewID: this.properties.reviewID
          },
          success: (res) => {

          }
        })
      }
    },
    downVoteTapped: function () {
      if (this.data.voted_by_me === 0) {
        this.setData({ voted_by_me: -1, voteDown: this.data.voteDown + 1 })
        wx.cloud.callFunction({
          name: 'vote_save',
          data: {
            target: "vote_review_down_new",
            openID: this.data.openID,
            reviewID: this.properties.reviewID
          },
          success: (res) => {

          }
        })
      } else if (this.data.voted_by_me === 1) {
        this.setData({ voted_by_me: -1, voteUp: this.data.voteUp - 1, voteDown: this.data.voteDown + 1 })
        wx.cloud.callFunction({
          name: 'vote_save',
          data: {
            target: "vote_review_down_fromUp",
            openID: this.data.openID,
            reviewID: this.properties.reviewID
          },
          success: (res) => {

          }
        })
      } else if (this.data.voted_by_me === -1) {
        this.setData({ voted_by_me: 0, voteDown: this.data.voteDown - 1 })
        wx.cloud.callFunction({
          name: 'vote_save',
          data: {
            target: "vote_review_down_cancel",
            openID: this.data.openID,
            reviewID: this.properties.reviewID
          },
          success: (res) => {

          }
        })
      }
    },
    saveTapped: function () {
      if (!this.data.saved_by_me) {
        this.setData({
          saved_by_me: !this.data.saved_by_me,
          favoriteCount: this.data.favoriteCount + 1
        })
        wx.cloud.callFunction({
          name: 'vote_save',
          data: {
            target: "save_review",
            openID: this.data.openID,
            reviewID: this.properties.reviewID
          },
          success: (res) => {

          }
        })
      } else {
        this.setData({
          saved_by_me: !this.data.saved_by_me,
          favoriteCount: this.data.favoriteCount - 1
        })
        wx.cloud.callFunction({
          name: 'vote_save',
          data: {
            target: "unsave_review",
            openID: this.data.openID,
            reviewID: this.properties.reviewID
          },
          success: (res) => {

          }
        })
      }
    },
    // onCommentInputConfirm: function (e) {
    //   console.log(e);
    //   const content = e.detail.value
    //   this.setData({
    //     commentCount: this.data.commentCount + 1
    //   })
    //   wx.cloud.callFunction({
    //     name: 'vote_save',
    //     data: {
    //       target: "make_comment",
    //       reviewID: this.properties.reviewID,
    //       openID: this.data.openID,
    //       content: content
    //     }
    //   })
    // },
    deteleTapped: function () {
      console.log(this.properties.reviewID);
      console.log(this.properties.index);
      this.triggerEvent("deleteTappedFromReview", { index: this.properties.index })
      // wx.cloud.callFunction({
      //   name: 'delete',
      //   data: {
      //     target: "deleteReview",
      //     reviewID: this.data.reviewID,
      //     openID: this.data.openID
      //   }
      // })
    },

    //modal
    showDialogBox: function() {
      this.setData({
        showModal: true
      })
    },
    hideModal: function () {
      this.setData({
        showModal: false
      });
    },
  
    onCancelSendMessage: function () {
      this.setData({
        inputCommentContent: ""
      });
      this.hideModal();
    },
  
    onConfirmSendMessage: function (e) {
      console.log(e);
      const content = e.detail.value
      this.setData({
        commentCount: this.data.commentCount + 1
      })
      wx.cloud.callFunction({
        name: 'addEntries',
        data: {
          target: "makeComment",
          reviewID: this.properties.reviewID,
          openID: this.data.openID,
          content: content
        }
      })
      this.setData({
        inputCommentContent: ""
      });
      this.hideModal();
    },
     // 保存评价
    saveContent(e){
      this.setData({
        inputCommentContent: e.detail.value
      })
      console.log("成功填写评价为 ", this.data.inputCommentContent)
    },
  },
  

})
