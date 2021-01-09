// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  let {target, openID} = event
  if(target === "checkUserInfo"){
    return await db.collection("users")
    .where({openID: openID})
    .get()
  }else if(target==="openID"){
    const wxContext = cloud.getWXContext()
    console.log(wxContext);
    return wxContext.OPENID
  }else if(target === "tryToAddNewUser"){
    const {avatarUrl, nickName} = event
    const wxContext = cloud.getWXContext()
    openID = wxContext.OPENID
    db.collection("users").add({
      data:{
        // avatarUrl: avatarUrl,
        openID: openID,
        // nickName: nickName,
        myAnswerIDs: [],
        myCommentIDs: [],
        myQuestionIDs: [],
        myReviewIDs: []
      }
    })
    .catch(error=>{
      console.log(error)
    })
    return openID
  }else if(target === "updateUser"){
    const {avatarUrl, nickName} = event
    db.collection("users").where({openID: openID}).update({
      data:{
        avatarUrl: avatarUrl,
        nickName: nickName
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