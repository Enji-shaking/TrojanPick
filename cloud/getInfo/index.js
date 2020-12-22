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
                                         .orderBy("courseCode", "asc")
                                        //  .where({
                                        //    "workload_rating": db.command.exists(true)
                                        //  })
                                         .get()
                                         //后边会改成sort by rating,现在先sort by name
  }else if(target === "search_classes"){
    const { courseCode } = event
    return await db.collection('classes').limit(3)
                                         .orderBy("courseCode", "asc")
                                         .where({
                                           "courseCode": db.command.eq(courseCode)
                                         })
                                         .get()
  }else if(target === "search_professors"){
    const { professorName } = event
    return await db.collection('professors').limit(3)
                                            .orderBy("professorName", "asc")
                                            .where({
                                              "professorName": db.command.eq(professorName)
                                            })
                                            .get()
  }else if(target === "all_professors"){
    return await db.collection('professors').limit(10)
                                            .orderBy("professorName", "asc")
                                            .get()
  }

  return {
    event,
    msg: "error"
  }
}