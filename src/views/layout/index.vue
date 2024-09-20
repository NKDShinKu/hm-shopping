<template>
  <div>
    <router-view/>
    <van-tabbar route active-color='#d44676'>
      <van-tabbar-item to='/home' icon="wap-home-o">主页</van-tabbar-item>
      <van-tabbar-item to='/category' icon="apps-o">分类</van-tabbar-item>
      <van-tabbar-item to='/shopping' icon="shopping-cart-o">购物车</van-tabbar-item>
      <van-tabbar-item to='/user' icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'LayoutIndex'
}
</script>

<style>

</style>
