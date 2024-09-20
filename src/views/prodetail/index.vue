<template>
  <div class="prodetail">
    <van-nav-bar fixed title="商品详情页" left-arrow @click-left="$router.go(-1)" />

    <van-swipe :autoplay="3000" @change="onChange">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img :src="image.external_url" />
      </van-swipe-item>

      <template #indicator>
        <div class="custom-indicator">{{ current + 1 }} / {{ images.length }}</div>
      </template>
    </van-swipe>

    <!-- 商品说明 -->
    <div class="info">
      <div class="title">
        <div class="price">
          <span class="now">￥{{ goodData.goods_price_min }}</span>
          <span class="oldprice">￥{{ goodData.goods_price_max }}</span>
        </div>
        <div class="sellcount">已售{{ goodData.goods_sales }}件</div>
      </div>
      <div class="msg text-ellipsis-2">
        {{ goodData.goods_name }}
      </div>

      <div class="service">
        <div class="left-words">
          <span><van-icon name="passed" />七天无理由退货</span>
          <span><van-icon name="passed" />48小时发货</span>
        </div>
        <div class="right-icon">
          <van-icon name="arrow" />
        </div>
      </div>
    </div>

    <!-- 商品评价 -->
    <div class="comment">
      <div class="comment-title">
        <div class="left">商品评价 ({{ goodCommentsTotal }}条)</div>
        <div class="right">查看更多 <van-icon name="arrow" /> </div>
      </div>
      <div class="comment-list">
        <div class="comment-item" v-for="item in goodComments" :key="item.comment_id">
          <div class="top">
            <img :src="item.goods_images || defaultImg" alt="">
            <div class="name">{{ item.user.nick_name }}</div>
            <van-rate :size="16" :value="item.score / 2" color="#ffd21e" void-icon="star" void-color="#eee"/>
          </div>
          <div class="content">
            {{ item.content }}
          </div>
          <div class="time">
            {{ item.create_time }}
          </div>
        </div>
      </div>
    </div>

    <!-- 商品描述 -->
    <div class="desc" v-html="goodData.content">
    </div>

    <!-- 底部 -->
    <div class="footer">
      <div @click="$router.push('/')" class="icon-home">
        <van-icon name="wap-home-o" />
        <span>首页</span>
      </div>
      <div @click="$router.push('/shopping')" class="icon-cart">
        <span v-if="cartTotal > 0" class="num">{{ cartTotal }}</span>
        <van-icon name="shopping-cart-o" />
        <span>购物车</span>
      </div>
      <div @click="show1Fn" class="btn-add">加入购物车</div>
      <div @click="show2Fn" class="btn-buy">立刻购买</div>
    </div>

    <!-- 购物弹窗 -->
    <van-action-sheet v-model="showPd" :title="mode === 'cart' ? '加入购物车' : '立刻购买'">
      <div class="product">
        <div class="product-title">
          <div class="left">
            <img :src="goodData.goods_image" alt="">
          </div>
          <div class="right">
            <div class="price">
              <span>¥</span>
              <span class="nowprice">{{ goodData.goods_price_min }}</span>
            </div>
            <div class="count">
              <span>库存</span>
              <span>{{ goodData.stock_total }}</span>
            </div>
          </div>
        </div>
        <div class="num-box">
          <span>数量</span>
          <CountBox v-model="buyCount"></CountBox>
        </div>
        <div class="showbtn" v-if="goodData.stock_total > 0">
          <div @click="addCart" class="btn" v-if="mode === 'cart'">加入购物车</div>
          <div class="btn now" @click="goBuyNow" v-else>立刻购买</div>
        </div>
        <div class="btn-none" v-else>该商品已抢完</div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import { getGoodsDetail, getGoodComment } from '@/api/products.js'
import { addCart } from '@/api/cart.js'
import defaultImg from '@/assets/default_img.jpg'
import CountBox from '@/components/CountBox.vue'
// import { Dialog } from 'vant'
import loginConfirm from '@/mixins/loginConfirm'

