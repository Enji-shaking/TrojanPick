// pages/testCloud/testCloud.js
Page({
  addData(){

  },
  addTapped(){
    wx.cloud.callFunction({
      name: "add",
      data: {
        a: 1,
        b: 2,
      },
      success: function(res) {
        console.log(res.result.sum) // 3
      },
      fail: console.error
    })
  },
  getopenid(){
    wx.cloud.callFunction({
      name: "getopenId",
      success(res){console.log(res)},
      fail(err){console.error(err)}
    })
  }
})