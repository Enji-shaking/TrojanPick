// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {OPENID} = wxContext
  return await db.collection('questions').add({
    data:{ 
      courseID: event.courseID,
      newQuestion: event.newQuestion,
      openid: OPENID
    }
  })
}