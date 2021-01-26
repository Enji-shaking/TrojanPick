const app =  getApp();
// pages/savedClasses/savedClasses.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    favorite_classes_prefix:[],
    prefix_index: 0,
    course_cards_info:[],
    isChinese: true,
  },
  // onPickerChange(e){
  //   console.log(e);
  //   const {value} = e.detail
  //   this.setData({
  //     picker_index: value
  //   })
  //   // wx request, update info accordingly
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {  
    if(app.globalData.needRefresh){
      this.onLoad()
      app.globalData.needRefresh = false
    }  
  },
  onLoad: function (options) {
    this.setData({
      isChinese:app.globalData.isChinese
    })
    app.globalData.onProfile = false
    let self = this;
    wx.cloud.callFunction({
      name:'getProfileInfo',
      data:{
        target:"savedCourses",
        openID:options.openID
      }
    })
    .then(res => {
      console.log(res);
      let result = res.result.list;
      let course_card_cloud = [];
      let classes_prefix = new Set();
      let final_prefix = ["ALL"];
      for(let i =0;i<result.length;i++){
        course_card_cloud.push(...result[i].courseInfo);
        let courseCode = result[i].courseInfo[0].courseCode;
        let regex = /[0-9]/;
        classes_prefix.add(courseCode.substring(0,courseCode.search(regex)));
      }
      classes_prefix.forEach(e => {
        final_prefix.push(e);
      })
      self.setData({
        course_cards_info:course_card_cloud,
        favorite_classes_prefix:final_prefix
      })
      console.log(course_card_cloud);
    })
    .catch(console.error)
  },
  onPickerChange(e){
    console.log(e.detail.value);
    let self = this;
    this.setData({
      prefix_index:e.detail.value
    })
    //filter by 前缀
    wx.cloud.callFunction({
      name:'getProfileInfo',
      data:{
        target:"savedCourses",
        prefix:this.data.favorite_classes_prefix[this.data.prefix_index]!=="ALL"?this.data.favorite_classes_prefix[this.data.prefix_index]:""
      }
    })
    .then(res => {
      let result = res.result.list;
      let course_card_cloud = [];
      for(let i =0;i<result.length;i++){
          course_card_cloud.push(...result[i].courseInfo);
      }
      self.setData({
        course_cards_info:course_card_cloud
      })
    })
    .catch(console.error)
  }
})