// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const MAX_LIMIT = 3

// 云函数入口函数
const db = cloud.database();
exports.main = async (event, context) => {
  const { target, openID } = event;
  // const wxContext = cloud.getWXContext()
  // const openID = wxContext.OPENID
  const $ = db.command.aggregate;
  const _ = db.command;
  if (target === 'getCourseInfo') {
    const { courseID } = event;
    console.log(courseID);
    const data = await db.collection('courses')
      .where({
        _id: courseID
      })
      .get()
    const count = (await db.collection('saved_courses')
      .where({
        courseID: courseID,
        openID: openID
      })
      .count()).total
    console.log(data.data[0]);
    data.data[0].isFavorite = count === 1;
    return data;
  } else if (target === "get_reviews_for_course_for_professor_for_page") {
    let { courseID, currentPageInReviews, professorID } = event
    const condition = {}
    if (courseID) condition["courseID"] = courseID
    if (professorID) condition["professorID"] = professorID
    console.log(condition);
    // let data = await db.collection('reviews')
    //   .where(condition)
    //   .limit(MAX_LIMIT)
    //   .skip(MAX_LIMIT * (currentPageInReviews - 1))
    //   .get()
    let data = db.collection('reviews')
      .aggregate()
      .match(condition)
      .limit(MAX_LIMIT)
      .skip(MAX_LIMIT * (currentPageInReviews - 1))
      .lookup({
        from: 'users',
        localField: 'openID',
        foreignField: 'openID',
        as: 'userInfo'
      })
      .lookup({
        from: 'professors',
        localField: 'professorID',
        foreignField: '_id',
        as: 'professorInfo'
      })
      .lookup({
        from: 'courses',
        localField: 'courseID',
        foreignField: '_id',
        as: 'courseInfo'
      })
      .end()

    let my_voted_reviews_raw = db.collection("voted_reviews").where(
      { openID: openID }
    ).get();
    let my_saved_reviews_raw = db.collection("saved_reviews").where(
      { openID: openID }
    ).get();
    // let prof
    // if(professorID){
    //   prof = db.collection("professors").where({_id: professorID}).get();
    // }
    // let course
    // if(courseID){
    //   course = db.collection("courses").where({_id: courseID}).get();
    // }
    [data, my_voted_reviews_raw, my_saved_reviews_raw] = await Promise.all([data, my_voted_reviews_raw, my_saved_reviews_raw]);
    
    let my_voted_reviews = {}
    let my_saved_reviews = {}
    for (let i = 0; i < my_voted_reviews_raw.data.length; i++) {
      my_voted_reviews[my_voted_reviews_raw.data[i].reviewID] = my_voted_reviews_raw.data[i].voted_by_me
    }
    for (let i = 0; i < my_saved_reviews_raw.data.length; i++) {
      my_saved_reviews[my_saved_reviews_raw.data[i].reviewID] = 1
    }

    data.list = data.list.map((item) => {
      let temp = item
      temp.posted_by_me = item.openID === openID
      temp.voted_by_me = (item._id in my_voted_reviews ? my_voted_reviews[item._id] : 0)
      temp.saved_by_me = (item._id in my_saved_reviews ? true : false)
      // temp.courseCode = course?course.data[0].courseCode:"N/A"
      // temp.professorName = prof?prof.data[0].professorName:"N/A"
      return temp
    })
    console.log(data.list);
    return data.list
  } else if (target === "get_total_page_of_reviews_for_course_for_professor") {
    let { courseID, professorID } = event
    const condition = {}
    if (courseID) condition["courseID"] = courseID
    if (professorID) condition["professorID"] = professorID
    const data = await db.collection('reviews')
      .where(
        condition
      )
      .count()
    const count = data.total
    const totalPage = Math.ceil(count / MAX_LIMIT)
    return totalPage
  }
  else if (target === 'getProfessorInfo') {
    let { professorID } = event
    const data = await db.collection('professors')
      .where({
        _id: professorID
      })
      .get()
    return data
  } else if (target == "get_rating_saved_reviews") {
    let { professorID, courseID, userID } = event;
    console.log(professorID);
    console.log(courseID);
    console.log(userID);
    if (professorID == undefined && courseID == undefined) {
      const data = await db.collection('saved_reviews')
        .aggregate()
        .match({
          openID: userID
        })
        .lookup({
          from: 'reviews',
          let: {
            reviewID: '$reviewID',
          },
          pipeline: $.pipeline()
            .match(_.expr($.and([
              $.eq(['$$reviewID', '$_id']),
            ])))
            .done(),
          as: 'review'
        })
        .end()
      return { data }
    } else if (professorID == undefined) {
      console.log(professorID);
      const data = await db.collection('saved_reviews')
        .aggregate()
        .match({
          openID: userID
        })
        .lookup({
          from: 'reviews',
          let: {
            reviewID: '$reviewID',
          },
          pipeline: $.pipeline()
            .match({
              courseID: courseID
            })
            .match(_.expr($.and([
              $.eq(['$$reviewID', '$_id'])
            ])))
            .done(),
          as: 'review'
        })
        .end()
      return { data }
    } else if (courseID == undefined) {
      const data = await db.collection('saved_reviews')
        .aggregate()
        .match({
          openID: userID
        })
        .lookup({
          from: 'reviews',
          let: {
            reviewID: '$reviewID',
          },
          pipeline: $.pipeline()
            .match({
              professorID: professorID
            })
            .match(_.expr($.and([
              $.eq(['$$reviewID', '$_id']),
            ])))
            .done(),
          as: 'review'
        })
        .end()
      return { data }
    } else {
      const data = await db.collection('saved_reviews')
        .aggregate()
        .match({
          openID: userID
        })
        .lookup({
          from: 'reviews',
          let: {
            reviewID: '$reviewID',
          },
          pipeline: $.pipeline()
            .match({
              courseID: courseID,
              professorID: professorID
            })
            .match(_.expr($.and([
              $.eq(['$$reviewID', '$_id']),
            ])))
            .done(),
          as: 'review'
        })
        .end()
      return { data }
    }
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
  return { "": "" };
}

async function countTotalPage(professorID) {
  const data = await db.collection('reviews')
    .where({
      professorID: professorID
    })
    .count()
  const count = data.total
  const totalPage = Math.ceil(count / MAX_LIMIT)
  return totalPage
}
