// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { target } = event
  // const wxContext = cloud.getWXContext()
  const db = cloud.database()
  // const { OPENID, APPID } = wxContext

  if(target === "recommended_classes"){
    return await db.collection('classes').limit(3)
                                         .orderBy("workload_rating", "asc")
                                         .where({
                                           "workload_rating": db.command.exists(true)
                                         })
                                         .get()
  }

  return {
    event,
    msg: "error"
  }
}