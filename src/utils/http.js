/**
  * axios封装
  * 请求拦截、响应拦截、错误统一处理
  */
import axios from 'axios';
import router from '../router';
import store from '../store/index';
import { Toast } from 'vant';

/**
  * loading函数
  * 禁止点击蒙层
  */
function loading(time) {
  Toast.loading({
    mask: false,
    message: '加载中...',
    duration: time,
    forbidClick: true
  });
}
function errorToast(msg) {
  Toast.fail(msg);
}

// 创建axios实例
var instance = axios.create({ timeout: 1000 * 5 });
// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
//  instance.defaults.headers.post['Content-Type'] = 'application/json';

/**
  * 请求拦截器
  * 每次请求前，如果存在token则在请求头中携带token
  */
instance.interceptors.request.use(
  config => {
    // 登录流程控制中，根据本地是否存在token判断用户的登录情况
    // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
    // 后台根据携带的token判断用户的登录情况，并返回对应的状态码
    // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
    loading(5000);
    const token = store.state.token;
    token && (config.headers.common['Token'] = token);
    return config;
  },
  error => Promise.error(error))

// 响应拦截器
instance.interceptors.response.use(
  // 请求成功，对data进行解密操作
  res => {
    loading(100)
    if (typeof (res.data) == 'string') {
      return res
    }
    else { // 返回正常res
      return res.data;
    }
  },
  // 请求失败
  error => {
    if (error.response.data.message) {
      if (error.response.data.message == '凭证失效，请重新登录' || error.response.data.message == '凭证不能为空') {
        store.commit('del_token')
        return router.replace('/login')
      } else {
        return errorToast(error.response.data.message)
      }
    }
  }
);

export default instance;