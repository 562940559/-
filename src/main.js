import Vue from 'vue';
import 'babel-polyfill';
import 'font-awesome/css/font-awesome.css';

import App from './App';
import router from './router';
import store from './store';

import api from './api' // 导入api接口

import '../static/jSignature/jSignature.min';
import common from './assets/js/public.js';

import * as filters from './filters';
import './utils/rem';

// 引入vant
import Vant from 'vant';
import 'vant/lib/index.css';

import './utils/appback.js'; //解决返回键直接退出问题

Vue.use(Vant);

Vue.use(common);
import moment from 'moment'//导入文件

Vue.prototype.$api = api; // 将api挂载到vue的原型上

Vue.config.productionTip = false;
Vue.prototype.$moment = moment;//赋值使用

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
import { Toast } from 'vant';
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    if (store.state.token) {  // 通过vuex state获取当前的token是否存在
      next();
    }
    else {
      Toast.fail('身份过期，请重新登录。')
      next({
        path: '/login',
        query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }
  else {
    next();
  }
})
