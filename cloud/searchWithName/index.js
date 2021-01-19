// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "test-0gbtzjgqaae3f2b2"
})
const MAX_LIMIT = 3

// 云函数入口函数
exports.main = async (event, context) => {
  const { target, currentPage } = event
  // const wxContext = cloud.getWXContext()
  const db = cloud.database()
  // const { OPENID, APPID } = wxContext

  
  if(target === "recommended_courses" || (target === "search_courses" && event.courseCode==="")){
    const { sort } = event
    let name, type
    if(sort === 0){
      name = "courseCode"
      type = "asc"
    }else if(sort === 1){
      name = "difficultyRating"
      type = "asc"
    }else if(sort === 2){
      name = "entertainmentRating"
      type = "desc"
    }else if(sort === 3){
      name = "workloadRating"
      type = "asc"
    }else if(sort === 4){
      name = "enrichmentRating"
      type = "desc"
    }
    console.log(name);
    let data, count
    if(sort === 0){
      data = db.collection('courses')
        .orderBy(name, type)
        .skip(MAX_LIMIT * (currentPage-1))
        .limit(MAX_LIMIT)
        .get()
        count = db.collection('courses').count();
    }else{
      db.collection('courses')
        .where({
          numReviews: db.command.exists(true)
        })
        .orderBy(name, type)
        .skip(MAX_LIMIT * (currentPage-1))
        .limit(MAX_LIMIT)
        .get()
        count = db.collection('courses').where({
          numReviews: db.command.exists(true)
        }).count();
    }
    
    [data, count] = await Promise.all([data, count])
    count = count.total

    const totalPage = Math.ceil(count / MAX_LIMIT)
    console.log(data);
    return {...data, totalPage, event}
  }else if(target === "search_courses"){
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
      name = "entertainmentRating"
      type = "desc"
    }else if(sort === 3){
      name = "workloadRating"
      type = "asc"
    }else if(sort === 4){
      name = "enrichmentRating"
      type = "desc"
    }
    let data =  db.collection('courses')
        .where({
          courseCode: db.RegExp({
            regexp: courseCode,
            options: 'i'
          }),
        })
        .orderBy(name, type)
        .skip(MAX_LIMIT * (currentPage-1))
        .limit(MAX_LIMIT)
        .get();
    let count =  db.collection('courses')
        .where({
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
    let data =  db.collection('professors')
        .where({
          professorName: db.RegExp({
            regexp: professorName,
            options: 'i'
          })
        })
        .orderBy("professorName", "asc")
        .skip(MAX_LIMIT * (currentPage-1))
        .limit(MAX_LIMIT)
        .get()
    let count =  db.collection('professors')
        .where({
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
    let data = db.collection('professors')
      .orderBy("professorName", "asc")
      .skip(MAX_LIMIT * (currentPage-1))
      .limit(MAX_LIMIT)
      .get();
    let count = db.collection('professors').count();
    [data, count] = await Promise.all([data, count])
    count = count.total
    const totalPage = Math.ceil(count / MAX_LIMIT)
    return {...data, totalPage}

  }else if(target === "all_professors"){
    const data = await db.collection('professors')
      .orderBy("professorName", "asc")
      .skip(MAX_LIMIT * (currentPage-1))
      .limit(10)
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