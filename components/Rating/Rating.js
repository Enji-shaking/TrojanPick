// components/Rating/Rating.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    reviewID:{
      type: "String",
      value: ""
    },
    userName:{
      type:"String",
      value:"User Name"
    },
    professorID:{
      type:"String",
      value:"professor id"
    },
    courseID:{
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
    //if type is 1, show user and courseCode. 2 show user and professorName
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
    posted_by_me_prop:{
      type: "Boolean",
      value: false
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
    }

  },
  attached:function(){
    const openID = wx.getStorageSync("openID");
    this.setData({
      voteUp: this.properties.voteUpProp, 
      voteDown:this.properties.voteDownProp,
      commentCount: this.properties.commentCountProp, 
      favoriteCount: this.properties.favoriteCountProp,
      posted_by_me: this.properties.posted_by_me_prop, 
      voted_by_me: this.properties.voted_by_me_prop, 
      saved_by_me: this.properties.saved_by_me_prop,
      openID: openID
      })
    let self = this;
    if(this.data.type==2){ 
      wx.cloud.callFunction({
        name:'getInfoById',
        data:{
          courseID:self.properties.courseID,
          openID: this.data.openID,
          target:'fromProfessor'
        },
        success(res){
          self.setData({
            courseCode:res.result.data[0].courseCode
          })
        },
        fail(res){
          console.log("fail");
        }
      })
    }else if(this.data.type==1){
      wx.cloud.callFunction({
        name:'getInfoById',
        data:{
          professorID:this.properties.professorID,
          openID: this.data.openID,
          target:'fromCourse'
        },
        success(res){
         self.setData({
           professorName:res.result.data[0].professorName
         })
        },
        fail(res){
          console.log("fail");
        }
      })
    }
  }
})
