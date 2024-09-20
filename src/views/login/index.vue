<template>
  <div class="login">
    <van-nav-bar title="登录" left-arrow @click-left="$router.go(-1)" />
    <div class="container">
      <div class="title">
        <h3>手机号登录</h3>
        <p>未注册的手机号登录后将自动注册</p>
      </div>

      <div class="form">
        <div class="form-item">
          <input v-model="mobile" class="inp" maxlength="11" placeholder="请输入手机号码" type="text">
        </div>
        <div class="form-item">
          <input v-model="picCode" class="inp" maxlength="5" placeholder="请输入图形验证码" type="text">
          <img :src="picUrl" alt="" @click='getPicCode'>
        </div>
        <div class="form-item">
          <input v-model="msgCode" class="inp" placeholder="请输入短信验证码" type="text">
          <button @click="getCode">
            {{ second === totalsecond? '获取验证码' : second + '秒后重新发送' }}
          </button>
        </div>
      </div>

      <div @click="login" class="login-btn">登录</div>
    </div>
  </div>
</template>

<script>
import { getPicCode, getMsgCode, codeLogin } from '@/api/login'
import { Toast } from 'vant'

export default {
  name: 'LoginPage',
  data () {
    return {
      picUrl: '', // 图片url
      picKey: '', // 图片正确验证码
      totalsecond: 60,
      second: 60,
      timer: null,
      picCode: '', // 图片输入验证码
      mobile: '', // 电话号码
      msgCode: '' // 验证码
    }
  },
  async created () {
    this.getPicCode()
  },
  methods: {
    // 获取图形验证码
    async getPicCode () {
      const { data: { base64, key } } = await getPicCode()
      this.picUrl = base64
      this.picKey = key
      // this.$toast('获取成功！')
      Toast('获取成功！')
    },

    // 判断手机号和图形验证码是否合法
    validFn () {
      if (!/^1[3-9]\d{9}$/.test(this.mobile)) {
        Toast('请输入正确的手机号！')
        return false
      }
      if (!/^\w{4}$/.test(this.picCode)) {
        Toast('请输入正确的图形验证码！')
        return false
      }
      return true
    },

    // 发送短信验证码
    async getCode () {
      // 验证是否输入正确的验证码和手机号
      if (!this.validFn()) {
        return
      }
      // 开启验证码倒计时
      if (!this.timer && this.second === this.totalsecond) {
        // 发送验证码请求
        await getMsgCode(this.picCode, this.picKey, this.mobile)
        Toast('发送成功，注意查收！')

        this.timer = setInterval(() => {
          this.second--

          if (this.second <= 0) {
            clearInterval(this.timer)
            this.timer = null
            this.second = 60
          }
        }, 1000)
      }
    },

    // 登录
    async login () {
      if (!this.validFn) {
        return
      }
      if (!/^\d{6}$/.test(this.msgCode)) {
        Toast('请输入正确的的手机验证码')
        return
      }
      const res = await codeLogin(this.mobile, this.msgCode)
      // console.log(res)
      this.$store.commit('user/setUserInfo', res.data)
      Toast('登录成功！')

      const backUrl = this.$route.query.backUrl || '/'
      this.$router.replace(backUrl)
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  padding: 49px 29px;

  .title {
    margin-bottom: 20px;
    h3 {
      font-size: 26px;
      font-weight: normal;
    }
    p {
      line-height: 40px;
      font-size: 14px;
      color: #b8b8b8;
    }
  }

  .form-item {
    border-bottom: 1px solid #f3f1f2;
    padding: 8px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    .inp {
      display: block;
      border: none;
      outline: none;
      height: 32px;
      font-size: 14px;
      flex: 1;
    }
    img {
      width: 94px;
      height: 31px;
    }
    button {
      height: 31px;
      border: none;
      font-size: 13px;
      color: #cea26a;
      background-color: transparent;
      padding-right: 9px;
    }
  }

  .login-btn {
    width: 100%;
    height: 42px;
    margin-top: 39px;
    background: linear-gradient(90deg,#ecb53c,#ff9211);
    color: #fff;
    border-radius: 39px;
    box-shadow: 0 10px 20px 0 rgba(0,0,0,.1);
    letter-spacing: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
