// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  const db = cloud.database();
  let {target} = event;
  // const data = await db.collection('class_professor').where({
  //   class_id:id
  // }).get();
  if(target=="get_information_for_class_professor"){
    let {courseID, professorID} = event
    let condition = {}
    if(courseID) condition["courseID"] = courseID
    if(professorID) condition["professorID"] = professorID
    console.log(condition);
    const data = await db.collection('course_professor')
    .aggregate()
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
    .match(condition)
    .end()
    return data;
  }
  return {"":"error"};
}