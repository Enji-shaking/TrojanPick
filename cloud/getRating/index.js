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
  if(target=='fromCourse'){
    let {courseID} = event;
    const data = await db.collection('classes')
    .aggregate()
    .match({
      _id:courseID
    })
    .lookup({
      from:'ratings',
      localField:'_id',
      foreignField:'courseID',
      as:'ratinglist'
    })
    .end()
    return {data};
  }else if(target==='getProfessorInfo'){
    let{professorID} = event
    const data = await db.collection('professors')
    .where({
      _id:professorID
    })
    .get()
    
    // if(totalPage){
    //   res = await Promise.all([data, totalPage])
    //   return {...res}
    // }else{
    //   res = await data
    //   return res
    // }
    return data
  }else if(target === "get_reviews_for_professor_for_page"){
    let{professorID, currentPageRatings} = event
    const data = await db.collection('reviews')
                  .where({professorID: professorID})
                  .limit(MAX_LIMIT)
                  .skip(MAX_LIMIT * (currentPageRatings-1))
                  .get()
    return data
  }else if(target === "get_total_page_of_reviews_for_professor"){
    const {professorID} = event
    return countTotalPage(professorID)
  }
  else if(target=="professor_course"){
    let{professorID,courseID} = event;
    const data = await db.collection('reviews')
    .where({
      professorID:professorID,
      courseID:courseID
    })
    .get()
    const rating = await db.collection('class_professor')
    .where({
      professor_id:professorID,
      class_id:courseID
    }).get()
    return {data,rating};
  }else if(target=="get_rating_saved_reviews"){
    let {professorID,courseID,userID} = event;
    console.log(professorID);
    console.log(courseID);
    console.log(userID);
    if(professorID == undefined && courseID == undefined){
      const data = await db.collection('saved_reviews')
      .aggregate()
      .match({
        openID:userID
      })
      .lookup({
        from:'reviews',
        let:{
          reviewID:'$reviewID',
        },
        pipeline:$.pipeline()
          .match(_.expr($.and([
            $.eq(['$$reviewID','$_id']),
          ])))
          .done(),
          as:'review'
      })
      .end()
      return {data}
    }else if(professorID == undefined){
      console.log(professorID);
      const data = await db.collection('saved_reviews')
      .aggregate()
      .match({
        openID:userID
      })
      .lookup({
        from:'reviews',
        let:{
          reviewID:'$reviewID',
        },
        pipeline:$.pipeline()
          .match({
            courseID:courseID
          })
          .match(_.expr($.and([
            $.eq(['$$reviewID','$_id'])
          ])))
          .done(),
          as:'review'
      })
      .end()
      return {data}
    }else if(courseID == undefined){
      const data = await db.collection('saved_reviews')
      .aggregate()
      .match({
        openID:userID
      })
      .lookup({
        from:'reviews',
        let:{
          reviewID:'$reviewID',
        },
        pipeline:$.pipeline()
          .match({
            professorID:professorID
          })
          .match(_.expr($.and([
            $.eq(['$$reviewID','$_id']),
          ])))
          .done(),
          as:'review'
      })
      .end()
      return {data}
    }else{
      const data = await db.collection('saved_reviews')
      .aggregate()
      .match({
        openID:userID
      })
      .lookup({
        from:'reviews',
        let:{
          reviewID:'$reviewID',
        },
        pipeline:$.pipeline()
          .match({
            courseID:courseID,
            professorID:professorID
          })
          .match(_.expr($.and([
            $.eq(['$$reviewID','$_id']),
          ])))
          .done(),
          as:'review'
      })
      .end()
      return {data}
    }
  }
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
