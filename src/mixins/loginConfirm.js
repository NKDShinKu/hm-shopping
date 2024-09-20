import { Dialog } from 'vant'

export default {
  methods: {
    loginConfirm () {
      if (!this.$store.getters.token) {
        Dialog.confirm({
          title: '提示',
          message: '当前操作需要登录',
          confirmButtonText: '去登录',
          cancelButtonText: '再逛逛'
        })
          .then(() => {
            this.$router.replace({
              path: '/login',
              query: {
                backUrl: this.$route.fullPath
              }
            })
          })
          .catch(() => {
            // on cancel
          })
        return true
      }
      return false
    }
  }
}
