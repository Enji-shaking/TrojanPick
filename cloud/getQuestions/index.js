// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var db = cloud.database()
  var $ = db.command.aggregate
  const {target} = event
  
  if(target === "questionsAndAnswers"){
    const {courseID} = event
    return db.collection('questions').aggregate().sort({
      up_vote_count: -1
    }).match({
        courseID: courseID
    }).lookup({
      from: 'answers',
      localField: '_id',
      foreignField: 'questionID',
      as: 'answers',
    }).end()
  }
  else if(target === "answers"){
    const {questionID} = event
    return await db.collection('questions').aggregate().sort({
      up_vote_count: -1
    }).match({
      _id: questionID
    }).lookup({
      from: 'answers',
      localField: '_id',
      foreignField: 'questionID',
      as: 'answers',
    }).end()
  }
}