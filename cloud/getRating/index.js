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
      let:{
        id:'$_id'
      },
      pipeline: $.pipeline()
      // .match(_.expr($.and([
      //   $.eq(['$courseID','$$id'])])))
      .done(),
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
      let:{
        id:'$_id'
      },
      pipeline: $.pipeline()
      // .match(_.expr($.and([
      //   $.eq(['$courseID','$$id'])])))
      .done(),
      as:'ratinglist'
    })
    .end()
    return {data};
  }
  return {"":""};
}