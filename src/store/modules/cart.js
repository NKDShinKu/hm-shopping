import { getCart, changeCount, delSelect } from '@/api/cart'
import { Toast } from 'vant'

export default {
  namespaced: true,
  state () {
    return {
      cartList: []
    }
  },
  mutations: {
    // 设置cartList
    setCartList (state, newList) {
      state.cartList = newList
    },
    // 单选
    toggleCheck (state, goodsId) {
      const goods = state.cartList.find(item => item.goods_id === goodsId)
      goods.isChecked = !goods.isChecked
    },
    // 全选择
    toggleAllCheck (state, flag) {
      state.cartList.forEach(item => {
        item.isChecked = flag
      })
    },

    // 改变本地商品数量
    changeCount (state, obj) {
      const good = state.cartList.find(item => item.goods_id === obj.goodsId)
      good.goods_num = obj.goodsNum
    }
  },
  actions: {
    // 异步请求cartList
    async getCartList (context, pd = true) {
      const { data } = await getCart()
      data.list.forEach(item => {
        item.isChecked = pd
      })
      context.commit('setCartList', data.list)
    },

    // 发送请求改变远程商品数量
    async changeCountAction (context, obj) {
      const { goodsNum, goodsId, goodsSkuId } = obj
      context.commit('changeCount', { goodsNum, goodsId })
      await changeCount(goodsId, goodsNum, goodsSkuId)
    },

    // 发送请求删除商品
    async delSelect (context) {
      const selCartList = context.getters.selCartList
      const cartIds = selCartList.map(item => item.id)
      await delSelect(cartIds)
      Toast('删除成功')
      context.dispatch('getCartList', false)
    }
  },
  getters: {
    // 购物车商品总数
    cartTotal (state) {
      return state.cartList.reduce((sum, item) => sum + item.goods_num, 0)
    },
    // 选中的商品数量
    selCartList (state) {
      return state.cartList.filter(item => item.isChecked)
    },
    // 选中的的商品数量
    selCount (state, getters) {
      return getters.selCartList.reduce((sum, item) => {
        return sum + item.goods_num
      }, 0)
    },
    // 选中的商品价格
    selCountPrice (state, getters) {
      return getters.selCartList.reduce((sum, item) => {
        return sum + item.goods_num * item.goods.goods_price_min
      }, 0).toFixed(2)
    },
    isAllChecked (state) {
      return state.cartList.every(item => item.isChecked)
    }
  }
}
