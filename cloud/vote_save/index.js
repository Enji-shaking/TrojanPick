// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  // const openID = wxContext.OPENID
  const { target, reviewID, openID,commentID} = event
  if(target === "vote_review_up_new"){
    const p1 = db.collection("reviews").where({_id: reviewID}).update({
      data:{
        up_vote_count: _.inc(1)
      }
    })
    const p2 = db.collection("voted_reviews").add({
      data:{
        openID: openID,
        reviewID: reviewID,
        voted_by_me: 1
      }
    })
    return await Promise.all([p1, p2])
  }
  else if(target === "vote_review_up_fromDown"){
    const p1 = db.collection("reviews").where({_id: reviewID}).update({
      data:{
        up_vote_count: _.inc(1),
        down_vote_count: _.inc(-1)
      }
    })
    const p2 = db.collection("voted_reviews").where({openID: openID, reviewID: reviewID}).update({data:{voted_by_me: 1}})
    return await Promise.all([p1, p2])
  }else if(target === "vote_review_up_cancel"){
    const p1 = db.collection("reviews").where({_id: reviewID}).update({
      data:{
        up_vote_count: _.inc(-1),
      }
    })
    const p2 = db.collection("voted_reviews")
        .where({reviewID: reviewID, openID: openID})
        .remove()
    return await Promise.all([p1, p2])
  }else if(target === "vote_review_down_new"){
    const p1 = db.collection("reviews").where({_id: reviewID}).update({
      data:{
        down_vote_count: _.inc(1)
      }
    })
    const p2 = db.collection("voted_reviews").add({
      data:{
        openID: openID,
        reviewID: reviewID,
        voted_by_me: -1
      }
    })
    return await Promise.all([p1, p2])
  }
  else if(target === "vote_review_down_fromUp"){
    const p1 = db.collection("reviews").where({_id: reviewID}).update({
      data:{
        up_vote_count: _.inc(-1),
        down_vote_count: _.inc(1)
      }
    })
    const p2 = db.collection("voted_reviews")
          .where({openID: openID, reviewID: reviewID})
          .update({data:{voted_by_me: -1}})
    return await Promise.all([p1, p2])

  }else if(target === "vote_review_down_cancel"){
    const p1 = db.collection("reviews").where({_id: reviewID}).update({
      data:{
        down_vote_count: _.inc(-1),
      }
    })
    const p2 = db.collection("voted_reviews")
        .where({reviewID: reviewID, openID: openID})
        .remove()
    return await Promise.all([p1, p2])


  }else if(target === "save_review"){
    const p1 = db.collection("reviews").where({_id: reviewID}).update({
      data:{
        favoriteCount: _.inc(1)
      }
    })
    const p2 = db.collection("saved_reviews").add({
      data:{
        openID: openID,
        reviewID: reviewID
      }
    })
    return await Promise.all([p1, p2])
  }else if(target === "unsave_review"){
    const p1 = db.collection("reviews").where({_id: reviewID}).update({
      data:{
        favoriteCount: _.inc(-1)
      }
    })
    const p2 = db.collection("saved_reviews").where({
        openID: openID,
        reviewID: reviewID
    }).remove()
    return await Promise.all([p1, p2])
  }else if(target === "save_course"){
    //not finished
    const{courseID} = event
    return await db.collection("saved_courses").add({
      data:{
        openID: openID,
        courseID: courseID
      }
    })
  }else if(target === "unsave_course"){
    const {courseID} = event
    return await db.collection("saved_courses").where({
        openID: openID,
        courseID: courseID
    }).remove()
  }else if(target=="vote_comment_up_new"){
    const p1 = db.collection("comments").where({_id: commentID}).update({
      data:{
        up_vote_count: _.inc(1)
      }
    })
    const p2 = db.collection("voted_comments").add({
      data:{
        openID: openID,
        commentID: commentID,
        voted_by_me: 1
      }
    })
    return await Promise.all([p1, p2])
  }else if(target=="vote_comment_up_fromDown"){
    const p1 = db.collection("comments").where({_id: commentID}).update({
      data:{
        up_vote_count: _.inc(1),
        down_vote_count: _.inc(-1)
      }
    })
    const p2 = db.collection("voted_comments").where({openID: openID, commentID: commentID}).update({data:{voted_by_me: 1}})
    return await Promise.all([p1, p2])
  }else if(target=="vote_comment_up_cancel"){
    const p1 = db.collection("comments").where({_id: commentID}).update({
      data:{
        up_vote_count: _.inc(-1),
      }
    })
    const p2 = db.collection("voted_comments")
        .where({commentID: commentID, openID: openID})
        .remove()
    return await Promise.all([p1, p2])
  }else if(target=="vote_comment_down_new"){
    const p1 = db.collection("comments").where({_id: commentID}).update({
      data:{
        down_vote_count: _.inc(1)
      }
    })
    const p2 = db.collection("voted_comments").add({
      data:{
        openID: openID,
        commentID: commentID,
        voted_by_me: -1
      }
    })
    return await Promise.all([p1, p2])
  }else if(target=="vote_comment_down_fromUp"){
    const p1 = db.collection("comments").where({_id: commentID}).update({
      data:{
        up_vote_count: _.inc(-1),
        down_vote_count: _.inc(1)
      }
    })
    const p2 = db.collection("voted_comments")
          .where({openID: openID, commentID: commentID})
          .update({data:{voted_by_me: -1}})
    return await Promise.all([p1, p2])
  }else if(target=="vote_comment_down_cancel"){
    const p1 = db.collection("comments").where({_id: commentID}).update({
      data:{
        down_vote_count: _.inc(-1),
      }
    })
    const p2 = db.collection("voted_comments")
        .where({commentID: commentID, openID: openID})
        .remove()
    return await Promise.all([p1, p2])
  }
  else if(target=="vote_answer_up_new"){
    const {answerID} = event
    const p1 = db.collection("answers").where({_id: answerID}).update({
      data:{
        up_vote_count: _.inc(1)
      }
    })
    const {questionID} = event
    const p2 = db.collection("voted_answers").add({
      data:{
        openID: openID,
        answerID: answerID,
        voted_by_me: 1,
        questionID: questionID
      }
    })
    return await Promise.all([p1, p2])
  }else if(target=="vote_answer_up_fromDown"){
    const {answerID} = event
    const p1 = db.collection("answers").where({_id: answerID}).update({
      data:{
        up_vote_count: _.inc(1),
        down_vote_count: _.inc(-1)
      }
    })
    const p2 = db.collection("voted_answers").where({openID: openID, answerID: answerID}).update({data:{voted_by_me: 1}})
    return await Promise.all([p1, p2])
  }else if(target=="vote_answer_up_cancel"){
    const {answerID} = event
    const p1 = db.collection("answers").where({_id: answerID}).update({
      data:{
        up_vote_count: _.inc(-1),
      }
    })
    const p2 = db.collection("voted_answers")
        .where({answerID: answerID, openID: openID})
        .remove()
    return await Promise.all([p1, p2])
  }else if(target=="vote_answer_down_new"){
    const {answerID} = event
    const p1 = db.collection("answers").where({_id: answerID}).update({
      data:{
        down_vote_count: _.inc(1)
      }
    })
    const {questionID} = event
    const p2 = db.collection("voted_answers").add({
      data:{
        openID: openID,
        answerID: answerID,
        voted_by_me: -1,
        questionID: questionID
      }
    })
    return await Promise.all([p1, p2])
  }else if(target=="vote_answer_down_fromUp"){
    const {answerID} = event
    const p1 = db.collection("answers").where({_id: answerID}).update({
      data:{
        up_vote_count: _.inc(-1),
        down_vote_count: _.inc(1)
      }
    })
    const p2 = db.collection("voted_answers")
          .where({openID: openID, answerID: answerID})
          .update({data:{voted_by_me: -1}})
    return await Promise.all([p1, p2])
  }else if(target=="vote_answer_down_cancel"){
    const {answerID} = event
    const p1 = db.collection("answers").where({_id: answerID}).update({
      data:{
        down_vote_count: _.inc(-1),
      }
    })
    const p2 = db.collection("voted_answers")
        .where({answerID: answerID, openID: openID})
        .remove()
    return await Promise.all([p1, p2])
  }else if(target === "favored_question_cancel"){
    const p1 = db.collection("questions").where({_id: questionID}).update({
      data:{
        favoredCount: _.inc(-1),
      }
    })
    const p2 = db.collection("favored_questions")
        .where({questionID, openID: openID})
        .remove()
    return await Promise.all([p1, p2])
  }else if(target === "favored_question_new"){
    const p1 = db.collection("questions").where({_id: questionID}).update({
      data:{
        favoredCount: _.inc(1)
      }
    })
    const {courseID} = event
    const p2 = db.collection("favored_questions").add({
      data:{
        openID: openID,
        questionID: questionID,
        courseID: courseID
      }
    })
    return await Promise.all([p1, p2])
  }
}