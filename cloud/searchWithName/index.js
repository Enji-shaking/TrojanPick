// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "test-0gbtzjgqaae3f2b2"
})
const MAX_LIMIT = 10

// 云函数入口函数
exports.main = async (event, context) => {
  const { target, currentPage } = event
  // const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command
  // const { OPENID, APPID } = wxContext

  
  if(target === "recommended_courses" || (target === "search_courses" && event.courseCode==="")){
    const { sort } = event
    let condition = []
    if(sort === 0){
      condition.push("overallRating")
      condition.push("desc")
    }else if(sort === 1){
      condition.push("difficultyRating")
      condition.push("asc")
    }else if(sort === 2){
      condition.push("entertainmentRating")
      condition.push("desc")
    }else if(sort === 3){
      condition.push("workloadRating")
      condition.push("asc")
    }else if(sort === 4){
      condition.push("enrichmentRating")
      condition.push("desc")
    }else if(sort === 5){
      condition.push("courseCode")
      condition.push("asc")
    }
    console.log(sort);
    console.log(condition);
    let data, count
    // if(sort === 5){
    //   data = db.collection('courses')
    //     .orderBy(...condition)
    //     // .orderBy("courseUnit", "asc")
    //     .skip(MAX_LIMIT * (currentPage-1))
    //     .limit(MAX_LIMIT)
    //     .get()
    //     count = db.collection('courses').count();
    // }else{
      data = db.collection('courses')
        .where({
          numReviews: _.gt(0)
        })
        .orderBy(...condition)
        .skip(MAX_LIMIT * (currentPage-1))
        .limit(MAX_LIMIT)
        .get()
        count = db.collection('courses').where({
          numReviews: _.gt(0)
        }).count();
    // }
    
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
      name = "overallRating"
      type = "desc"
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
    }else if(sort === 5){
      name = "courseCode"
      type = "asc"
    }
    let data =  db.collection('courses')
        .where({
          // numReviews: _.gt(0),
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
          // numReviews: _.gt(0),
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
    const { professorName, forProf } = event
    let data =  db.collection('professors')
        .where({
          forProf: forProf,
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
          forProf: forProf,
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
    const {forProf} = event
    console.log(event);
    let data = db.collection('professors')
      .where({
        forProf: forProf
      })
      .orderBy("professorName", "asc")
      .skip(MAX_LIMIT * (currentPage-1))
      .limit(MAX_LIMIT)
      .get();
    let count = db.collection('professors').where({forProf: forProf}).count();
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