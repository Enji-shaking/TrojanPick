// components/reviewComment.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    avatarURL:{
      type:'string',
      value:"https://www.impactplus.com/hubfs/404-error-page-examples-best.jpg"
    },
    userName:{
      type:'string',
      value:"username"
    },
    date:{
      type:'string',
      value:'date'
    },
    content:{
      type:'string',
      value:'content'
    },
    down_vote_count:{
      type:'Number',
      value:0
    },
    up_vote_count:{
      type:'Number',
      value:0
    },
    commentID:{
      type:'string',
      value:false
    },
    voted_by_me_prop:{
      type:'string',
      value:false
    },
    posted_by_me:{
      type:'string',
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    voted_by_me:0,
    voteUp:0,
    voteDown:0
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
            target: "vote_comment_up_new",
            openID: this.data.openID,
            commentID: this.properties.commentID
          },
          success: (res) => {

          }
        })
      } else if (this.data.voted_by_me === -1) {
        this.setData({ voted_by_me: 1, voteUp: this.data.voteUp + 1, voteDown: this.data.voteDown - 1 })
        wx.cloud.callFunction({
          name: 'vote_save',
          data: {
            target: "vote_comment_up_fromDown",
            openID: this.data.openID,
            commentID: this.properties.reviewID
          },
          success: (res) => {

          }
        })
      } else if (this.data.voted_by_me === 1) {
        this.setData({ voted_by_me: 0, voteUp: this.data.voteUp - 1 })
        wx.cloud.callFunction({
          name: 'vote_save',
          data: {
            target: "vote_comment_up_cancel",
            openID: this.data.openID,
            commentID: this.properties.commentID
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
            target: "vote_comment_down_new",
            openID: this.data.openID,
            commentID: this.properties.commentID
          },
          success: (res) => {

          }
        })
      } else if (this.data.voted_by_me === 1) {
        this.setData({ voted_by_me: -1, voteUp: this.data.voteUp - 1, voteDown: this.data.voteDown + 1 })
        wx.cloud.callFunction({
          name: 'vote_save',
          data: {
            target: "vote_comment_down_fromUp",
            openID: this.data.openID,
            commentID: this.properties.commentID
          },
          success: (res) => {

          }
        })
      } else if (this.data.voted_by_me === -1) {
        this.setData({ voted_by_me: 0, voteDown: this.data.voteDown - 1 })
        wx.cloud.callFunction({
          name: 'vote_save',
          data: {
            target: "vote_comment_down_cancel",
            openID: this.data.openID,
            commentID: this.properties.commentID
          },
          success: (res) => {

          }
        })
      }
    },
  },
  attached:function(){
    this.setData({
      voted_by_me:this.properties.voted_by_me_prop,
      voteUp:this.properties.up_vote_count,
      voteDown:this.properties.down_vote_count
    })
    console.log(this.properties);
    console.log(this.properties.avatarURL);
  }
})
