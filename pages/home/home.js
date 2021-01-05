// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picker_arr:['alphanumeric','hardness (asc+)','interest (desc-)','workload (asc+)', 'learning (desc-)'],
    picker_index: 0,
    course_cards_info:[],
    prof_cards_info:[],
    activeTab: 0,
    searchCourseCode: "",
    searchProfessorName: "",
  },
  queryParamsClasses: { 
    currentPage: 1,
    target: "recommended_classes",
    courseCode: "",
    sort: 0
    // corresponding to picker_index
  },
  queryParamsProfessors: { 
    currentPage: 1,
    target: "default_professors",
    professorName: "",
  },
  totalPageClasses: 99,
  totalPageProfessors: 99,
  onPickerChange(e){
    console.log(e);
    const {value} = e.detail
    this.setData({
      picker_index: value
    })
    this.queryParamsClasses.sort = parseInt(value)
    this.reloadClasses()
  },
  onTabTapped(e){
    console.log(e);
    const {index} = e.currentTarget.dataset
    console.log(index);
    this.setData({activeTab: index})
  },
  
  performQuery(type){
    return wx.cloud.callFunction({
      name: "getInfo",
      data: type===0?this.queryParamsClasses:this.queryParamsProfessors
    })
  },
  searchClassCloud(){
    wx.showLoading({
      title: 'loading',
    })
    this.performQuery(0).then((res)=>{
        console.log(res);
        const { data, totalPage }= res.result
        this.totalPageClasses = totalPage
        console.log(this.totalPageClasses);
        const course_cards_info = data.map(v=>{return {_id: v._id, courseCode: v.courseCode, courseName: v.courseName}})
        this.setData({course_cards_info: [...this.data.course_cards_info, ...course_cards_info]})
        wx.hideLoading({
          success: (res) => {},
        })
      })
      .catch((err)=>console.error(err))
  },
  searchProfessorCloud(){
    wx.showLoading({
      title: 'loading',
    })
    this.performQuery(1).then((res)=>{
      console.log(res);
      const { data, totalPage }= res.result
      this.totalPageProfessors = totalPage
      const prof_cards_info = data.map(v=>{return {_id: v._id, professorName: v.professorName}})
      this.setData({prof_cards_info: [...this.data.prof_cards_info, ...prof_cards_info]})
        wx.hideLoading({
          success: (res) => {},
        })
    })
    .catch((err)=>console.error(err))

  },
  SearchClassTimerID: -1,
  SearchProfessorTimerID: -1,
  onSearchProfessorInput(e){
    clearTimeout(this.SearchClassTimerID)
    const searchProfessorName = e.detail.value
    this.setData({searchProfessorName: searchProfessorName})
    this.queryParamsProfessors.professorName = searchProfessorName
    if(searchProfessorName != "") 
      this.queryParamsProfessors.target="search_professors"
    else 
      this.queryParamsProfessors.target="all_professors"
    this.SearchProfessorTimerID = setTimeout(this.reloadProfessors,1000)
  },
  onSearchClassInput(e){
    clearTimeout(this.SearchClassTimerID)
    const searchCourseCode = e.detail.value
    this.setData({searchCourseCode: searchCourseCode})
    this.queryParamsClasses.courseCode = searchCourseCode
    if(searchCourseCode != "") 
      this.queryParamsClasses.target="search_classes"
    else 
      this.queryParamsClasses.target="recommended_classes"
    this.SearchClassTimerID = setTimeout(this.reloadClasses,1000)
  },
  reloadClasses(){
    this.setData({course_cards_info: []})
    this.queryParamsClasses.currentPage = 1
    this.searchClassCloud()
  },
  reloadProfessors(){
    this.setData({prof_cards_info: []})
    this.queryParamsProfessors.currentPage = 1
    this.searchProfessorCloud()
  },

  onTapSearchClass(){
    this.reloadClasses()
  },
  onTapSearchProfessor(){
    this.reloadProfessors()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("reach bottom");
    
    if(this.data.activeTab === 0){
      if(this.totalPageClasses > this.queryParamsClasses.currentPage){
        this.queryParamsClasses.currentPage++
        console.log(this.queryParamsClasses);
        this.searchClassCloud()
      }else{
        wx.showToast({
          title: 'No more items',
          icon: 'none',
        });
      }
    }else{
      if(this.totalPageProfessors > this.queryParamsProfessors.currentPage){
        this.queryParamsProfessors.currentPage++
        console.log(this.queryParamsProfessors);
        this.searchProfessorCloud()
      }else{
        wx.showToast({
          title: 'No more items',
          icon: 'none',
        });
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.searchProfessorCloud()
    this.searchClassCloud()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },


})