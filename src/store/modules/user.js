import { getInfo, setInfo } from '@/utils/storage.js'

export default {
  namespaced: true,
  state () {
    return {
      userInfo: getInfo()
    }
  },
  mutations: {
    // 设置user信息的方法
    setUserInfo (state, obj) {
      state.userInfo = obj
      setInfo(obj)
    }
  },
  getters: {

  },
  actions: {
    logout (context) {
      context.commit('setUserInfo', {})
      context.commit('cart/setCartList', [], { root: true })
    }
  }
}
