// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "test-0gbtzjgqaae3f2b2"
})
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  let { target, reviewID, openID, questionID, answerID, commentID } = event
  if(!openID){
    const wxContext = cloud.getWXContext()
    openID = wxContext.OPENID
  }
  if (target === "deleteReview") {
    // get delete_review's ratings
    let delete_review = await db.collection('reviews')
    .aggregate()
    .match({
      _id: reviewID
    })
    .lookup({
      from: "courses",
      localField: "courseID",
      foreignField: "_id",
      as: "courseInfo"
    })
    .lookup({
      from: "professors",
      localField: "professorID",
      foreignField: "_id",
      as: "professorInfo"
    })
    .end()
    console.log(delete_review);
    // return
    let courseID = delete_review.list[0].courseID;
    let professorID = delete_review.list[0].professorID;
    let workloadRating = delete_review.list[0].workloadRating;
    let difficultyRating = delete_review.list[0].difficultyRating;
    let entertainmentRating = delete_review.list[0].entertainmentRating;
    let enrichmentRating = delete_review.list[0].enrichmentRating;
    let overallRating = delete_review.list[0].overallRating;
    let courseCode = delete_review.list[0].courseInfo[0].courseCode;
    let professorName = delete_review.list[0].professorInfo[0].professorName;
    let postedTime = delete_review.list[0].postedTime;
    db.collection("reviews").where({
      openID: openID,
      _id: reviewID
    }).remove()
    db.collection("saved_reviews").where({
      openID: openID,
      reviewID: reviewID
    }).remove()
    console.log(openID)
    console.log(courseCode)
    console.log(professorName)
    db.collection("saved_reviews").where({
      reviewID: reviewID
    }).update({
      data: {
        deleted: true,
        courseCode: courseCode,
        professorName: professorName,
        ownerOpenID: openID,
        postedTime:postedTime
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
    if (!numReviews_orig) numReviews_orig = 0
    let workloadRating_orig = course_prof_data.data[0].workloadRating;
    let difficultyRating_orig = course_prof_data.data[0].difficultyRating;
    let entertainmentRating_orig = course_prof_data.data[0].entertainmentRating;
    let enrichmentRating_orig = course_prof_data.data[0].enrichmentRating;
    let overallRating_orig = course_prof_data.data[0].overallRating;

    if (numReviews_orig <= 1) {
      db.collection('course_professor')
        // .doc(course_prof_data.data[0]._id)
        .where({
          courseID: courseID,
          professorID: professorID
        })
        .update({
          data: {
            workloadRating: 0,
            entertainmentRating: 0,
            enrichmentRating: 0,
            overallRating: 0,
            difficultyRating: 0,
            numReviews: 0
          }
        })
    } else {
      db.collection('course_professor')
        // .doc(course_prof_data.data[0]._id)
        .where({
          courseID: courseID,
          professorID: professorID
        })
        .update({
          data: {
            workloadRating: (workloadRating_orig * numReviews_orig - workloadRating) / (numReviews_orig - 1),
            entertainmentRating: (entertainmentRating_orig * numReviews_orig - entertainmentRating) / (numReviews_orig - 1),
            enrichmentRating: (enrichmentRating_orig * numReviews_orig - enrichmentRating) / (numReviews_orig - 1),
            overallRating: (overallRating_orig * numReviews_orig - overallRating) / (numReviews_orig - 1),
            difficultyRating: (difficultyRating_orig * numReviews_orig - difficultyRating) / (numReviews_orig - 1),
            numReviews: numReviews_orig - 1
          },
          success(res) {
            console.log(res.data)
          },
          fail(res){
            // call again
            db.collection('course_professor')
            .where({
              courseID: courseID,
              professorID: professorID
            })
            .update({
              data: {
                workloadRating: (workloadRating_orig * numReviews_orig - workloadRating) / (numReviews_orig - 1),
                entertainmentRating: (entertainmentRating_orig * numReviews_orig - entertainmentRating) / (numReviews_orig - 1),
                enrichmentRating: (enrichmentRating_orig * numReviews_orig - enrichmentRating) / (numReviews_orig - 1),
                overallRating: (overallRating_orig * numReviews_orig - overallRating) / (numReviews_orig - 1),
                difficultyRating: (difficultyRating_orig * numReviews_orig - difficultyRating) / (numReviews_orig - 1),
                numReviews: numReviews_orig - 1
              }
            })
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
    entertainmentRating_orig = course_data.data[0].entertainmentRating;
    enrichmentRating_orig = course_data.data[0].enrichmentRating;
    overallRating_orig = course_data.data[0].overallRating;
    if (numReviews_orig <= 1) {
      db.collection('courses')
        // .doc(courseID)
        .where({
          _id: courseID
        })
        .update({
          data: {
            workloadRating: 0,
            entertainmentRating: 0,
            enrichmentRating: 0,
            overallRating: 0,
            difficultyRating: 0,
            numReviews: 0
          }
        })
    } else {
      db.collection('courses')
        // .doc(courseID)
        .where({
          _id: courseID
        })
        .update({
          data: {
            workloadRating: (workloadRating_orig * numReviews_orig - workloadRating) / (numReviews_orig - 1),
            entertainmentRating: (entertainmentRating_orig * numReviews_orig - entertainmentRating) / (numReviews_orig - 1),
            enrichmentRating: (enrichmentRating_orig * numReviews_orig - enrichmentRating) / (numReviews_orig - 1),
            overallRating: (overallRating_orig * numReviews_orig - overallRating) / (numReviews_orig - 1),
            difficultyRating: (difficultyRating_orig * numReviews_orig - difficultyRating) / (numReviews_orig - 1),
            numReviews: numReviews_orig - 1
          },
          success(res){
          },
          fail(res){
            db.collection('courses')
            // .doc(courseID)
            .where({
              _id: courseID
            })
            .update({
              data: {
                workloadRating: (workloadRating_orig * numReviews_orig - workloadRating) / (numReviews_orig - 1),
                entertainmentRating: (entertainmentRating_orig * numReviews_orig - entertainmentRating) / (numReviews_orig - 1),
                enrichmentRating: (enrichmentRating_orig * numReviews_orig - enrichmentRating) / (numReviews_orig - 1),
                overallRating: (overallRating_orig * numReviews_orig - overallRating) / (numReviews_orig - 1),
                difficultyRating: (difficultyRating_orig * numReviews_orig - difficultyRating) / (numReviews_orig - 1),
                numReviews: numReviews_orig - 1
              }
            })
          }
        })
    }

    // update averages in 'professors'
    let prof_data = await db.collection('professors').where({
      _id: professorID
    }).get();
    numReviews_orig = prof_data.data[0].numReviews;
    if (!numReviews_orig) numReviews_orig = 1
    workloadRating_orig = prof_data.data[0].workloadRating;
    difficultyRating_orig = prof_data.data[0].difficultyRating;
    entertainmentRating_orig = prof_data.data[0].entertainmentRating;
    enrichmentRating_orig = prof_data.data[0].enrichmentRating;
    overallRating_orig = course_data.data[0].overallRating;

    if (numReviews_orig <= 1) {
      db.collection('professors')
        .doc(professorID)
        .update({
          data: {
            workloadRating: 0,
            entertainmentRating: 0,
            enrichmentRating: 0,
            overallRating: 0,
            difficultyRating: 0,
            numReviews: 0
          }
        })
    } else {
      db.collection('professors')
        // .doc(professorID)
        .where({
          _id: professorID
        })
        .update({
          data: {
            workloadRating: (workloadRating_orig * numReviews_orig - workloadRating) / (numReviews_orig - 1),
            entertainmentRating: (entertainmentRating_orig * numReviews_orig - entertainmentRating) / (numReviews_orig - 1),
            enrichmentRating: (enrichmentRating_orig * numReviews_orig - enrichmentRating) / (numReviews_orig - 1),
            overallRating: (overallRating_orig * numReviews_orig - overallRating) / (numReviews_orig - 1),
            difficultyRating: (difficultyRating_orig * numReviews_orig - difficultyRating) / (numReviews_orig - 1),
            numReviews: numReviews_orig - 1
          },
          success(res){
          },
          fail(res){
            db.collection('professors')
            // .doc(professorID)
            .where({
              _id: professorID
            })
            .update({
              data: {
                workloadRating: (workloadRating_orig * numReviews_orig - workloadRating) / (numReviews_orig - 1),
                entertainmentRating: (entertainmentRating_orig * numReviews_orig - entertainmentRating) / (numReviews_orig - 1),
                enrichmentRating: (enrichmentRating_orig * numReviews_orig - enrichmentRating) / (numReviews_orig - 1),
                overallRating: (overallRating_orig * numReviews_orig - overallRating) / (numReviews_orig - 1),
                difficultyRating: (difficultyRating_orig * numReviews_orig - difficultyRating) / (numReviews_orig - 1),
                numReviews: numReviews_orig - 1
              }
            })
          }
        })
    }
    //if there is no review between the professor and the course, remove it in the course_professor
    delete_review = await db.collection('reviews').where({
      professorID: professorID,
      courseID: courseID
    }).get();
    if (delete_review.data.length == 0) {//now there is no relationship between the professor and teacher
      //remove the field in the course_professor
      db.collection('course_professor').where({
        professorID: professorID,
        courseID: courseID
      }).remove();
    }
  } else if (target === "deleteQuestion") {
    db.collection("questions").where({
      openID: openID,
      _id: questionID
    }).remove()
    db.collection("answers").where({
      questionID: questionID
    }).remove()
    db.collection("favored_questions").where({
      questionID: questionID
    }).remove()
    // db.collection("saved_questions").where({
    //   openID: openID,
    //   questionID: questionID
    // }).update({
    //   data:{
    //     deleted: true
    //   }
    // })
  } else if (target === "deleteAnswer") {
    db.collection("answers").where({
      _id: answerID,
      openID: openID
    }).remove()
    db.collection("voted_answers").where({
      answerID: answerID
    }).remove()
  } else if (target === "deleteComment") {
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
      data: {
        commentCount: _.inc(-1)
      }
    })
  }
}