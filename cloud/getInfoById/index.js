// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "test-0gbtzjgqaae3f2b2"
})

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext();
  const {target, openID} = event;
  const db = cloud.database();
  if(target=="getCourseInfo"){
    const {courseID,professorID} = event;
    console.log(courseID);
    const data = await db.collection('courses')
      .where({
        _id: courseID
      })
      .get()
    const count = (await db.collection('saved_courses')
      .where({
        courseID: courseID,
        openID: openID
      })
      .count()).total
    console.log(data.data[0]);
    data.data[0].isFavorite = count === 1;
    let rating = undefined;
    if(professorID){
        rating=await db.collection('course_professor').where({
        courseID:courseID,
        professorID:professorID
      }).get();
    }
    return {rating,data}
  }else if(target=="getProfessorInfo"){
    const {professorID,courseID} = event;
    const data = await db.collection('professors').where({
      _id:professorID
    }).get();
    let rating = undefined;
    if(courseID){
        rating=await db.collection('course_professor').where({
        courseID:courseID,
        professorID:professorID
      }).get();
    }
    const taughtClass = await db.collection('course_professor')
      .aggregate()
      .match({
        professorID: professorID
      })
      .lookup({
        from: "courses",
        localField: "courseID",
        foreignField: "_id",
        as: "courseCode"
      })
      .end()
    console.log(taughtClass);
    const courseCode = taughtClass.list.map(item=>{
      return {courseCode: item.courseCode[0].courseCode, courseUnit: item.courseCode[0].courseUnit}
    })
    console.log(courseCode);
    return {rating, data, courseCode, taughtClass}
    
  }else if(target=="list"){
    let {courses,professors} = event;
    let course_data = [];
    let professor_data = [];
    console.log(courses);
    console.log(professors);
    for(let i=0;i<courses.length;i++){
      const info = await db.collection('courses')
      .where({
        _id:courses[i]
      })
      .get();
      course_data.push(info.data[0]);
    }
    for(let i=0;i<professors.length;i++){
        const info = await db.collection('professors')
        .where({
          _id:professors[i]
        })
        .get();
        professor_data.push(info.data[0]);
    }
    return {course_data,professor_data};
  }else if(target=="get_information_for_class_professor"){
    let {courseID, professorID} = event
    let condition = {}
    if(courseID) condition["courseID"] = courseID
    if(professorID) condition["professorID"] = professorID
    console.log(condition);
    const data = await db.collection('course_professor')
    .aggregate()
    .match(condition)
    .lookup({
      from:'professors',
      localField:'professorID',
      foreignField:'_id',
      as:'professorInfo'
    })
    .lookup({
      from: 'courses',
      localField: 'courseID',
      foreignField: '_id',
      as: 'courseInfo'
    })
    .end()
    return data;
  }else if(target=="get_comments_by_reviewID"){
    const {reviewID} = event;
    let data = db.collection('comments')
    .aggregate()
    .match({
      reviewID:reviewID
    })
    .lookup({
      from:'users',
      localField:'openID',
      foreignField:'openID',
      as:'userInfo'
    })
    .end();
    //check if it's been voted by me
    let my_voted_comments_raw = db.collection("voted_comments").where(
      { openID: openID }
    ).get();
    [data, my_voted_comments_raw] = await Promise.all([data, my_voted_comments_raw]);  
    let my_voted_comments = {}
    for (let i = 0; i < my_voted_comments_raw.data.length; i++) {
      my_voted_comments[my_voted_comments_raw.data[i].commentID] = my_voted_comments_raw.data[i].voted_by_me
    }
    //update voted_by_me, posted_by_me, saved_by_me
    data.list = data.list.map((item) => {
      let temp = item
      temp.posted_by_me = item.openID === openID
      temp.voted_by_me = (item._id in my_voted_comments ? my_voted_comments[item._id] : 0)
      return temp
    })
    console.log(data.list);
    return data;
  }
  return {"":"error"};
}