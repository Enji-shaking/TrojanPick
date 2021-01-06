// pages/pastRatings/pastRatings.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reviews: [],
    courses: [],
    professors: [],
    professor_list: [{
      list_id: "",
      list_value: ""
    }],
    course_list: [{
      list_id: "",
      list_value: ""
    }],
    courseName: "全部",
    professorName: "全部",
    curProfessorID: "",
    curCourseID: "",
    userID: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    this.setData({
      userID: options.userID
    })
    wx.cloud.callFunction({
      name: 'getProfileInfo',
      data: {
        target: "pastRatings",
        userID: options.userID
      }
    })
      .then(res => {
        console.log(res.result[0].data);
        let reviews = res.result[0].data;
        let professors = new Set();
        let courses = new Set();
        reviews.forEach(e => {
          professors.add(e.professorID);
          courses.add(e.courseID);
        })
        self.setData({
          reviews: res.result[0].data,
          courses: Array.from(courses),
          professors: Array.from(professors)
        })
      })
      .then(() => {
        //retrieve course list and professor list
        wx.cloud.callFunction({
          name: 'getInfoById',
          data: {
            target: "list",
            professors: self.data.professors,
            courses: self.data.courses
          },
          success(res) {
            console.log(self.data.courses);
            console.log(res);
            let professor_list = [];
            let course_list = [];
            let item = {
              list_id: undefined,
              list_value: "全部"
            }
            professor_list.push(item);
            course_list.push(item);
            res.result.course_data.forEach(e => {
              let item = {
                list_id: e._id,
                list_value: e.courseCode
              }
              course_list.push(item);
            })
            res.result.professor_data.forEach(e => {
              let item = {
                list_id: e._id,
                list_value: e.professorName
              }
              professor_list.push(item);
            })
            self.setData({
              course_list: course_list,
              professor_list: professor_list
            })
            console.log(self.data.course_list);
          },
          fail(err) {
          }
        })
      })
      .catch(console.error)
  },
  chooseCoursePicker(e) {
    console.log(this.data.course_list);
    let self = this;
    this.setData({
      curCourseID: this.data.course_list[e.detail.value].list_id,
      courseName: this.data.course_list[e.detail.value].list_value
    })
    console.log(this.data.curProfessorID);
    console.log(this.data.curCourseID);

    wx.cloud.callFunction({
      name: "getProfileInfo",
      data: {
        courseID: this.data.curCourseID,
        professorID: this.data.curProfessorID,
        userID: this.data.userID,
        target: 'pastRatings'
      }
    })
      .then(res => {
        console.log(res.result);
        let reviews = res.result[0].data;
        self.setData({
          reviews: reviews
        })
      })
      .catch(console.error)
  },
  chooseProPicker(e) {
    console.log(e.detail);
    console.log(this.data.professor_list);
    let self = this;
    this.setData({
      curProfessorID: this.data.professor_list[e.detail.value].list_id,
      professorName: this.data.professor_list[e.detail.value].list_value
    })
    console.log(this.data.curProfessorID);
    console.log(this.data.curCourseID);

    wx.cloud.callFunction({
      name: "getProfileInfo",
      data: {
        courseID: this.data.curCourseID,
        professorID: this.data.curProfessorID,
        userID: this.data.userID,
        target: 'pastRatings'
      }
    })
      .then(res => {
        console.log(res.result);
        let reviews = res.result[0].data;
        self.setData({
          reviews: reviews
        })
      })
      .catch(console.error)
  }
})