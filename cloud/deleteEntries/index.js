// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const {target, reviewID, openID, questionID, answerID, commentID} = event
  if(target === "deleteReview"){
    // get delete_review's ratings
    let delete_review = await db.collection('reviews').where({
      _id: reviewID
    }).get()
    console.log(delete_review);
    let courseID = delete_review.data[0].courseID;
    let professorID = delete_review.data[0].professorID;
    let workloadRating = delete_review.data[0].workloadRating;
    let difficultyRating = delete_review.data[0].difficultyRating;
    let interestingRating = delete_review.data[0].interestingRating;
    let teachingRating = delete_review.data[0].teachingRating;

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
    db.collection("comments").where({
      reviewID: reviewID
    }).remove()

    console.log("I'm here");
    // update averages
    // update averages in 'course_professor'
    let course_prof_data = await db.collection('course_professor').where({
      courseID: courseID,
      professorID: professorID
    }).get()
    console.log(course_prof_data);
    let numReviews_orig = course_prof_data.data[0].numReviews;
    if(!numReviews_orig) numReviews_orig = 0
    let workloadRating_orig = course_prof_data.data[0].workloadRating;
    let difficultyRating_orig = course_prof_data.data[0].difficultyRating;
    let interestingRating_orig = course_prof_data.data[0].interestingRating;
    let teachingRating_orig = course_prof_data.data[0].teachingRating;

    if(numReviews_orig === 1){
      db.collection('course_professor')
      // .doc(course_prof_data.data[0]._id)
      .where({
        courseID: courseID,
        professorID: professorID
      })
      .update({
        data: {
          workloadRating: 0,
          interestingRating: 0,
          teachingRating: 0,
          difficultyRating: 0,
          numReviews: 0
          
        }
      })
    }else{
      db.collection('course_professor')
        // .doc(course_prof_data.data[0]._id)
        .where({
          courseID: courseID,
          professorID: professorID
        })
        .update({
          data: {
            workloadRating: (workloadRating_orig * numReviews_orig - workloadRating) / (numReviews_orig - 1),
            interestingRating: (interestingRating_orig * numReviews_orig - interestingRating) / (numReviews_orig - 1),
            teachingRating: (teachingRating_orig * numReviews_orig - teachingRating) / (numReviews_orig - 1),
            difficultyRating: (difficultyRating_orig * numReviews_orig - difficultyRating) / (numReviews_orig - 1),
            numReviews: numReviews_orig - 1
            
          }
        })
    }
    // update averages in 'courses'
    let course_data = await db.collection('courses').where({
      _id: courseID
    }).get();
    console.log(course_data);
    numReviews_orig = course_data.data[0].numReviews;
    // if(!numReviews_orig) numReviews_orig = 0
    workloadRating_orig = course_data.data[0].workloadRating;
    difficultyRating_orig = course_data.data[0].difficultyRating;
    interestingRating_orig = course_data.data[0].interestingRating;
    teachingRating_orig = course_data.data[0].teachingRating;
    if(numReviews_orig === 1){
      db.collection('courses')
      // .doc(courseID)
      .where({
        _id: courseID
      })
      .update({
        data: {
          workloadRating: 0,
          interestingRating: 0,
          teachingRating: 0,
          difficultyRating: 0,
          numReviews: 0
        }
      })
    }else{
      db.collection('courses')
        // .doc(courseID)
        .where({
          _id: courseID
        })
        .update({
          data: {
            workloadRating: (workloadRating_orig * numReviews_orig - workloadRating) / (numReviews_orig - 1),
            interestingRating: (interestingRating_orig * numReviews_orig - interestingRating) / (numReviews_orig - 1),
            teachingRating: (teachingRating_orig * numReviews_orig - teachingRating) / (numReviews_orig - 1),
            difficultyRating: (difficultyRating_orig * numReviews_orig - difficultyRating) / (numReviews_orig - 1),
            numReviews: numReviews_orig - 1
          }
        })
    }
  
    // update averages in 'professors'
    let prof_data = await db.collection('professors').where({
      _id: professorID
    }).get();
    numReviews_orig = prof_data.data[0].numReviews;
    if(!numReviews_orig) numReviews_orig = 1
    workloadRating_orig = prof_data.data[0].workloadRating;
    difficultyRating_orig = prof_data.data[0].difficultyRating;
    interestingRating_orig = prof_data.data[0].interestingRating;
    teachingRating_orig = prof_data.data[0].teachingRating;
    
    if(numReviews_orig === 1){
      db.collection('professors')
      .doc(professorID)
      .update({
        data: {
          workloadRating: 0,
          interestingRating: 0,
          teachingRating: 0,
          difficultyRating: 0,
          numReviews: 0
        }
      })
    }else{
      db.collection('professors')
        // .doc(professorID)
        .where({
          _id: professorID
        })
        .update({
          data: {
            workloadRating: (workloadRating_orig * numReviews_orig - workloadRating) / (numReviews_orig - 1),
            interestingRating: (interestingRating_orig * numReviews_orig - interestingRating) / (numReviews_orig - 1),
            teachingRating: (teachingRating_orig * numReviews_orig - teachingRating) / (numReviews_orig - 1),
            difficultyRating: (difficultyRating_orig * numReviews_orig - difficultyRating) / (numReviews_orig - 1),
            numReviews: numReviews_orig - 1
          }
        })
    }

  }else if(target === "deteleQuestion"){
    db.collection("questions").where({
      openID: openID,
      _id: questionID
    }).remove()
    db.collection("answers").where({
      questionID: questionID
    }).remove()
    db.collection("saved_questions").where({
      openID: openID,
      questionID: questionID
    }).update({
      data:{
        deleted: true
      }
    })
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
    db.collection("reviews").where({
      _id: reviewID
    }).update({
      data:{
        commentCount: _.inc(-1)
      }
    })
  }
}