// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picker_arr:['alphanumeric','difficulty (asc+)','interest (desc-)','workload (asc+)', 'learning (desc-)'],
    picker_index: 0,
    course_cards_info:[],
    prof_cards_info:[],
    activeTab: 0,
    searchCourseCode: "",
    searchProfessorName: "",
  },
  queryParamsCourses: { 
    currentPage: 1,
    target: "recommended_courses",
    courseCode: "",
    sort: 0
    // corresponding to picker_index
  },
  queryParamsProfessors: { 
    currentPage: 1,
    target: "default_professors",
    professorName: "",
  },
  totalPageCourses: 99,
  totalPageProfessors: 99,
  onPickerChange(e){
    console.log(e);
    const {value} = e.detail
    this.setData({
      picker_index: value
    })
    this.queryParamsCourses.sort = parseInt(value)
    this.reloadCourses()
  },
  onTabTapped(e){
    console.log(e);
    const {index} = e.currentTarget.dataset
    console.log(index);
    this.setData({activeTab: index})
  },
  
  performQuery(type){
    return wx.cloud.callFunction({
      name: "searchWithName",
      data: type===0?this.queryParamsCourses:this.queryParamsProfessors
    })
  },
  searchCourseCloud(){
    wx.showLoading({
      title: 'loading',
    })
    this.performQuery(0).then((res)=>{
        console.log(res);
        const { data, totalPage }= res.result
        this.totalPageCourses = totalPage
        console.log(this.totalPageCourses);
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
  SearchCourseTimerID: -1,
  SearchProfessorTimerID: -1,
  onSearchProfessorInput(e){
    clearTimeout(this.SearchCourseTimerID)
    const searchProfessorName = e.detail.value
    this.setData({searchProfessorName: searchProfessorName})
    this.queryParamsProfessors.professorName = searchProfessorName
    if(searchProfessorName != "") 
      this.queryParamsProfessors.target="search_professors"
    else 
      this.queryParamsProfessors.target="all_professors"
    this.SearchProfessorTimerID = setTimeout(this.reloadProfessors,1000)
  },
  onSearchCourseInput(e){
    clearTimeout(this.SearchCourseTimerID)
    const searchCourseCode = e.detail.value
    this.setData({searchCourseCode: searchCourseCode})
    this.queryParamsCourses.courseCode = searchCourseCode
    if(searchCourseCode != "") 
      this.queryParamsCourses.target="search_courses"
    else 
      this.queryParamsCourses.target="recommended_courses"
    this.SearchCourseTimerID = setTimeout(this.reloadCourses,1000)
  },
  reloadCourses(){
    this.setData({course_cards_info: []})
    this.queryParamsCourses.currentPage = 1
    this.searchCourseCloud()
  },
  reloadProfessors(){
    this.setData({prof_cards_info: []})
    this.queryParamsProfessors.currentPage = 1
    this.searchProfessorCloud()
  },

  onTapSearchCourse(){
    this.reloadCourses()
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
      if(this.totalPageCourses > this.queryParamsCourses.currentPage){
        this.queryParamsCourses.currentPage++
        console.log(this.queryParamsCourses);
        this.searchCourseCloud()
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
    this.getOpenID()
    this.loadInitialInfo();
    // wx.cloud.callFunction({
    //   name: "deleteEntries",
    //   data:{
    //     target: "nonono"
    //   },
    //   success: res=>{console.log(res)},
    //   fail: e=>{console.log(e)}
    // })
    // wx.showToast({
    //   icon: 'none',
    //   title: "2/2 limt reached for all reviews"
    // })
  },

  getOpenID(){
    wx.cloud.callFunction({
      name: "userRelatedFn",
      data:{
        target: "tryToAddNewUser",
      },
      success: e=>{
        console.log(e);
        wx.setStorage({
          key: 'openID',
          data: e.result
        });          
      }
    })
  },
  
  loadInitialInfo() { 
    this.setData({
      course_cards_info: [],
      prof_cards_info: [],
      searchCourseCode: [],
      searchProfessorName: [],
      picker_index: 0
    })
    this.queryParamsCourses = { 
      currentPage: 1,
      target: "recommended_courses",
      courseCode: "",
      sort: 0
    }
    this.queryParamsProfessors = { 
      currentPage: 1,
      target: "default_professors",
      professorName: "",
    }
    this.searchProfessorCloud()
    this.searchCourseCloud()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loadInitialInfo()
  },


})