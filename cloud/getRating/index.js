// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let {target} = event;
  const wxContext = cloud.getWXContext()
  const db = cloud.database();
  const $ = db.command.aggregate;
  const _ = db.command;
  if(target=='fromCourse'){
    let {courseID} = event;
    const data = await db.collection('classes')
    .aggregate()
    .match({
      _id:courseID
    })
    .lookup({
      from:'ratings',
      localField:'_id',
      foreignField:'courseID',
      as:'ratinglist'
    })
    .end()
    return {data};
  }else if(target=='fromProfessor'){
    let{professorID} = event;
    const data = await db.collection('professors')
    .aggregate()
    .match({
      _id:professorID
    })
    .lookup({
      from:'ratings',
      localField:'_id',
      foreignField:'professorID',
      as:'ratinglist'
    })
    .end()
    return {data};
  }else if(target=="professor_course"){
    let{professorID,courseID} = event;
    const data = await db.collection('ratings')
    .where({
      professorID:professorID,
      courseID:courseID
    })
    .get()
    const rating = await db.collection('class_professor')
    .where({
      professor_id:professorID,
      class_id:courseID
    }).get()
    return {data,rating};
  }
  return {"":""};
}