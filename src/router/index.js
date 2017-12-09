import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Dashboard from '@/components/Dashboard'

import ArticleList from '@/components/article/list'
import ArticleAdd from '@/components/article/publish'
import TagList from '@/components/tag/list'

import UserChangePwd from '@/components/setting/changepwd'
import UserProfile from '@/components/setting/profile'
import NavList from '@/components/setting/nav'

// 懒加载方式，当路由被访问的时候才加载对应组件
const Login = resolve => require(['@/components/Login'], resolve)

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: '登录',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: '/dashboard',
      leaf: true, // 只有一个节点
      menuShow: true,
      iconCls: 'iconfont icon-home', // 图标样式class
      children: [
        {path: '/dashboard', component: Dashboard, name: '首页', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '文章管理',
      menuShow: true,
      iconCls: 'iconfont icon-books',
      children: [
        {path: '/article/list', component: ArticleList, name: '文章列表', menuShow: true},
        {path: '/article/publish', component: ArticleAdd, name: '发布文章', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '标签管理',
      menuShow: true,
      iconCls: 'iconfont icon-books',
      children: [
        {path: '/tag/list', component: TagList, name: '标签列表', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '设置',
      menuShow: true,
      iconCls: 'iconfont icon-setting1',
      children: [
        {path: '/setting/profile', component: UserProfile, name: '个人信息', menuShow: true},
        {path: '/setting/changepwd', component: UserChangePwd, name: '修改密码', menuShow: true},
        {path: '/setting/nav', component: NavList, name: '导航栏', menuShow: true}
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/login')) {
    window.sessionStorage.removeItem('login-user');
    next()
  } else {
    let user = JSON.parse(window.sessionStorage.getItem('login-user'))
    if (!user) {
      next({path: '/login'})
    } else {
      next()
    }
  }
})

export default router
