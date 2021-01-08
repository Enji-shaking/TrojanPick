// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const {target, openID} = event
  if(target === "checkUserInfo"){
    return await db.collection("users")
    .where({openID: openID})
    .get()
  }else if(target==="openID"){
    const wxContext = cloud.getWXContext()
    console.log(wxContext);
    return wxContext.OPENID
  }else if(target === "addNewUser"){
    const {avatarUrl, userName} = event
    db.collection("users").add({
      data:{
        avatarUrl: avatarUrl,
        openID: openID,
        userName: userName,
        myAnswerIDs: [],
        myCommentIDs: [],
        myQuestionIDs: [],
        myReviewIDs: []
      }
    })
  }else if(target === "updateUser"){
    const {avatarUrl, userName} = event
    db.collection("users").where({openID: openID}).update({
      data:{
        avatarUrl: avatarUrl,
        userName: userName
      }
    })
  }
  // console.log(tryAdding);
  
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}