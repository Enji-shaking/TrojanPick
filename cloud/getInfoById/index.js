// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  let {target} = event;
  const db = cloud.database();
  if(target=="fromProfessor"){
    let {courseID} = event;
    const data = await db.collection('classes').where({
      _id:courseID
    }).get();
    return data;
  }else if(target=="fromCourse"){
    let {professorID} = event;
    const data = await db.collection('professors').where({
      _id:professorID
    }).get();
    return data;
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
  }
  return {"":"error"};
}