// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "test-0gbtzjgqaae3f2b2"
})

// 云函数入口函数
exports.main = async (event, context) => {
  var db = cloud.database()
  var $ = db.command.aggregate
  const _ = db.command
  let {target, openID, courseID} = event
  if(!openID){
    const wxContext = cloud.getWXContext()
    openID = wxContext.OPENID
  }
  if(target === "questionsAndAnswers"){
    const my_favored_questions_raw = await db.collection("favored_questions").where({ 
      openID: openID,
      courseID: courseID 
    })
    .get()
    const my_favored_questions = new Set()
    for (let i = 0; i < my_favored_questions_raw.data.length; i++) {
      my_favored_questions.add(my_favored_questions_raw.data[i].questionID)
    }
    console.log(my_favored_questions);
    const data = await db.collection('questions')
    .aggregate()
    .sort({
      favoredCount: -1,
      postedTime: -1
    })
    .match({
        courseID: courseID
    })
    .lookup({
      from: 'answers',
      let: {
          questionID: '$_id'
      },
      pipeline: $.pipeline()
        .match(
          _.expr($.eq(['$questionID', '$$questionID']))
        )
        .sort({up_vote_count: -1})
        .limit(1)
        .done()
      ,
      as: 'answers',
    })
    .end()

    console.log(openID);
    data.list.forEach(item=>{
      if(my_favored_questions.has(item._id )){
        item.favored_by_me = true
      }else{
        item.favored_by_me = false
      }
      if(item.openID === openID){
        item.posted_by_me = true
      }else{
        item.posted_by_me = false
      }
    })
    console.log(data);
    return data
  }
  else if(target === "answersForAQuestion"){
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
    
    const my_voted_answers_raw = await db.collection("voted_answers").where({ 
      openID: openID,
      questionID: questionID 
    }).get()

    const my_voted_answers = {}
    for (let i = 0; i < my_voted_answers_raw.data.length; i++) {
      my_voted_answers[my_voted_answers_raw.data[i].answerID] = my_voted_answers_raw.data[i].voted_by_me
    }
    
    // const my_favored_questions = new Set()
    let checkIfFavored = await db.collection("favored_questions").where({ 
      openID: openID,
      questionID: questionID
    }).get()
    console.log(data);
    console.log(checkIfFavored);
    if(checkIfFavored.data.length > 0){
      data.list[0].favored_by_me = true
    }else{
      data.list[0].favored_by_me = false
    }
    data.list[0].posted_by_me = data.list[0].openID === openID
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

  }else if(target === "top_questions"){
    const questionLimit = 3
    return await db.collection("questions")
      .aggregate()
      .match({
        courseID: courseID
      })
      .sort({
        favoredCount: -1,
        postedTime: -1
      })
      .limit(questionLimit)
      .lookup({
        from: 'answers',
        let: {
            questionID: '$_id'
        },
        pipeline: $.pipeline()
          .match(
            _.expr($.eq(['$questionID', '$$questionID']))
          )
          .sort({up_vote_count: -1})
          .limit(1)
          .done()
        ,
        as: 'answers',
      }).end()
  }
}