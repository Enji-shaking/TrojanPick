// components/Pagination/Pagination.js
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
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

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
  }
})
