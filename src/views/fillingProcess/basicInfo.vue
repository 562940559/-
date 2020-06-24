<template>
  <div class="basicInfo-wrap">
    <!-- 头部信息栏 -->
    <div class="top-wrap">
      <span class="return-btn">
        <van-icon name="arrow-left" @click="routerBack()" />
      </span>
      <span class="route-title">车牌号</span>
      <span class="setting-btn"></span>
    </div>
    <!-- 基本信息 -->
    <van-collapse v-model="activeNames">
      <!-- 车辆信息 -->
      <van-collapse-item title="车辆信息" name="1">
        <div class="plateWrap">
          <span>车牌</span>
          <span @click="showPop('车牌',pageInfo.license)">{{pageInfo.license}}</span>
        </div>
        <div class="plateWrap">
          <span>使用单位</span>
          <span @click="showPop('使用单位',pageInfo.useUnit)">{{pageInfo.useUnit}}</span>
        </div>
      </van-collapse-item>
      <!-- 气瓶信息 -->
      <van-collapse-item title="气瓶信息" name="2">
        <div v-for="(item,index) in pageInfo.cylinders" :key="index" class="oneAirBottle-wrap">
          <div class="plateWrap">
            <span>气瓶{{index+1}}编号</span>
            <span @click="showPop(`气瓶${index+1}编号`,item.cylinderNumber)">{{item.cylinderNumber}}</span>
          </div>
          <div class="plateWrap">
            <span>气瓶{{index+1}}下次检验日期</span>
            <span @click="showPop(`气瓶${index+1}下次检验日期`,item.testDate)">{{item.testDate}}</span>
          </div>
          <div class="plateWrap">
            <span>气瓶{{index+1}}安全阀下次检验日期</span>
            <span @click="showPop(`气瓶${index+1}安全阀下次检验日期`,item.valueTestDate)">{{item.valueTestDate}}</span>
          </div>
          <div class="plateWrap">
            <span>气瓶{{index+1}}压力表下次检验日期</span>
            <span @click="showPop(`气瓶${index+1}安全阀下次检验日期`,item.pressureGaugeTestDate)">{{item.pressureGaugeTestDate}}</span>
          </div>
        </div>
      </van-collapse-item>
    </van-collapse>

    <div class="bottom-wrap">
      <van-button type="info" size="small" @click="goFilling()">充装前检查</van-button>
      <van-button type="default" size="small" @click="noFilling()">不充装</van-button>
    </div>
    <!-- pop弹出层 -->
    <van-popup v-model="show">
      <div class="popWrap">
        <p>{{showTitle}}</p>
        <p>{{showText}}</p>
      </div>
    </van-popup>
  </div>
</template>

<script>
import * as $api from '@/api';
import { Popup } from "vant";
export default {
  data() {
    return {
      queryItem: { //查询车辆详情信息的参数
        nParkId: localStorage.deptid,
        license: '川A78912',
      },
      show: false,
      showTitle: "",
      showText: "",
      activeNames: ["1"],
      pageInfo: '', // 当前页面信息
    };
  },
  created() {
    this.$api.homepage.carDetailInfo(this.queryItem)
    .then(res=>{
      if(res.code == '200') {
        this.pageInfo = res.vehicleFile
      }
    })
  },
  mounted() {},
  methods: {
    routerBack() {
      this.$router.back("-1");
    },
    showPop(title, item) {
      this.showTitle = title;
      this.showText = item;
      this.show = true;
    },
    noFilling() {
      // 不充装
      this.$router.push('/')
    },
    goFilling() {
      // 充装前检查
      this.$router.replace('/beforeFillingLog')
    }
  }
};
</script>

<style lang="less" type="text/less">
@import "../../assets/less/common.less";
.basicInfo-wrap {
  .van-collapse-item__content {
    padding: 10 / @size 0 / @size;
  }
  .van-collapse {
    margin-bottom: 20 / @size;
  }
  .van-button--large {
    height: 100%;
  }
}
</style>
<style scoped lang="less" type="text/less">
@import "../../assets/less/common.less";
.basicInfo-wrap {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  padding-top: 80 / @size;
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
    z-index: 90;
    top: 0;
    border-bottom: 1px solid #ccc;
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

  .plateWrap {
    width: 100%;
    height: 60 / @size;
    background-color: #fff;
    box-sizing: border-box;
    padding: 0 30 / @size;
    border-bottom: 1px solid #e5e5e5;
    span {
      display: inline-block;
      height: 60 / @size;
      line-height: 60 / @size;
      font-size: 20 / @size;
      position: relative;
      i {
        position: relative;
        top: 3 / @size;
      }
    }
  }
  .plateWrap span:nth-child(2) {
    float: right;
    color: #6e6e6e;
    width: 200 / @size;
    text-align: right;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #000;
  }
  .plateWrap:last-child {
    border-bottom: none;
  }
  .oneAirBottle-wrap {
    margin-bottom: 80/@size;
  }

  .popWrap {
    background-color: #fff;
    padding: 50 / @size;
    position: relative;
    border-radius: 50 / @size;
    p {
      width: 300 / @size;
      text-align: center;
    }
  }
  .popWrap p:nth-child(1) {
    font-size: 22 / @size;
    color: #000;
    margin-bottom: 20 / @size;
  }
  .popWrap p:nth-child(2) {
    word-wrap: break-word;
    color: #737373;
    font-size: 20 / @size;
  }

  .bottom-wrap {
    height: 80/@size;
    width: 100%;
    position: fixed;
    bottom: 0;
    background-color: #fff;
    color: #323232;
    font-family: SourceHanSansCN;
    font-size: 18 / @size;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding: 0 20 / @size;
    border-top: 1px solid #ccc;
    .van-button {
      margin: 0 20/@size;
      padding: 0 20/@size;
    }
  }
}
</style>