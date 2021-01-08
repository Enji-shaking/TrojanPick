// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
const db = cloud.database()

exports.main = async (event, context) => {
  const _ = db.command

  // course_professor里面用courseID和professorID进行查找
  let course_professor_Rating = await db.collection('course_professor').where({
    courseID: event.courseID,
    professorID: event.professorID
  }).get()
  // 如果data返回为undefined：创建一条新的course_professor数据
  if(course_professor_Rating.data[0] === undefined){
    db.collection('course_professor').add({
      data: {
        courseID: event.courseID,
        professorID: event.professorID,
        difficultyRating: event.difficultyRating,
        interestingRating: event.interestingRating,
        workloadRating: event.workloadRating,
        teachingRating: event.teachingRating,
        numReviews: 1
      }
    })
  }
  // 如果data返回值，update它的avg
  else{
    let numReviews = course_professor_Rating.data[0].numReviews;
    let workloadRating =course_professor_Rating.data[0].workloadRating;
    let difficultyRating = course_professor_Rating.data[0].difficultyRating;
    let interestingRating = course_professor_Rating.data[0].interestingRating;
    let teachingRating = course_professor_Rating.data[0].teachingRating;
    db.collection('course_professor').doc(course_professor_Rating.data[0]._id).update({
      data: {
        workloadRating: (event.workloadRating + workloadRating * numReviews) / (numReviews + 1),
        interestingRating: (event.interestingRating + interestingRating * numReviews) / (numReviews + 1),
        teachingRating: (event.teachingRating + teachingRating * numReviews) / (numReviews + 1),
        difficultyRating: (event.difficultyRating + difficultyRating * numReviews) / (numReviews + 1),
        numReviews: _.inc(1)
      },
      success(res) {
        console.log(res.data)
      },
      fail(res){
        console.log(res)
      }
    })
  }

  // 改course里面的avg
  let courseRatings = await db.collection('courses').where({
    _id: event.courseID
  }).get();
  let numReviews = courseRatings.data[0].numReviews;
  let workloadRating = courseRatings.data[0].workloadRating;
  let difficultyRating = courseRatings.data[0].difficultyRating;
  let interestingRating = courseRatings.data[0].interestingRating;
  let teachingRating = courseRatings.data[0].teachingRating;

  db.collection('courses').doc(event.courseID).update({
    data: {
     workloadRating: (workloadRating * numReviews + event.workloadRating) / (numReviews + 1),
     interestingRating: (interestingRating * numReviews + event.interestingRating) / (numReviews + 1),
     teachingRating: (teachingRating * numReviews + event.teachingRating) / (numReviews + 1),
     difficultyRating: (difficultyRating * numReviews + event.difficultyRating) / (numReviews + 1),
     numReviews: _.inc(1),
    },
    success(res) {
      console.log(res.data)
    },
    fail(res){
      console.log(res)
    }
  })

  // 改professor里面的avg
  let professorRatings = await db.collection('professors').where({
    _id: event.professorID
  }).get();
  numReviews = professorRatings.data[0].numReviews;
  workloadRating = professorRatings.data[0].workloadRating;
  difficultyRating = professorRatings.data[0].difficultyRating;
  interestingRating = professorRatings.data[0].interestingRating;
  teachingRating = professorRatings.data[0].teachingRating;

  db.collection('professors').doc(event.professorID).update({
    data: {
      workloadRating: (workloadRating * numReviews + event.workloadRating) / (numReviews + 1),
      interestingRating: (interestingRating * numReviews + event.interestingRating) / (numReviews + 1),
      teachingRating: (teachingRating * numReviews + event.teachingRating) / (numReviews + 1),
      difficultyRating: (difficultyRating * numReviews + event.difficultyRating) / (numReviews + 1),
      numReviews: _.inc(1),
    },
    success(res) {
      console.log(res.data)
    },
    fail(res){
      console.log(res)
    }
  })

  // 添加review
  const wxContext = cloud.getWXContext()
  const {OPENID} = wxContext
  
  return await db.collection('reviews').add({
    data:{ 
        courseID: event.courseID,
        professorID: event.professorID,
        difficultyRating: event.difficultyRating,
        interestingRating: event.interestingRating,
        workloadRating: event.workloadRating,
        teachingRating: event.teachingRating,
        grade: event.grade,
        anonymous: event.anonymous,
        content: event.content,
        commentCount: event.commentCount,
        up_vote_count: event.up_vote_count,
        down_vote_count: event.down_vote_count,
        favoriteCount: event.favoriteCount,
        openid: OPENID
    }
  })
}