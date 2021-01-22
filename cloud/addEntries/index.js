// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: "test-0gbtzjgqaae3f2b2"
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const {target, openID} = event
  let currentTime = getCurrentTime()
  if(target === "makeComment"){
    const { content, reviewID } = event
    console.log(event)
    const p1 = db.collection("reviews").where({_id: reviewID}).update({
      data:{
        commentCount: _.inc(1)
      }
    })
    const p2 = db.collection("comments").add({
      data:{
        down_vote_count: 0,
        up_vote_count: 0,
        reviewID: reviewID,
        content: content,
        postedTime: currentTime,
        openID: openID,
      }
    })
    return await p2
  }else if(target === "createReview"){
    const { professorID, content, courseID, anonymous, forProf } = event
    console.log(event);
    // return
    //check for limit, no more than 2 reviews for the save course
    //no more than 4 reviews for the same professor
    //no more than 50 reviews for a student
    const pastRatingCourse =( await db.collection("reviews")
            .where({openID: openID, courseID: courseID})
            .count()).total
    if(pastRatingCourse > 1){
      return {success: false, content: `2/2 limt reached for this course`}
    }

    const pastRatingProfessor =( await db.collection("reviews")
            .where({openID: openID, professorID: professorID})
            .count()).total
    if(pastRatingProfessor > 3){
      return {success: false, content: `4/4 limt reached for this professor`}
    }

    const pastRating =( await db.collection("reviews")
            .where({openID: openID})
            .count()).total
    if(pastRating > 49){
      return {success: false, content: `50/50 limit reached for all reviews`}
    }

    console.log(event)
    let numReviews
    let workloadRating
    let difficultyRating
    let entertainmentRating
    let enrichmentRating
    // course_professor里面用courseID和professorID进行查找
    let course_professor_Rating = await db.collection('course_professor').where({
      courseID: courseID,
      professorID: professorID
    }).get()
    console.log(course_professor_Rating)
    // 如果data返回为undefined：创建一条新的course_professor数据
    if(course_professor_Rating.data[0] === undefined){
      db.collection('course_professor').add({
        data: {
          courseID: courseID,
          professorID: professorID,
          difficultyRating: event.difficultyRating,
          entertainmentRating: event.entertainmentRating,
          workloadRating: event.workloadRating,
          enrichmentRating: event.enrichmentRating,
          numReviews: 1
        }
      })
    }
    // 如果data返回值，update它的avg
    else{
      numReviews = course_professor_Rating.data[0].numReviews
      workloadRating =course_professor_Rating.data[0].workloadRating
      difficultyRating = course_professor_Rating.data[0].difficultyRating
      entertainmentRating = course_professor_Rating.data[0].entertainmentRating
      enrichmentRating = course_professor_Rating.data[0].enrichmentRating
      db.collection('course_professor').doc(course_professor_Rating.data[0]._id).update({
        data: {
          workloadRating: (event.workloadRating + workloadRating * numReviews) / (numReviews + 1),
          entertainmentRating: (event.entertainmentRating + entertainmentRating * numReviews) / (numReviews + 1),
          enrichmentRating: (event.enrichmentRating + enrichmentRating * numReviews) / (numReviews + 1),
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
      _id: courseID
    }).get()
    numReviews = courseRatings.data[0].numReviews
    if(!numReviews) {
      numReviews = 0
      workloadRating = 0
      difficultyRating = 0
      entertainmentRating = 0
      enrichmentRating = 0
    }else{
      workloadRating = courseRatings.data[0].workloadRating
      difficultyRating = courseRatings.data[0].difficultyRating
      entertainmentRating = courseRatings.data[0].entertainmentRating
      enrichmentRating = courseRatings.data[0].enrichmentRating
    }
    console.log(courseRatings)
    db.collection('courses').doc(courseID).update({
      data: {
        workloadRating: (workloadRating * numReviews + event.workloadRating) / (numReviews + 1),
        entertainmentRating: (entertainmentRating * numReviews + event.entertainmentRating) / (numReviews + 1),
        enrichmentRating: (enrichmentRating * numReviews + event.enrichmentRating) / (numReviews + 1),
        difficultyRating: (difficultyRating * numReviews + event.difficultyRating) / (numReviews + 1),
        numReviews: numReviews+1,
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
      _id: professorID
    }).get()
    numReviews = professorRatings.data[0].numReviews
    if(!numReviews) {
      numReviews = 0
      workloadRating = 0
      difficultyRating = 0
      entertainmentRating = 0
      enrichmentRating = 0
    }else{
      workloadRating = courseRatings.data[0].workloadRating
      difficultyRating = courseRatings.data[0].difficultyRating
      entertainmentRating = courseRatings.data[0].entertainmentRating
      enrichmentRating = courseRatings.data[0].enrichmentRating
    }

    db.collection('professors').doc(professorID).update({
      data: {
        workloadRating: (workloadRating * numReviews + event.workloadRating) / (numReviews + 1),
        entertainmentRating: (entertainmentRating * numReviews + event.entertainmentRating) / (numReviews + 1),
        enrichmentRating: (enrichmentRating * numReviews + event.enrichmentRating) / (numReviews + 1),
        difficultyRating: (difficultyRating * numReviews + event.difficultyRating) / (numReviews + 1),
        numReviews: numReviews+1,
      },
      success(res) {
        console.log(res.data)
      },
      fail(res){
        console.log(res)
      }
    })

    // 添加review
    const anonymousAvatarUrl = "/icon/avatar/"+Math.floor(Math.random() * 9)+".svg"
    const anonymousNickNameOptions = ["alligator", "anteater", "armadillo", "auroch", "axolotl", "badger", "bat", "bear", "beaver", "blobfish", "buffalo", "camel", "chameleon", "cheetah", "chipmunk", "chinchilla", "chupacabra", "cormorant", "coyote", "crow", "dingo", "dinosaur", "dog", "dolphin", "dragon", "duck", "dumbo octopus", "elephant", "ferret", "fox", "frog", "giraffe", "goose", "gopher", "grizzly", "hamster", "hedgehog", "hippo", "hyena", "jackal", "jackalope", "ibex", "ifrit", "iguana", "kangaroo", "kiwi", "koala", "kraken", "lemur", "leopard", "liger", "lion", "llama", "manatee", "mink", "monkey", "moose", "narwhal", "nyan cat", "orangutan", "otter", "panda", "penguin", "platypus", "python", "pumpkin", "quagga", "quokka", "rabbit", "raccoon", "rhino", "sheep", "shrew", "skunk", "slow loris", "squirrel", "tiger", "turtle", "unicorn", "walrus", "wolf", "wolverine", "wombat"]
    // https://evert.meulie.net/faqwd/complete-list-anonymous-animals-on-google-drive-docs-sheets-slides/
    const anonymousNickName = anonymousNickNameOptions[Math.floor(Math.random()*anonymousNickNameOptions.length)]
    return await db.collection('reviews').add({
      data:{ 
          courseID: courseID,
          professorID: professorID,
          difficultyRating: event.difficultyRating,
          entertainmentRating: event.entertainmentRating,
          workloadRating: event.workloadRating,
          enrichmentRating: event.enrichmentRating,
          grade: event.grade,
          anonymous: anonymous,
          anonymousAvatarUrl: anonymous?anonymousAvatarUrl:"N/A",
          anonymousNickName:anonymous?anonymousNickName:"N/A",
          content: content,
          commentCount: 0,
          up_vote_count: 0,
          down_vote_count: 0,
          favoriteCount: 0,
          openID: openID,
          postedTime: currentTime,
          forProf: forProf
      }
    })
  }else if(target === "createQuestion"){
    const { content, courseID } = event
    const pastQuestions =( await db.collection("questions")
            .where({openID: openID, courseID: courseID})
            .count()).total
    if(pastQuestions > 2){
      return {success: false}
    }
    db.collection('questions').add({
      data:{ 
        courseID: courseID,
        content: content,
        openID: openID,
        postedTime: currentTime,
        favoredCount: 0
      }
    })
    return {success: true}
  }else if(target === "createAnswer"){
    const {content, questionID} = event
    return await db.collection('answers').add({
      data:{ 
        questionID: questionID,
        postedTime: currentTime,
        content: content,
        openID: openID,
        up_vote_count: 0,
        down_vote_count: 0
      }
    })
  }
}

function getCurrentTime(){
  const date = new Date()
  const year = date.getFullYear()
  let month = date.getMonth()+1
  if(month < 10) month = "0"+month
  let day = date.getDate()
  if(day < 10) day = "0"+day
  return (`${year}-${month}-${day}`)
}