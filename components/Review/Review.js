// components/Review/Review.js

//This component has three events could be triggered from outside
//unsaveADeletedReview: this should only be triggered on the page of saved reviews. This should work as delete the review from the page
//deleteTappedFromReview: this corresponds to tap the delete button from the review. Now, it's called from reviewInfo, "courseInfo/professorInfo,etc", and savedReviews
  // in reviewInfo, it goes back a page
  // in the latter, it manipulate the array
  // in the saved reviews, it should manipulate the array
//addNewComment: correspond to add a new comment in the page of reviewInfo, which would add comments below

Component({
  /**
   * 组件的属性列表
   */
  observers: {
    'item': function () {
      const { anonymous, anonymousAvatarUrl, anonymousNickName, difficultyRating, entertainmentRating, workloadRating, enrichmentRating, content, _id, courseID, down_vote_count, up_vote_count, commentCount, favoriteCount, voted_by_me, posted_by_me, saved_by_me, postedTime, deleted } = this.properties.item
      
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
        anonymous, anonymousAvatarUrl, anonymousNickName, difficultyRating, entertainmentRating, workloadRating, enrichmentRating, content, _id, courseID, down_vote_count, up_vote_count, commentCount, favoriteCount, voted_by_me, posted_by_me, saved_by_me, courseCode, professorName, nickName, avatarUrl, postedTime, deleted
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
    entertainmentRating: 0,
    workloadRating: 0,
    enrichmentRating: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    upVoteTapped: function () {
      if (this.data.voted_by_me === 0) {
        console.log("up, 0");
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
        console.log("up, -1");
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
        console.log("up, 1");
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
    savedTappedDeleted: function(){
      wx.showModal({
        title: 'Reminder',
        content: 'This record is only available for you. If you decide to unsave this, it would be deleted permanently',
        showCancel: true,
        cancelText: 'Cancel',
        cancelColor: '#000000',
        confirmText: 'Confirm',
        confirmColor: '#3CC51F',
        success: (result) => {
          if (result.confirm) {
            this.triggerEvent("unsaveADeletedReview")
            wx.cloud.callFunction({
              name: 'vote_save',
              data: {
                target: "unsave_review",
                openID: this.data.openID,
                reviewID: this.data._id
              }
            })
          }
        }
      });
        
    },
    deteleTapped: function () {
      wx.showModal({
        title: 'Reminder',
        content: 'Are you sure you want to delete this?',
        showCancel: true,
        cancelText: 'Cancel',
        cancelColor: '#000000',
        confirmText: 'Confirm',
        confirmColor: '#3CC51F',
        success: (result) => {
          if (result.confirm) {
            console.log("confirm"); 
            this.triggerEvent("deleteTappedFromReview")
            wx.cloud.callFunction({
              name: 'deleteEntries',
              data: {
                target: "deleteReview",
                reviewID: this.data._id,
                openID: this.data.openID
              }
            })
          }
        },
      });
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
    onDeleteComment: function () {  
      this.setData({
        commentCount: this.data.commentCount - 1
      })
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
