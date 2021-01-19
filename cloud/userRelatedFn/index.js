// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "test-0gbtzjgqaae3f2b2"
})
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
  }else if(target === "updateUser"){
    const {avatarUrl, nickName} = event
    db.collection("users")
    .where({openID: openID})
    .update({
      data:{
        avatarUrl: avatarUrl,
        nickName: nickName
      }
    })
  }else if(target === "login"){
    const wxContext = cloud.getWXContext()
    const {avatarUrl, nickName} = event
    openID = wxContext.OPENID
    try {
      await db.collection("users").add({
        data:{  
          openID: openID,
        }
      })
    } catch (error) {}
    //same as update user
    db.collection("users")
    .where({openID: openID})
    .update({
      data:{
        avatarUrl: avatarUrl,
        nickName: nickName
      }
    })
    return openID
  }
  // console.log(tryAdding);
  
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}