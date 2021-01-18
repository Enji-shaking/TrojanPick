// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "test-0gbtzjgqaae3f2b2"
})

// 云函数入口函数
exports.main = async (event, context) => {
  const { target } = event
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const { OPENID, APPID } = wxContext

  if(target === "class"){
    // Should have corresponding checking conditions before actually adding the class
    const { courseCode, courseName } = event
    return await db.collection('courses').add({
      data:{ 
        courseCode: courseCode,
        courseName: courseName,
        openid: OPENID,
        numReviews: 0,
        workloadRating: 0,
        difficultyRating: 0,
        entertainmentRating: 0,
        enrichmentRating: 0,
      }
    })
  }else if(target === "professor"){
    const { professorName } = event
    return await db.collection('professors').add({
      data:{ 
        professorName: professorName,
        openID: OPENID
      }
    })
  }

  return {
    event,
    msg: "error"
  }
}