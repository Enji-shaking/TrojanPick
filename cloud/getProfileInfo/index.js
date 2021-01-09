// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
const db = cloud.database();
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const $ = db.command.aggregate;
  const _ = db.command;
  const {target, openID} = event;
  console.log(openID);
  if(target=="pastReviews"){
    const data = await db.collection('users').where({
      openID:openID
    }).get();
    console.log(data);
    let { professorID, courseID } = event;
    const condition = {};
    if (courseID) condition["courseID"] = courseID;
    if (professorID) condition["professorID"] = professorID;
    const myReviewID = data.data[0].myReviewIDs;
    let reviews = [];
    for(let i=0;i<myReviewID.length;i++){
      let review = await db.collection('reviews')
      .where(condition)
      .where({
        _id:myReviewID[i]
      })
      .get();
      reviews.push(review);
    }
    return reviews;
  }else if(target=="favoriteReviews"){
    const data = await db.collection('saved_reviews')
    .aggregate()
    .match({
      openID:openID
    })
    .lookup({
      from:'reviews',
      localField:'reviewID',
      foreignField:'_id',
      as:'reviews'
    })
    .end();
    return data;
  }else if(target=="savedClasses"){
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
  }else if(target=="user"){
    
  }
  return {};
}