<template>
  <!-- 首页 -->
  <div class="homePageWrap">
    <!-- 头部信息栏 -->
    <div class="top-wrap">
      <span class="return-btn">
        <van-icon name="replay" @click="refresh()" />
      </span>
      <span class="route-title">进站车辆列表</span>
      <span class="setting-btn">
        <van-icon name="plus" @click="showAdd = true" />
      </span>
    </div>

    <!-- 汽车列表 -->
    <div class="carList">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了">
        <div class="carItem" v-for="(item,index) in list" :key="index">
          <span @click="goDetail(item)">{{item.vehicle}}（进站时间：{{reTime(item.createDate)}}）</span>
          <span @click="goDetail(item)">{{reArchives(item.fileMark)}}</span>
          <van-icon name="close" @click="deleteCarItem(item,index)" />
        </div>
      </van-list>
    </div>

    <!-- 添加汽车弹出层 -->
    <van-overlay :show="showAdd" @click="showAdd = false">
      <div class="wrapper" @click.stop>
        <div class="addCar">
          <div class="title">
            添加车辆
            <span @click="closeAddCar()">
              <van-icon name="cross" />
            </span>
          </div>
          <div class="input-wrap">
            <label class="input-label">
              <b>*</b>车牌号码：
            </label>
            <input
              type="text"
              class="addCarInput"
              placeholder="请输入车牌号码"
              v-model="addInfo.licensePlateNumber"
            />
          </div>
          <div class="input-wrap">
            <label class="input-label">
              <b>*</b>车牌类型：
            </label>
            <div class="select-wrap">
              <select v-model="addInfo.vehicleType">
                <option value="蓝牌">蓝牌车</option>
                <option value="黄牌">黄牌车</option>
              </select>
            </div>
          </div>
          <div class="btn-wrap">
            <van-button type="info" block @click="sureAdd()">确定</van-button>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import * as $api from "@/api";
import * as SockJS from "../../../static/sockjs.js";
import Stomp from "stompjs";
import { Dialog, Toast, Overlay } from "vant";
export default {
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      showAdd: false,
      addInfo: {
        institutionsId: localStorage.deptid,
        licensePlateNumber: "",
        vehicleType: "黄牌"
      }
    };
  },
  created() {
    localStorage.isIndex = "true";
    this.refresh();
  },
  destroyed() {
    // 页面离开时断开连接
    localStorage.isIndex = "false";
    this.disconnect();
  },
  mounted() {},
  methods: {
    refresh() {
      // 刷新操作
      let para = {
        nParkId: localStorage.deptid
      };
      this.$api.homepage.refresh(para).then(res => {
        if (res.code == "200") {
          for (let a in res.vehicleValue) {
            res.vehicleValue[a] = JSON.parse(res.vehicleValue[a]);
          }
          this.loading = false;
          this.finished = true;
          this.connection();
          this.list = res.vehicleValue;
        }
      });
    },
    applyConn() {
      let data = {
        AlarmInfoPlate: {
          resultType: 0, //识别结果类型
          channel: 0, //通道号
          deviceName: "车牌识别一体机", //设备名称
          ipaddr: "192.168.1.98", //设备 IP
          result: {
            PlateResult: {
              confidence: 85, //可信度
              direction: 4, //行驶方向
              license: "京 Q2X0G5", //车牌号
              triggerType: 0, //出发类型
              type: 1, //车牌类型
              platecolor: "蓝", //车牌颜色
              recotime: "2018-1-24 16:33:17", //识别时间
              imageFile: "", // 大图数据
              imageFileLen: 0, //大图数据大小
              imageFragmentFile: "", //小图数据
              imageFragmentFileLen: 0 //小图大小
            }
          },
          seriaIno: "70b50907010000e1", //romid 旧版本使用
          romid: "70b50907010000e1", // romid 新版本使用
          sn: "", //序列号
          nParkID: 1, //停车场 Id（数字）
          ParkID: "1", //停车场 Id（字符串）
          ParkName: "Defult", //停车场名称
          ParkDoor: "Defult" //门口名称
        }
      };
      this.$api.homepage.applyConn(data).then(res => {
        console.log(res);
      });
    },
    reArchives(item) {
      // 重置有无档案
      if (item == "0") return "临时档案";
      if (item == "1") return "正式档案";
      if (item == "2") return "无档案";
    },
    reTime(time) {
      // 格式化时间
      var minute = 1000 * 60;
      var hour = minute * 60;
      var day = hour * 24;
      var dateTimeStamp = new Date(time);

      var result = "";
      var now = new Date().getTime();
      var diffValue = now - dateTimeStamp;
      if (diffValue < 0) {
        return (result = "刚刚");
      }
      var dayC = diffValue / day;
      var hourC = diffValue / hour;
      var minC = diffValue / minute;
      if (parseInt(dayC) > 30) {
        result = "" + "多天前";
      } else if (parseInt(dayC) > 1) {
        result = "" + parseInt(dayC) + "天前";
      } else if (parseInt(dayC) == 1) {
        result = "昨天";
      } else if (hourC >= 1) {
        result = "" + parseInt(hourC) + "小时前";
      } else if (minC >= 1) {
        result = "" + parseInt(minC) + "分钟前";
      } else result = "刚刚";
      return result;
    },
    deleteCarItem(item, index) {
      // 删除按钮
      Dialog.confirm({
        title: "提示",
        message: "确认删除该车辆吗？"
      })
        .then(() => {
          let data = {
            nParkId: item.nParkId,
            license: item.vehicle
          };
          this.$api.homepage.deleteCarItem(data).then(res => {
            if (res.code == "200") {
              this.list.splice(index, 1);
              return Toast("删除成功");
            }
            return Toast("删除失败");
          });
        })
        .catch(() => {
          // 取消删除
        });
    },
    goDetail(item) {
      localStorage.nowLicense = item.vehicle;
      if (item.fileMark == "2") return Toast("汽车无档案，无法进行操作");
      if (item.fileMark == "0" || item.fileMark == "1") {
        let data = {
          nParkId: localStorage.deptid,
          license: localStorage.nowLicense
        };
        this.$api.homepage.carDetailInfo(data).then(res => {
          if (res.code == 500) return Toast("临时档案未审核只能加气1次!");
          if (res.fillingRecord) {
            if (res.fillingRecord.status == "1")
              return this.$router.push({ path: "/fillingLog" });
            if (res.fillingRecord.status == "3")
              return this.$router.push({ path: "/recheckLog" });
          } else {
            return this.$router.push({ path: "/basicInfo" });
          }
        });
      }
    },
    connection() {
      // 建立连接对象
      let socket = new SockJS(this.$api.base.connectUrl);
      var that = this;
      var deptId = localStorage.deptid;
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(socket);
      // 向服务器发起websocket连接
      this.stompClient.connect(
        {},
        function() {
          //订阅
          that.stompClient.subscribe("/chat/pushVehicle/" + deptId, function(
            result
          ) {
            console.log(result);
            that.refresh();
          });
        },
        function errorCallBack(result) {
          console.log("失去连接123" + result);
          // that.connection();
        }
      );
    },
    disconnect() {
      if (this.stompClient) {
        this.stompClient.disconnect();
      }
    },
    closeAddCar() {
      this.showAdd = false;
    },
    sureAdd() {
      // 确认添加车辆
      if (this.addInfo.licensePlateNumber == "") {
        return Toast("请输入车牌号！");
      }
      this.$api.homepage.addCarItem(this.addInfo).then(res => {
        if (res.code == "200") {
          this.showAdd = false;
          Toast("添加成功！");
          this.refresh();
        }
      });
    }
  }
};
</script>

