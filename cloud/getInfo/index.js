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
    const { sort } = event
    let name, type
    if(sort === 0){
      name = "courseCode"
      type = "asc"
    }else if(sort === 1){
      name = "difficultyRating"
      type = "asc"
    }else if(sort === 2){
      name = "interestRating"
      type = "desc"
    }else if(sort === 3){
      name = "workloadRating"
      type = "asc"
    }else if(sort === 4){
      name = "teachingRating"
      type = "desc"
    }
    let data = db.collection('courses').limit(MAX_LIMIT)
                                         .skip(MAX_LIMIT * (currentPage-1))
                                         .orderBy(name, type)
                                         .where({
                                           "workloadRating": db.command.exists(true)
                                         })
                                         .get()
    let count = db.collection('courses').count();
    [data, count] = await Promise.all([data, count])
    count = count.total

    const totalPage = Math.ceil(count / MAX_LIMIT)
    return {...data, totalPage, event}
  }else if(target === "search_classes"){
    const { courseCode, sort } = event
    // const {  } = event
    let name, type
    if(sort === 0){
      name = "courseCode"
      type = "asc"
    }else if(sort === 1){
      name = "difficultyRating"
      type = "asc"
    }else if(sort === 2){
      name = "interestRating"
      type = "desc"
    }else if(sort === 3){
      name = "workloadRating"
      type = "asc"
    }else if(sort === 4){
      name = "teachingRating"
      type = "desc"
    }
    let data =  db.collection('courses').limit(MAX_LIMIT)
                                         .skip(MAX_LIMIT * (currentPage-1))
                                         .orderBy(name, type)
                                         .where({
                                           courseCode: db.RegExp({
                                              regexp: courseCode,
                                              options: 'i'
                                            })
                                         })
                                         .get();
    let count =  db.collection('courses').where({
                                                    courseCode: db.RegExp({
                                                      regexp: courseCode,
                                                      options: 'i'
                                                    })
                                                  })
                                                  .count();
    [data, count] = await Promise.all([data, count])
    count = count.total
    const totalPage = Math.ceil(count / MAX_LIMIT)
    return {...data, totalPage, event}
  }else if(target === "search_professors"){
    const { professorName } = event
    let data =  db.collection('professors').limit(MAX_LIMIT)
                                            .skip(MAX_LIMIT * (currentPage-1))
                                            .orderBy("professorName", "asc")
                                            .where({
                                              professorName: db.RegExp({
                                                regexp: professorName,
                                                options: 'i'
                                              })
                                            })
                                            .get()
    let count =  db.collection('professors').where({
                                              professorName: db.RegExp({
                                                regexp: professorName,
                                                options: 'i'
                                              })
                                            }).count();
    [data, count] = await Promise.all([data, count])
    count = count.total
    const totalPage = Math.ceil(count / MAX_LIMIT)
    return {...data, totalPage}
                                  
  }else if(target === "default_professors"){
    let data = db.collection('professors').limit(MAX_LIMIT)
                                            .skip(MAX_LIMIT * (currentPage-1))
                                            .orderBy("professorName", "asc")
                                            .get();
    let count = db.collection('professors').count();
    [data, count] = await Promise.all([data, count])
    count = count.total
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