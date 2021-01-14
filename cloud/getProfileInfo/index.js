// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const MAX_LIMIT = 3;
// 云函数入口函数
const db = cloud.database();
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  const $ = db.command.aggregate;
  const _ = db.command;
  const {target, openID,courseID,professorID,currentPageInReviews} = event;
  const condition = {};
  condition["openID"] = openID;
  if (courseID) condition["courseID"] = courseID;
  if (professorID) condition["professorID"] = professorID;
  if(target=="pastReviews"){
    console.log(condition);
    let data = db.collection('reviews')
    .aggregate()
    .match(condition)
    .skip(MAX_LIMIT * (currentPageInReviews - 1))
    .limit(MAX_LIMIT)
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
    .end();

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
  return data.list;
  }else if(target=="countTotalPagesPastReviews"){
    let data = await db.collection('reviews')
    .aggregate()
    .match(condition)
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
    .count("count")
    .end();
    console.log(data);
    const count = data.list[0].count;
    console.log(count);
    const totalPage = Math.ceil(count / MAX_LIMIT)
    return totalPage;
  }else if(target=="getAllPickerPastReviews"){
    let data = db.collection('reviews')
    .aggregate()
    .match(condition)
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
    .end();

  [data] = await Promise.all([data]);
  console.log(data.list);
  return data.list;
  }
  else if(target=="savedReviews"){
    console.log(openID);
    let data = db.collection('saved_reviews')
    .aggregate()
    .match({
      openID:openID
    })
    .skip(MAX_LIMIT * (currentPageInReviews - 1))
    .limit(MAX_LIMIT)
    .lookup({
      from:'reviews',
      let:{
        reviewID:'$reviewID'
      },
      pipeline:$.pipeline()
        .match(condition)
        .match(_.expr($.and([
          $.eq(['$$reviewID','$_id']),
        ])))
        .done(),
      as:'reviews'
    })
    .end();

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
    console.log(data);
    for(let i=0;i<data.list.length;i++){
      if(data.list[i].reviews.length!=0){
        let temp = data.list[i].reviews[0]
      
        temp.posted_by_me = temp.openID === openID
        temp.voted_by_me = (temp._id in my_voted_reviews ? my_voted_reviews[temp._id] : 0)
        temp.saved_by_me = (temp._id in my_saved_reviews ? true : false)
        temp.courseInfo=(await db.collection('courses').where({
          _id:temp.courseID
        }).get()).data;
        temp.professorInfo=(await db.collection('professors').where({
          _id:temp.professorID
        }).get()).data;
        temp.userInfo=(await db.collection('users').where({
          openID:openID
        }).get()).data;
        data.list[i] = temp;
      }else{
        data.list[i] = undefined;
      }
    }
    console.log(data.list);
    return data.list;
  }else if(target=="countTotalPagesSavedReviews"){
    let data = await db.collection('saved_reviews')
    .aggregate()
    .match({
      openID:openID
    })
    .lookup({
      from:'reviews',
      let:{
        reviewID:'$reviewID'
      },
      pipeline:$.pipeline()
        .match(condition)
        .match(_.expr($.and([
          $.eq(['$$reviewID','$_id']),
        ])))
        .done(),
      as:'reviews'
    })
    .count("count")
    .end()
    console.log(data);
    const count = data.list[0].count
    const totalPage = Math.ceil(count / MAX_LIMIT)
    return totalPage;
  }else if(target=="getAllPickerSavedReviews"){
    console.log(openID);
    let data = db.collection('saved_reviews')
    .aggregate()
    .match({
      openID:openID
    })
    .lookup({
      from:'reviews',
      let:{
        reviewID:'$reviewID'
      },
      pipeline:$.pipeline()
        .match(condition)
        .match(_.expr($.and([
          $.eq(['$$reviewID','$_id']),
        ])))
        .done(),
      as:'reviews'
    })
    .end();


    [data] = await Promise.all([data]);
    for(let i=0;i<data.list.length;i++){
      if(data.list[i].reviews.length!=0){
        let temp = data.list[i].reviews[0]
        temp.courseInfo=(await db.collection('courses').where({
          _id:temp.courseID
        }).get()).data;
        temp.professorInfo=(await db.collection('professors').where({
          _id:temp.professorID
        }).get()).data;
        temp.userInfo=(await db.collection('users').where({
          openID:openID
        }).get()).data;
        data.list[i] = temp;
      }else{
        data.list[i] = undefined;
      }
    }
    console.log(data.list);
    return data.list;
  }
  else if(target=="savedCourses"){
    let {prefix} = event;

    if(prefix == undefined){
      const data = await db.collection('saved_courses')
      .aggregate()
      .match({
        openID:openID
      })
      .lookup({
        from:'courses',
        localField:'courseID',
        foreignField:'_id',
        as:'courseInfo'
      })
      .end();
      return data;
    }else{
      console.log(prefix);
      const data = await db.collection('saved_courses')
      .aggregate()
      .match({
        openID:openID
      })
      .lookup({
        from:'courses',
        let:{
          courseID:'$courseID'
        },
        pipeline:$.pipeline()
          .match({
            courseCode:{
              $regex:prefix+'.*',
              $options:'i'
            }
          })
          .match(_.expr($.and([
            $.eq(['$$courseID','$_id']),
          ])))
          .done(),
        as:'courseInfo'
      })
      .end()
      return data;
    }
  }
  return {};
}


  // const count = data.total
  // const totalPage = Math.ceil(count / MAX_LIMIT)
  // return totalPage