<style lang="less" type="text/less">
@import "../../assets/less/common.less";
.homePageWrap {
  .van-overlay {
    z-index: 99;
  }
}
</style>

<style scoped lang="less" type="text/less">
@import "../../assets/less/common.less";
.homePageWrap {
  width: 100%;
  height: 100%;
  overflow-y: auto;
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
  .carList {
    padding-top: 80 / @size;
    height: 100%;
    box-sizing: border-box;
    position: relative;
    .carItem {
      border-bottom: 1px solid #ccc;
      height: 80 / @size;
      box-sizing: border-box;
      padding: 0 30 / @size 0 20 / @size;
      position: relative;
      span {
        display: inline-block;
        height: 80 / @size;
        line-height: 80 / @size;
        font-size: 20 / @size;
      }
      span:nth-child(1) {
        width: 70%;
      }
      span:nth-child(2) {
        width: 25%;
        text-align: right;
      }
    }
    i {
      position: absolute;
      right: 10 / @size;
      font-size: 30 / @size;
      top: 23 / @size;
    }
  }

  .wrapper {
    display: flex;
    justify-content: center;
    height: 100%;
  }
  .addCar {
    width: 400 / @size;
    height: 280 / @size;
    box-sizing: border-box;
    padding: 20 / @size;
    background-color: #fff;
    margin-top: 300 / @size;
    .title {
      width: 100%;
      height: 40 / @size;
      line-height: 40 / @size;
      font-size: 24 / @size;
      text-align: center;
      color: #333;
      span {
        font-size: 20 / @size;
        float: right;
      }
    }
    .input-wrap {
      width: 100%;
      .input-label {
        font-size: 14px;
        display: inline-block;
        width: 90px;
        height: 50 / @size;
        line-height: 50 / @size;
        text-align: right;
        b {
          color: red;
        }
      }
      .addCarInput {
        margin-top: 10 / @size;
        width: calc(~"100% - 100px");
        border: none;
        display: inline-block;
        height: 50 / @size;
        line-height: 50 / @size;
        box-sizing: border-box;
        padding: 0 10 / @size;
        font-size: 20 / @size;
      }
      .select-wrap {
        display: inline-block;
        width: calc(~"100% - 100px");
        height: 50 / @size;
        position: relative;
      }
      .select-wrap select {
        /*清除select的边框样式*/
        border: none;
        /*清除select聚焦时候的边框颜色*/
        outline: none;
        /*将select的宽高等于div的宽高*/
        width: 100%;
        height: 50 / @size;
        line-height: 50 / @size;
      }
    }
    .btn-wrap {
      width: 100%;
      box-sizing: border-box;
      padding: 0 / @size 50 / @size;
      height: 80 / @size;
      text-align: center;
      display: flex;
      align-items: center;
      .van-button {
        height: 50 / @size;
        line-height: 50 / @size;
      }
    }
  }
}
</style>