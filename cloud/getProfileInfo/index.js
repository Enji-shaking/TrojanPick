// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
const db = cloud.database();
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const $ = db.command.aggregate;
  const _ = db.command;
  let {target} = event;
  let {userID} = event;
  if(target=="pastRatings"){
    const data = await db.collection('users').where({
      openID:userID
    }).get();
    const myReviewID = data.data[0].myReviewIDs;
    let reviews = [];
    for(let i=0;i<myReviewID.length;i++){
      let review = await db.collection('reviews').where({
        _id:myReviewID[i]
      }).get();
      reviews.push(review);
    }
    return reviews;
  }else if(target=="favoriteRatings"){
    const data = await db.collection('saved_reviews')
    .aggregate()
    .match({
      openID:userID
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
        openID:userID
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
        openID:userID
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