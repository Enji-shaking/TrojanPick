// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { target } = event
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const { OPENID, APPID } = wxContext

  if(target === "class"){
    // Should have corresponding checking conditions before actually adding the class
    const { courseCode, courseName } = event
    return await db.collection('classes').add({
      data:{ 
        courseCode: courseCode,
        courseName: courseName,
        openid: OPENID
      }
    })
  }else if(target === "professor"){
    const { professorName } = event
    return await db.collection('professors').add({
      data:{ 
        professorName: professorName,
        openid: OPENID
      }
    })
  }

  return {
    event,
    msg: "error"
  }
}