// components/Pagination/Pagination.js
let app=getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pages:{
      type: "int",
      value: 1
    },
    activePage:{
      type: "int",
      value: 1
    },
    isHot:{
      type:"Boolean",
      value:true
    },
    showHot:{
      type:"Boolean",
      value:true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isChinese: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    buttonTapped(e){
      // console.log(e);
      console.log(e.currentTarget.dataset.page);
      this.triggerEvent("onClickItem", e.currentTarget.dataset.page)
    }
  },
  attached:function(){
    console.log(this.properties.activePage);
  },
  ready: function(){
    this.setData({
      isChinese: app.globalData.isChinese
    })
  }
})
