// components/Rating/Rating.js
Component({
  /**
   * 组件的属性列表
   */
  observers: {
    'item': function () {
      const { anonymous, anonymousAvatarUrl, anonymousNickName, difficultyRating, interestingRating, workloadRating, teachingRating, content, _id, courseID, down_vote_count, up_vote_count, commentCount, favoriteCount, voted_by_me, posted_by_me, saved_by_me, postedTime, deleted } = this.properties.item
      
      let courseCode
      if(this.properties.item.courseInfo){
        courseCode = this.properties.item.courseInfo[0].courseCode
      }
      let professorName 
      if(this.properties.item.professorInfo){
        professorName = this.properties.item.professorInfo[0].professorName
      }
      let nickName, avatarUrl
      if(this.properties.item.userInfo){
        nickName = this.properties.item.userInfo[0].nickName
        avatarUrl = this.properties.item.userInfo[0].avatarUrl
      }

      this.setData({
        anonymous, anonymousAvatarUrl, anonymousNickName, difficultyRating, interestingRating, workloadRating, teachingRating, content, _id, courseID, down_vote_count, up_vote_count, commentCount, favoriteCount, voted_by_me, posted_by_me, saved_by_me, courseCode, professorName, nickName, avatarUrl, postedTime, deleted
      })
    }
  },
  properties: {
    item: {
      type: "Object",
      value: {}
    },
    hideCourse: {
      type: "Boolean",
      value: false
    },
    hideProfessor:{
      type: "Boolean",
      value: false
    },
    detail: {
      type: "Boolean",
      value: false
    },
    // //if detail is true, show all content
  },

  /**
   * 组件的初始数据
   */
  data: {
    openID: "",
    postedTime: "xxxx-xx-xx",
    difficultyRating: 0,
    interestingRating: 0,
    workloadRating: 0,
    teachingRating: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    upVoteTapped: function () {
      if (this.data.item.voted_by_me === 0) {
        this.setData({
          voted_by_me: 1,
          up_vote_count: this.data.up_vote_count + 1
        })
        wx.cloud.callFunction({
          name: 'vote_save',
          data: {
            target: "vote_review_up_new",
            openID: this.data.openID,
            reviewID: this.data._id
          },
          success: (res) => {

          }
        })
      } else if (this.data.voted_by_me === -1) {
        this.setData({ voted_by_me: 1, up_vote_count: this.data.up_vote_count + 1, down_vote_count: this.data.down_vote_count - 1 })
        wx.cloud.callFunction({
          name: 'vote_save',
          data: {
            target: "vote_review_up_fromDown",
            openID: this.data.openID,
            reviewID: this.data._id
          },
          success: (res) => {

          }
        })
      } else if (this.data.voted_by_me === 1) {
        this.setData({ voted_by_me: 0, up_vote_count: this.data.up_vote_count - 1 })
        wx.cloud.callFunction({
          name: 'vote_save',
          data: {
            target: "vote_review_up_cancel",
            openID: this.data.openID,
            reviewID: this.data._id
          },
          success: (res) => {

          }
        })
      }
    },
    downVoteTapped: function () {
      if (this.data.voted_by_me === 0) {
        this.setData({ voted_by_me: -1, down_vote_count: this.data.down_vote_count + 1 })
        wx.cloud.callFunction({
          name: 'vote_save',
          data: {
            target: "vote_review_down_new",
            openID: this.data.openID,
            reviewID: this.data._id
          },
          success: (res) => {

          }
        })
      } else if (this.data.voted_by_me === 1) {
        this.setData({ voted_by_me: -1, up_vote_count: this.data.up_vote_count - 1, down_vote_count: this.data.down_vote_count + 1 })
        wx.cloud.callFunction({
          name: 'vote_save',
          data: {
            target: "vote_review_down_fromUp",
            openID: this.data.openID,
            reviewID: this.data._id
          },
          success: (res) => {

          }
        })
      } else if (this.data.voted_by_me === -1) {
        this.setData({ voted_by_me: 0, down_vote_count: this.data.down_vote_count - 1 })
        wx.cloud.callFunction({
          name: 'vote_save',
          data: {
            target: "vote_review_down_cancel",
            openID: this.data.openID,
            reviewID: this.data._id
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
            reviewID: this.data._id
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
            reviewID: this.data._id
          },
          success: (res) => {

          }
        })
      }
    },

    deteleTapped: function () {
      this.triggerEvent("deleteTappedFromReview")
      wx.cloud.callFunction({
        name: 'deleteEntries',
        data: {
          target: "deleteReview",
          reviewID: this.data._id,
          openID: this.data.openID
        }
      })
    },

    //modal
    showDialogBox: function () {
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

    onConfirmSendMessage: function () {
      this.setData({
        commentCount: this.data.commentCount + 1
      })
      wx.cloud.callFunction({
        name: 'addEntries',
        data: {
          target: "makeComment",
          reviewID: this.data._id,
          openID: this.data.openID,
          content: this.data.inputCommentContent
        }
      })
      .then(res=>
        {
          //If added a comment in the page reviewInfo, this would show the comment at the very last
          this.triggerEvent("addNewComment", {content: this.data.inputCommentContent, _id: res.result._id })
          this.setData({
            inputCommentContent: ""
          });
        }
      )
      
      
      
      this.hideModal();
    },
    // 保存评价
    onInputContent(e) {
      this.setData({
        inputCommentContent: e.detail.value
      })
      console.log("成功填写评价为 ", this.data.inputCommentContent)
    },
  },

  attached: function () {
    const openID = wx.getStorageSync("openID");
    console.log(openID);
    this.setData({ openID })
  }

})
