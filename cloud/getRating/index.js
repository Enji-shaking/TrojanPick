// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const MAX_LIMIT = 3

// 云函数入口函数
const db = cloud.database();
exports.main = async (event, context) => {
  let {target} = event;
  const wxContext = cloud.getWXContext()
  const $ = db.command.aggregate;
  const _ = db.command;
  if(target==='getCourseInfo'){
    let {courseID} = event;
    console.log(courseID);
    const data = await db.collection('courses')
                        .where({
                          _id: courseID
                        })
                        .get()
    return data;
  }else if(target === "get_reviews_for_course_for_professor_for_page"){
    let{courseID, currentPageInReviews, professorID} = event
    const condition = {}
    if(courseID) condition["courseID"] = courseID
    if(professorID) condition["professorID"] = professorID
    console.log(condition);
    const data = await db.collection('reviews')
                  .where(condition)
                  .limit(MAX_LIMIT)
                  .skip(MAX_LIMIT * (currentPageInReviews-1))
                  .get()
    return data
  }else if(target === "get_total_page_of_reviews_for_course_for_professor"){
    let {courseID, professorID} = event
    const condition = {}
    if(courseID) condition["courseID"] = courseID
    if(professorID) condition["professorID"] = professorID
    const data = await db.collection('reviews')
        .where(
          condition
        )
        .count()
    const count = data.total
    const totalPage = Math.ceil(count / MAX_LIMIT)
    return totalPage
  }
  else if(target==='getProfessorInfo'){
    let{professorID} = event
    const data = await db.collection('professors')
    .where({
      _id:professorID
    })
    .get()
    return data
  }
  // else if(target === "get_reviews_for_professor_for_page"){
  //   let{professorID, currentPageInReviews} = event
  //   const data = await db.collection('reviews')
  //                 .where({professorID: professorID})
  //                 .limit(MAX_LIMIT)
  //                 .skip(MAX_LIMIT * (currentPageInReviews-1))
  //                 .get()
  //   return data
  // }else if(target === "get_total_page_of_reviews_for_professor"){
  //   const {professorID} = event
  //   return countTotalPage(professorID)
  // }
  // else if(target=="professor_course"){
  //   let{professorID,courseID} = event;
  //   const data = await db.collection('reviews')
  //   .where({
  //     professorID:professorID,
  //     courseID:courseID
  //   })
  //   .get()
  //   const rating = await db.collection('class_professor')
  //   .where({
  //     professor_id:professorID,
  //     class_id:courseID
  //   }).get()
  //   return {data,rating};
  // }
  return {"":""};
}

async function countTotalPage(professorID){
  const data = await db.collection('reviews')
  .where({
    professorID:professorID
  })
  .count()
  const count = data.total
  const totalPage = Math.ceil(count / MAX_LIMIT)
  return totalPage
}
