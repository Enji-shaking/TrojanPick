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
  }
  return {"":"error"};
}