// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database();
  let {id,target} = event;
  // const data = await db.collection('class_professor').where({
  //   class_id:id
  // }).get();
  if(target=="fromCourse"){
    const data = await db.collection('class_professor')
    .aggregate()
    .lookup({
      from:'professors',
      localField:'professor_id',
      foreignField:'_id',
      as:'list'
    })
    .match({
      class_id:id
    })
    .end()
    return {data};
  }else if(target=="fromProfessor"){
    const data = await db.collection('class_professor')
    .aggregate()
    .lookup({
      from:'classes',
      localField:'class_id',
      foreignField:'_id',
      as:'list'
    })
    .match({
      professor_id:id
    })
    .end()
    return {data};
  }
  return {"":"error"};
}