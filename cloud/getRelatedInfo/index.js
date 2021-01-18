// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "test-0gbtzjgqaae3f2b2"
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  if(event.target === "courses"){
    // return await db.collection('courses').get();
    return await db.collection('courses').limit(10)
                                         .orderBy("courseCode", "asc")
                                         .where({
                                          courseCode: db.RegExp({
                                            regexp: event.courseCode, // 用用户输入的courseCode来进行查询
                                            options: 'i' // 忽略大小写
                                          })
                                         })
                                         .get();
  }
  else if(event.target === "professors"){
    return await db.collection('professors').limit(10)
                                         .orderBy("professorName", "asc")
                                         .where({
                                          professorName: db.RegExp({
                                            regexp: event.professorName, // 用用户输入的courseCode来进行查询
                                            options: 'i' // 忽略大小写
                                          })
                                         })
                                         .get();
  }
  return{
    event,
    msg: "error"
  }
}