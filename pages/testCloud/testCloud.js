// pages/testCloud/testCloud.js
Page({
  data:{
    myarr:[{name: "one"},{name: "two"},{name: "three"},{name: "four"}]
  },
  delete(e){
    console.log(e)
    const {index} = e.currentTarget.dataset
    this.data.myarr.splice(index, 1)
    this.setData({myarr: this.data.myarr})
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