export default {
  name: 'ProDetail',
  mixins: [loginConfirm],
  components: {
    CountBox
  },
  data () {
    return {
      images: [], // 轮播图
      current: 0,
      goodData: {}, // 商品
      goodComments: [], // 评论
      goodCommentsTotal: 0, // 评论数量
      defaultImg, // 默认头像
      showPd: false, // 弹窗判断
      mode: 'cart', // 弹窗模式（购物车/直接购买）
      buyCount: 1, // 购买数量
      cartTotal: 0
    }
  },
  created () {
    this.getGoodsDetail()
    this.getGoodComment()
  },
  methods: {
    // 请求商品详情的方法
    async getGoodsDetail () {
      const res = await getGoodsDetail(this.GoodsId)
      this.goodData = res.data.detail
      this.images = res.data.detail.goods_images
      // console.log(this.goodData)
    },

    // 请求商品评论的方法
    async getGoodComment () {
      const res = await getGoodComment(this.GoodsId)
      this.goodComments = res.data.list
      this.goodCommentsTotal = res.data.total
      // console.log(this.goodComments)
    },
    onChange (index) {
      this.current = index
    },
    show1Fn () {
      this.mode = 'cart'
      this.showPd = true
    },
    show2Fn () {
      this.mode = 'buynow'
      this.showPd = true
    },

    // 未登录唤起弹窗
    async addCart () {
      // console.log(this.$store.getters.token)
      // if (!this.$store.getters.token) {
      //   Dialog.confirm({
      //     title: '提示',
      //     message: '当前操作需要登录',
      //     confirmButtonText: '去登录',
      //     cancelButtonText: '再逛逛'
      //   })
      //     .then(() => {
      //       this.$router.replace({
      //         path: '/login',
      //         query: {
      //           backUrl: this.$route.fullPath
      //         }
      //       })
      //     })
      //     .catch(() => {
      //       // on cancel
      //     })
      // }
      if (this.loginConfirm()) {
        return
      }
      const { data } = await addCart(this.GoodsId, this.buyCount, this.goodData.skuList[0].goods_sku_id)
      this.cartTotal = data.cartTotal
      this.$toast('加入购物车成功')
      this.showPd = false
    },
    // 立即购买
    goBuyNow () {
      if (this.loginConfirm()) {
        return
      }
      this.$router.push({
        path: '/pay',
        query: {
          mode: 'buyNow',
          goodsId: this.GoodsId,
          goodsSkuId: this.goodData.skuList[0].goods_sku_id,
          goodsNum: this.buyCount
        }
      })
    }
  },
  computed: {
    GoodsId () {
      return this.$route.params.id
    }
  }
}
</script>

<style lang="less" scoped>
.prodetail {
  padding-top: 46px;
  ::v-deep .van-icon-arrow-left {
    color: #333;
  }
  img {
    display: block;
    width: 100%;
  }
  .custom-indicator {
    position: absolute;
    right: 10px;
    bottom: 10px;
    padding: 5px 10px;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 15px;
  }
  .desc {
    width: 100%;
    overflow: scroll;
    ::v-deep img {
      display: block;
      width: 100%!important;
    }
  }
  .info {
    padding: 10px;
  }
  .title {
    display: flex;
    justify-content: space-between;
    .now {
      color: #fa2209;
      font-size: 20px;
    }
    .oldprice {
      color: #959595;
      font-size: 16px;
      text-decoration: line-through;
      margin-left: 5px;
    }
    .sellcount {
      color: #959595;
      font-size: 16px;
      position: relative;
      top: 4px;
    }
  }
  .msg {
    font-size: 16px;
    line-height: 24px;
    margin-top: 5px;
  }
  .service {
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    margin-top: 10px;
    font-size: 16px;
    background-color: #fafafa;
    .left-words {
      span {
        margin-right: 10px;
      }
      .van-icon {
        margin-right: 4px;
        color: #fa2209;
      }
    }
  }

  .comment {
    padding: 10px;
  }
  .comment-title {
    display: flex;
    justify-content: space-between;
    .right {
      color: #959595;
    }
  }

  .comment-item {
    font-size: 16px;
    line-height: 30px;
    .top {
      height: 30px;
      display: flex;
      align-items: center;
      margin-top: 20px;
      img {
        width: 20px;
        height: 20px;
      }
      .name {
        margin: 0 10px;
      }
    }
    .time {
      color: #999;
    }
  }
  .content {
    width: 100%;
    overflow: hidden;
  }
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 55px;
    background-color: #fff;
    border-top: 1px solid #ccc;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    .icon-home, .icon-cart {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      .van-icon {
        font-size: 24px;
      }
    }
    .btn-add,
    .btn-buy {
      height: 36px;
      line-height: 36px;
      width: 120px;
      border-radius: 18px;
      background-color: #ffa900;
      text-align: center;
      color: #fff;
      font-size: 14px;
    }
    .btn-buy {
      background-color: #fe5630;
    }
  }
}
.footer .icon-cart {
  position: relative;
  padding: 0 6px;
  .num {
    z-index: 999;
    position: absolute;
    top: -2px;
    right: 0;
    min-width: 16px;
    padding: 0 4px;
    color: #fff;
    text-align: center;
    background-color: #ee0a24;
    border-radius: 50%;
  }
}
.tips {
  padding: 10px;
}
.product {
  .product-title {
    display: flex;
    .left {
      img {
        width: 90px;
        height: 90px;
      }
      margin: 10px;
    }
    .right {
      flex: 1;
      padding: 10px;
      .price {
        font-size: 14px;
        color: #fe560a;
        .nowprice {
          font-size: 24px;
          margin: 0 5px;
        }
      }
    }
  }

  .num-box {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    align-items: center;
  }

  .btn, .btn-none {
    height: 40px;
    line-height: 40px;
    margin: 20px;
    border-radius: 20px;
    text-align: center;
    color: rgb(255, 255, 255);
    background-color: rgb(255, 148, 2);
  }
  .btn.now {
    background-color: #fe5630;
  }
  .btn-none {
    background-color: #cccccc;
  }
}
</style>
