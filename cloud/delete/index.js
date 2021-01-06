// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const {reviewID, openID, questionID, answerID, commentID} = event
  if(target === "deleteReview"){
    db.collection("reviews").where({
      openID: openID,
      _id: reviewID
    }).remove()
    db.collection("saved_reviews").where({
      openID: openID,
      reviewID: reviewID
    }).update({
      data:{
        deleted: true
      }
    })
    //update ratings
    //db.collection .......
  }else if(target === "deteleQuestion"){
    db.collection("questions").where({
      openID: openID,
      _id: questionID
    }).remove()
    db.collection("answers").where({
      questionID: questionID
    }).remove()
    //update saved_questions
  }else if(target === "deteleAnswer"){
    db.collection("answers").where({
      answerID: answerID
    }).remove()
    db.collection("voted_answers").where({
      answerID: answerID
    }).remove()
  }else if(target === "deleteComment"){
    db.collection("comments").where({
      _id: commentID,
      openID: openID
    }).remove()
    db.collection("voted_comments").where({
      commentID: commentID
    }).remove()
  }
}