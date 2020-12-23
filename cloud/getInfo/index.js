// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const MAX_LIMIT = 3

// 云函数入口函数
exports.main = async (event, context) => {
  const { target, currentPage } = event
  // const wxContext = cloud.getWXContext()
  const db = cloud.database()
  // const { OPENID, APPID } = wxContext

  
  if(target === "recommended_classes" || (target === "search_classes" && event.courseCode==="")){
    const data = await db.collection('classes').limit(MAX_LIMIT)
                                         .skip(MAX_LIMIT * (currentPage-1))
                                         .orderBy("workload_rating", "asc")
                                         .orderBy("courseCode", "asc")
                                        //  .where({
                                        //    "workload_rating": db.command.exists(true)
                                        //  })
                                         .get()
                                         //后边会改成sort by rating,现在先sort by name
    const count =  (await db.collection('classes').count()).total
    // const total = count.total
    const totalPage = Math.ceil(count / MAX_LIMIT)
    return {...data, totalPage}
  }else if(target === "search_classes"){
    const { courseCode } = event
    const data =  await db.collection('classes').limit(3)
                                         .skip(MAX_LIMIT * (currentPage-1))
                                         .orderBy("courseCode", "asc")
                                         .where({
                                           courseCode: db.RegExp({
                                              regexp: courseCode,
                                              options: 'i'
                                            })
                                         })
                                         .get()
    const count =  (await db.collection('classes').where({
                                                    courseCode: db.RegExp({
                                                      regexp: courseCode,
                                                      options: 'i'
                                                    })
                                                  })
                                                  .count()).total
    const totalPage = Math.ceil(count / MAX_LIMIT)
    return {...data, totalPage}
  }else if(target === "search_professors"){
    const { professorName } = event
    const data = db.collection('professors').limit(3)
                                            .skip(MAX_LIMIT * (currentPage-1))
                                            .orderBy("professorName", "asc")
                                            .where({
                                              professorName: db.RegExp({
                                                regexp: professorName,
                                                options: 'i'
                                              })
                                            })
                                            .get()
    const count =  (await db.collection('professors').where({
                                              professorName: db.RegExp({
                                                regexp: professorName,
                                                options: 'i'
                                              })
                                            }).count()).total
    const totalPage = Math.ceil(count / MAX_LIMIT)
    return {...data, totalPage}
                                  
  }else if(target === "all_professors"){
    const data = await db.collection('professors').limit(10)
                                            .skip(MAX_LIMIT * (currentPage-1))
                                            .orderBy("professorName", "asc")
                                            .get()
    const count = (await db.collection('professors').count()).total
    const totalPage = Math.ceil(count / MAX_LIMIT)
    return {...data, totalPage}
    
  }

  return {
    event,
    msg: "error"
  }
}