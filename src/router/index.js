import Vue from 'vue';
import Router from 'vue-router';
import store from '../store/index';
Vue.use(Router);

// path 路由地址
// name 路由名称
// component 引入的组件路径
// keepAlive 在vue.app中所做的是否缓存判读
// requireAuth 需要登录才能访问的页面
// showTop 该路由下是否显示top
// showBack top中是否显示回退按钮
// title top中的页面标题
// active 对应tabbar中的位置

export const router = [
  {
    path: '/',
    name: '首页',
    component: () => import('../views/index'),
    meta: {
      requireAuth: true,
      showTop: false,
      title: '进站车辆列表',
    }
  },{
    path: '/basicInfo',
    name: '充气前基本信息',
    component: () => import('../views/fillingProcess/basicInfo.vue'),
    meta: {
      requireAuth: true,
      showTop: false,
      title: '充气前基本信息',
    }
  },{
    path: '/beforeFillingLog',
    name: '充气前检查记录',
    component: () => import('../views/fillingProcess/beforeFillingLog.vue'),
    meta: {
      requireAuth: true,
      showTop: true,
      showBack: true,
      title: '充气前检查记录',
    }
  },{
    path: '/fillingLog',
    name: '充装记录',
    component: () => import('../views/fillingProcess/fillingLog.vue'),
    meta: {
      requireAuth: true,
      showTop: true,
      showBack: true,
      title: '充装记录',
    }
  },{
    path: '/recheckLog',
    name: '充装后复检记录',
    component: () => import('../views/fillingProcess/recheckLog.vue'),
    meta: {
      requireAuth: true,
      showTop: true,
      showBack: true,
      title: '充装后复检记录',
    }
  },{
    path: '/login',
    name: '登陆页',
    component: () => import('../views/login.vue'),
  },{
    path: '/forget',
    name: '忘记密码',
    component: () => import('../views/forget.vue'),
    meta: {
      showTop: true,
      showBack: true,
      title: '忘记密码'
    }
  },];

// 页面刷新时，重新赋值token
if (localStorage.getItem('token')) {
  store.commit('set_token', localStorage.getItem('token'))
}

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: router
})