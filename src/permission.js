// import router from './router';
// import { getToken } from '@/utils/auth';
// import store from './store';
// const whiteList = ['/'];
// // 路由导航守卫
// router.beforeEach((to, from, next) => {
//   console.log(router)
  // if (getToken()) {
  //   if (store.getters.hasLogin) {
  //     next();
  //   } else {
  //     store.dispatch('GetUserInfo').then(() => {
  //       next({ ...to, replace: true });
  //     }).catch(() => {
  //       store.dispatch('FedLogOut').then(() => {
  //         next({ path: '/' });
  //       });
  //     });
  //   }
  // } else {
  //   if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
  //     next();
  //   } else {
  //     next({ path: '/' }); // 否则全部重定向到首页
  //   }
  // }
// });
