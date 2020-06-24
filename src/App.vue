<template>
  <div id="app">
    <!-- 头部信息栏 -->
    <div class="top-wrap" v-if="$route.meta.showTop">
      <span class="return-btn">
        <van-icon name="arrow-left" @click="routerBack()" v-if="$route.meta.showBack"></van-icon>
      </span>
      <span class="route-title">{{$route.meta.title}}</span>
      <span class="setting-btn"></span>
    </div>
    <!-- 页面 -->
    <!-- 存在与keep-alive中的页面会被vue缓存 -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
import { Dialog } from "vant";
import store from "./store";
export default {
  name: "app",
  data() {
    return {

    };
  },
  computed: {},
  methods: {
    routerBack() {
      this.$router.back(-1);
    },
  },
  watch: {}
};
</script>

<style lang="less" type="text/less">
@import "./assets/less/common.less";
#app {
  width: 100%;
  height: 100%;
}
// 对vant的Tabbar的样式进行修改
.van-tabbar {
  height: 88 / @size;
  border-top: 2 / @size solid #ececf0;
}
.van-tabbar-item__icon {
  font-size: 38 / @size!important;
  margin-bottom: 5 / @size!important;
  .van-info {
    font-size: 18 / @size;
    line-height: 20 / @size;
    min-width: 24 / @size;
    top: 8 / @size;
  }
}
.van-tabbar-item__text {
  font-size: 18 / @size!important;
}
.van-tabbar-item--active {
  color: #02ac61 !important;
}
</style>
<style scoped lang="less" type="text/less">
@import "./assets/less/common.less";
// 对顶部导航条进行样式修改
.top-wrap {
  width: 100%;
  height: 80 / @size;
  background-color: white;
  color: #323232;
  font-family: SourceHanSansCN;
  font-size: 18 / @size;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 20 / @size;
  position: fixed;
  z-index: 9999;
  .return-btn {
    font-size: 28 / @size;
    width: 150 / @size;
    i {
      position: relative;
      top: 5 / @size;
    }
    .text {
      position: relative;
      left: -10 / @size;
    }
  }
  .route-title {
    font-size: 30 / @size;
    text-align: left;
  }
  .setting-btn {
    font-size: 36 / @size;
    width: 150 / @size;
    text-align: right;
    position: relative;
    top: 5 / @size;
    a:nth-child(1) {
      margin-right: 30 / @size;
    }
    a {
      color: #323232;
    }
  }
}
</style>
