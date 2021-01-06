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
  if (target === "get_reviews_for_course_for_professor_for_page") {
    let { courseID, currentPageInReviews, professorID } = event
    const condition = {}
    if (courseID) condition["courseID"] = courseID
    if (professorID) condition["professorID"] = professorID
    console.log(condition);

    //data constains user, professor, and course information
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

    //check if it's been voted by me
    let my_voted_reviews_raw = db.collection("voted_reviews").where(
      { openID: openID }
    ).get();
    let my_saved_reviews_raw = db.collection("saved_reviews").where(
      { openID: openID }
    ).get();

    [data, my_voted_reviews_raw, my_saved_reviews_raw] = await Promise.all([data, my_voted_reviews_raw, my_saved_reviews_raw]);
    
    let my_voted_reviews = {}
    let my_saved_reviews = {}
    for (let i = 0; i < my_voted_reviews_raw.data.length; i++) {
      my_voted_reviews[my_voted_reviews_raw.data[i].reviewID] = my_voted_reviews_raw.data[i].voted_by_me
    }
    for (let i = 0; i < my_saved_reviews_raw.data.length; i++) {
      my_saved_reviews[my_saved_reviews_raw.data[i].reviewID] = 1
    }

    //update voted_by_me, posted_by_me, saved_by_me
    data.list = data.list.map((item) => {
      let temp = item
      temp.posted_by_me = item.openID === openID
      temp.voted_by_me = (item._id in my_voted_reviews ? my_voted_reviews[item._id] : 0)
      temp.saved_by_me = (item._id in my_saved_reviews ? true : false)
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
  else if (target == "get_rating_saved_reviews") {
    let { professorID, courseID, userID } = event;
    const condition = {};
    if (courseID) condition["courseID"] = courseID;
    if (professorID) condition["professorID"] = professorID;
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
          .match(condition)
          .match(_.expr($.and([
            $.eq(['$$reviewID', '$_id']),
          ])))
          .done(),
        as: 'review'
      })
      .end()
    return { data };
  }
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
