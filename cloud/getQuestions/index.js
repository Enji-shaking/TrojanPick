// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var db = cloud.database()
  var $ = db.command.aggregate
  const {target, openID} = event
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
      //only need to grab the first answer
      as: 'answers',
    }).end()
  }
  else if(target === "answers"){
    const {questionID} = event
    const data = await db.collection('questions').aggregate().sort({
      up_vote_count: -1
    }).match({
      _id: questionID
    }).lookup({
      from: 'answers',
      localField: '_id',
      foreignField: 'questionID',
      as: 'answers',
    }).end()
    
    let my_voted_answers_raw = await db.collection("voted_answers").where({ 
      openID: openID,
      questionID: questionID 
    }).get()

    let my_voted_answers = {}
    for (let i = 0; i < my_voted_answers_raw.data.length; i++) {
      my_voted_answers[my_voted_answers_raw.data[i].answerID] = my_voted_answers_raw.data[i].voted_by_me
    }
    console.log(data);
    data.list[0].answers.forEach(item=>{
      if(item.openID === openID){
        item.posted_by_me = true
      }else{
        item.posted_by_me = false
      }
      if(item._id in my_voted_answers){
        item.voted_by_me = my_voted_answers[item._id]
      }else{
        item.voted_by_me = 0
      }
    })

    return data.list

  }
  else if(target === "answer_votes"){
    // check votes for answers for a specific question ID
    const {questionID, openID} = event
   
  }
  else if(target === "question_favored"){
    const {courseID, openID} = event
   let my_favored_questions_raw = await db.collection("favored_questions").where({ 
      openID: openID,
      courseID: courseID 
    }).get()
    let my_favored_questions = []
    for (let i = 0; i < my_favored_questions_raw.data.length; i++) {
      my_favored_questions.push(my_favored_questions_raw.data[i].questionID)
    }
    return my_favored_questions
  }else if(target === "top_questions"){
    const {courseID} = event
    return await db.collection("questions").where({
      courseID: courseID
    }).orderBy("favoredCount", "desc")
    .orderBy("postedTime", "desc").get()
  }
}