// components/reviewComment.js
Component({
  /**
   * 组件的属性列表
   */
  observers: {
    'comment': function () {
      const { content, _id, down_vote_count, up_vote_count, voted_by_me, posted_by_me, postedTime, reviewID} = this.properties.comment
      
      let nickName, avatarUrl
      if(this.properties.comment.userInfo){
        nickName = this.properties.comment.userInfo[0].nickName
        avatarUrl = this.properties.comment.userInfo[0].avatarUrl
      }

      this.setData({
       content, commentID: _id, down_vote_count, up_vote_count, voted_by_me, posted_by_me, nickName, avatarUrl, postedTime, reviewID
      })
      console.log(this.properties.comment);
      console.log(this.data);
    }
  },
  properties: {
    comment: {
      type: "Object",
      value: {}
    },
  },

  data: {
    voted_by_me:0,
    up_vote_count:0,
    down_vote_count:0,
    postedTime: "xxxx-xx-xx"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    deteleTapped: function(){
      this.triggerEvent("deleteTappedFromComment")
      wx.cloud.callFunction({
        name: 'deleteEntries',
        data: {
          target: "deleteComment",
          commentID: this.data.commentID,
          openID: this.data.openID,
          reviewID: this.data.reviewID
        }
      })
    },
    upVoteTapped: function () {
      console.log(this.data.voted_by_me);
      console.log("hey");
      if (this.data.voted_by_me === 0) {
        console.log("hey2");
        this.setData({
          voted_by_me: 1,
          up_vote_count: this.data.up_vote_count + 1
        })
        wx.cloud.callFunction({
          name: 'vote_save',
          data: {
            target: "vote_comment_up_new",
            openID: this.data.openID,
            commentID: this.data.commentID
          },
          success: (res) => {
            console.log("hey3");
          },
          fail: (res)=>{
            console.log("fuck");
          }
        })
      } else if (this.data.voted_by_me === -1) {
        this.setData({ voted_by_me: 1, up_vote_count: this.data.up_vote_count + 1, down_vote_count: this.data.down_vote_count - 1 })
        wx.cloud.callFunction({
          name: 'vote_save',
          data: {
            target: "vote_comment_up_fromDown",
            openID: this.data.openID,
            commentID: this.data.commentID
          },
          success: (res) => {

          }
        })
      } else if (this.data.voted_by_me === 1) {
        this.setData({ voted_by_me: 0, up_vote_count: this.data.up_vote_count - 1 })
        wx.cloud.callFunction({
          name: 'vote_save',
          data: {
            target: "vote_comment_up_cancel",
            openID: this.data.openID,
            commentID: this.data.commentID
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
            target: "vote_comment_down_new",
            openID: this.data.openID,
            commentID: this.data.commentID
          },
          success: (res) => {

          }
        })
      } else if (this.data.voted_by_me === 1) {
        this.setData({ voted_by_me: -1, up_vote_count: this.data.up_vote_count - 1, down_vote_count: this.data.down_vote_count + 1 })
        wx.cloud.callFunction({
          name: 'vote_save',
          data: {
            target: "vote_comment_down_fromUp",
            openID: this.data.openID,
            commentID: this.data.commentID
          },
          success: (res) => {

          }
        })
      } else if (this.data.voted_by_me === -1) {
        this.setData({ voted_by_me: 0, down_vote_count: this.data.down_vote_count - 1 })
        wx.cloud.callFunction({
          name: 'vote_save',
          data: {
            target: "vote_comment_down_cancel",
            openID: this.data.openID,
            commentID: this.data.commentID
          },
          success: (res) => {

          }
        })
      }
    },
  },
  attached:function(){
    const openID = wx.getStorageSync("openID");
    console.log(openID);
    this.setData({openID})
  }
})
