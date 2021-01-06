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
        voteDown:this.properties.voteDownProp,
        commentCount: this.properties.commentCountProp, 
        favoriteCount: this.properties.favoriteCountProp,
        voted_by_me: this.properties.voted_by_me_prop, 
        saved_by_me: this.properties.saved_by_me_prop,
        openID: openID
      })
     }
  },
  properties: {
    reviewID:{
      type: "String",
      value: ""
    },
    index:{
      type: "Number",
      value: ""
    },
    userName:{
      type:"String",
      value:"User Name"
    },
    avatarURL:{
      type:"String",
      value:"data:image/png;base64,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"
    },
    professorName:{
      type:"String",
      value:"professor id"
    },
    courseID:{
      type:"String",
      value:""
    },
    courseCode:{
      type:"String",
      value:""
    },
    content:{
      type:"String",
      value:"评价..."
    },
    difficultRat:{
      type:"Number",
      value:0
    },
    interestRat:{
      type:"Number",
      value:0
    },
    workloadRat:{
      type:"Number",
      value:0
    },
    teachRat:{
      type:"Number",
      value:0
    },
    voteUpProp:{
      type:"Number",
      value:0
    },
    voteDownProp:{
      type:"Number",
      value:0
    },
    commentCountProp: {
      type: "Number",
      value: 20
    },
    // comments:{
    //   type:"Array",
    //   value:[]
    // },
    favoriteCountProp:{
      type:"Number",
      value:0
    },
    type:{
      type:"Number",
      value:1
    },
    //if type is 1, show user and professor. 2 show user and courseCode
    //3 show professor and coursecode
    detail:{
      type:"Boolean",
      value:false
    },
    //if detail is true, show all content
    couseID:{
      type:"String",
      value:""
    },
    posted_by_me:{
      type: "Boolean",
      value: false,

    },
    voted_by_me_prop: {
      type: "Number",
      value: 0
    },
    saved_by_me_prop:{
      type: "Boolean",
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    professorName:"",
    courseCode:"",
    openID: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    upVoteTapped: function () { 
      if(this.data.voted_by_me === 0){
        this.setData({
          voted_by_me: 1,
          voteUp: this.data.voteUp+1
        })
        wx.cloud.callFunction({
          name: 'vote_save',
          data: {
            target: "vote_review_up_new",
            openID: this.data.openID,
            reviewID: this.properties.reviewID
          },
          success: (res)=>{

          }
        })
      }else if(this.data.voted_by_me===-1){
        this.setData({voted_by_me: 1, voteUp: this.data.voteUp+1, voteDown: this.data.voteDown-1})
        wx.cloud.callFunction({
          name: 'vote_save',
          data: {
            target: "vote_review_up_fromDown",
            openID: this.data.openID,
            reviewID: this.properties.reviewID
          },
          success: (res)=>{

          }
        })
      }else if(this.data.voted_by_me === 1){
        this.setData({voted_by_me: 0, voteUp: this.data.voteUp-1})
        wx.cloud.callFunction({
          name: 'vote_save',
          data: {
            target: "vote_review_up_cancel",
            openID: this.data.openID,
            reviewID: this.properties.reviewID
          },
          success: (res)=>{

          }
        })
      }
    },
    downVoteTapped: function(){
      if(this.data.voted_by_me === 0){
        this.setData({voted_by_me: -1, voteDown: this.data.voteDown+1})
        wx.cloud.callFunction({
          name: 'vote_save',
          data: {
            target: "vote_review_down_new",
            openID: this.data.openID,
            reviewID: this.properties.reviewID
          },
          success: (res)=>{

          }
        })
      }else if(this.data.voted_by_me===1){
        this.setData({voted_by_me: -1, voteUp: this.data.voteUp-1, voteDown: this.data.voteDown+1})
        wx.cloud.callFunction({
          name: 'vote_save',
          data: {
            target: "vote_review_down_fromUp",
            openID: this.data.openID,
            reviewID: this.properties.reviewID
          },
          success: (res)=>{

          }
        })
      }else if(this.data.voted_by_me === -1){
        this.setData({voted_by_me: 0, voteDown: this.data.voteDown-1})
        wx.cloud.callFunction({
          name: 'vote_save',
          data: {
            target: "vote_review_down_cancel",
            openID: this.data.openID,
            reviewID: this.properties.reviewID
          },
          success: (res)=>{

          }
        })
      }
    },
    saveTapped: function () { 
      if(!this.data.saved_by_me){
        this.setData({
          saved_by_me: !this.data.saved_by_me,
          favoriteCount: this.data.favoriteCount+1
        })
        wx.cloud.callFunction({
          name: 'vote_save',
          data:{
            target: "save_review",
            openID: this.data.openID,
            reviewID: this.properties.reviewID
          },
          success: (res)=>{

          }
        })
      }else{
        this.setData({
          saved_by_me: !this.data.saved_by_me,
          favoriteCount: this.data.favoriteCount-1
        })
        wx.cloud.callFunction({
          name: 'vote_save',
          data:{
            target: "unsave_review",
            openID: this.data.openID,
            reviewID: this.properties.reviewID
          },
          success: (res)=>{

          }
        })
      }
    },
    onCommentInputConfirm: function (e) { 
      console.log(e);
      const content = e.detail.value
      this.setData({
        commentCount: this.data.commentCount+1
      })
      wx.cloud.callFunction({
        name: 'vote_save',
        data: {
          target: "make_comment",
          reviewID: this.properties.reviewID,
          openID: this.data.openID,
          content: content
        }
      })
    },
    deteleTapped: function(){
      console.log(this.properties.reviewID);
      console.log(this.properties.index);
      this.triggerEvent("deleteTappedFromReview", {index: this.properties.index} )
      // wx.cloud.callFunction({
      //   name: 'delete',
      //   data: {
      //     target: "deleteReview",
      //     reviewID: this.data.reviewID,
      //     openID: this.data.openID
      //   }
      // })
    }

  },
  // attached:function(){
    // console.log("hey");

    // const openID = wx.getStorageSync("openID");
    // this.setData({
    //   // reviewID: this.properties.reviewID,
    //   voteUp: this.properties.voteUpProp, 
    //   voteDown:this.properties.voteDownProp,
    //   commentCount: this.properties.commentCountProp, 
    //   favoriteCount: this.properties.favoriteCountProp,
    //   posted_by_me: this.properties.posted_by_me_prop, 
    //   voted_by_me: this.properties.voted_by_me_prop, 
    //   saved_by_me: this.properties.saved_by_me_prop,
    //   openID: openID
    //   })
    // let self = this;
    // if(this.data.type==2){ 
    //   wx.cloud.callFunction({
    //     name:'getInfoById',
    //     data:{
    //       courseID:self.properties.courseID,
    //       openID: this.data.openID,
    //       target:'fromProfessor'
    //     },
    //     success(res){
    //       self.setData({
          
    //         courseCode:res.result.data[0].courseCode
    //       })
    //     },
    //     fail(res){
    //       console.log("fail");
    //     }
    //   })
    // }else if(this.data.type==1){
    //   wx.cloud.callFunction({
    //     name:'getInfoById',
    //     data:{
    //       professorID:this.properties.professorID,
    //       openID: this.data.openID,
    //       target:'fromCourse'
    //     },
    //     success(res){
    //      self.setData({
    //        professorName:res.result.data[0].professorName
    //      })
    //     },
    //     fail(res){
    //       console.log("fail");
    //     }
    //   })
    // }
  // }
})
