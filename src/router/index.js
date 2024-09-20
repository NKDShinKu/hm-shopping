import Vue from 'vue'
import VueRouter from 'vue-router'

import Layout from '@/views/layout'
import Login from '@/views/login'
import MyOrder from '@/views/myorder'
import Pay from '@/views/pay'
import Prodetail from '@/views/prodetail'
import Search from '@/views/search/index.vue'
import SearchList from '@/views/search/list'
import Home from '@/views/layout/home'
import Category from '@/views/layout/category'
import Shopping from '@/views/layout/shopping'
import User from '@/views/layout/user'
import store from '@/store/index.js'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: Layout,
      redirect: '/home',
      children: [
        { path: '/home', name: 'HomePage', component: Home },
        { path: '/category', component: Category },
        { path: '/shopping', component: Shopping },
        { path: '/user', component: User }
      ]
    },
    { path: '/login', component: Login },
    { path: '/myorder', component: MyOrder },
    { path: '/pay', component: Pay },
    { path: '/prodetail/:id', component: Prodetail },
    { path: '/search', component: Search },
    { path: '/searchlist', component: SearchList }
  ]
})

const rejectUrls = ['/pay', '/myorder']
router.beforeEach((to, from, next) => {
  if (!rejectUrls.includes(to.path)) {
    next()
    return
  }
  if (store.state.user.userInfo.token) {
    next()
  } else {
    next('/login')
  }
})
export default router
