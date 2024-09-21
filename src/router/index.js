import Vue from 'vue'
import VueRouter from 'vue-router'

import Layout from '@/views/layout'
import Home from '@/views/layout/home'
import Category from '@/views/layout/category'
import Shopping from '@/views/layout/shopping'
import User from '@/views/layout/user'

import store from '@/store/index.js'

// 路由懒加载
const Login = () => import('@/views/login')
const MyOrder = () => import('@/views/myorder')
const Pay = () => import('@/views/pay')
const Prodetail = () => import('@/views/prodetail')
const Search = () => import('@/views/search/index.vue')
const SearchList = () => import('@/views/search/list')

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
