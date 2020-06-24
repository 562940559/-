<template>
  <!-- 登录页 -->
  <div class="loginContainer">
    <div v-if="this.loginMethod == 'password'">
      <div class="imgWrap">
        <div class="imgContainer"></div>
      </div>
      <div class="formContainer">
        <input type="text" placeholder="请输入账号" v-model="loginInfo.userName" />
        <span class="pwdContainer">
          <input
            :type="showPwd === true ? 'text' : 'password'"
            placeholder="请输入密码"
            v-model="loginInfo.passWord"
          />
          <van-icon
            @click="switchEye()"
            class="eyes"
            :name="showPwd === true ? 'eye-o' : 'closed-eye'"
          />
        </span>
        <p class="warning" v-if="isEmpty">账号或密码不能为空！</p>
        <p class="warning" v-if="isError">账号或密码错误！</p>
      </div>
      <div class="btnContainer">
        <van-button
          :loading="loading"
          type="info"
          size="large"
          loading-text="登录中..."
          @click="sub()"
        >登录</van-button>
      </div>
    </div>

    <div v-else>
      <div class="imgWrap">
        <div class="imgContainer"></div>
      </div>
      <div class="codeFormContainer">
        <input type="text" placeholder="请输入手机号" maxlength="11" v-model="phone.phone" />
        <span class="getCode" v-if="!isSend" @click="getCode()">获取验证码</span>
        <span class="getCode" v-else>倒计时{{number}}</span>
        <input
          type="text"
          maxlength="6"
          placeholder="请输入验证码"
          v-model="nodeLoginInfo.code"
          oninput="value=value.replace(/[^\d]/g,'')"
        />
      </div>
      <div class="btnContainer">
        <van-button
          :loading="loading"
          type="info"
          size="large"
          loading-text="登录中..."
          @click="nodeSub()"
        >登录</van-button>
      </div>
    </div>

    <div class="toOther">
      <p @click="switchMethod()" v-if="this.loginMethod == 'password'">
        <span>验证码登录></span>
      </p>
      <p @click="switchMethod()" v-else>账号密码登录></p>
    </div>

    <div @click="goForgetPass()" class="forgetPass" v-if="false">
      <p>忘记密码</p>
    </div>
  </div>
</template>

<script>
import * as $api from "../api";
import axios from "@/utils/http";
import aes from "../utils/aes";
import store from "../store";
import { Toast } from "vant";
export default {
  data() {
    return {
      showPwd: false, // 是否显示密码
      loading: false,
      isEmpty: false,
      isError: false,
      timer: null, //定时器
      number: "", //倒计时
      isSend: false, //是否发送验证码
      sendNeedInfo: {
        phone: ""
      },
      nodeLoginInfo: {
        phone: "",
        code: "",
        userId: ""
      },
      phone: {
        phone: ""
      },
      loginInfo: {
        userName: "",
        passWord: ""
      },
      loginMethod: "password" // 登录方式
    };
  },
  methods: {
    getCode() {
      //获取验证码
      if (this.phone.phone == "") {
        return Toast("请输入手机号！");
      }
      if (!/^1[3456789]\d{9}$/.test(this.phone.phone)) {
        return Toast("请输入正确的手机号！");
      }
      this.$api.login.getCode(this.phone).then(res => {
        if (res.code == "500") {
          return Toast(res.msg);
        }
        Toast("短信发送成功");
        this.isSend = true;
        this.nodeLoginInfo.userId = res.userId;
        this.number = 179;
        this.timer = window.setInterval(() => {
          this.number = this.number - 1;
          if (this.number == 0) {
            clearInterval(this.timer);
            this.timer = null;
            this.isSend = false;
          }
        }, 1000);
      });
    },
    switchMethod() {
      //切换登录方式
      if (this.loginMethod == "password") {
        this.loginMethod = "code";
      } else {
        this.loginMethod = "password";
      }
    },
    //提交登录信息(手机验证码登录)
    nodeSub() {
      let _this = this;
      if (this.nodeLoginInfo.code == "") {
        return Toast("请输入验证码！");
      }
      this.loading = true;
      this.nodeLoginInfo.phone = this.phone.phone;
      this.$api.login.codeLogin(this.nodeLoginInfo).then(
        res => {
          if (res.code == "500") {
            this.loading = false;
            return Toast(res.msg);
          } else if (res.code == "200") {
            this.loading = false;
            let token = res.token,
              deptid = res.deptid;
            _this.$store.commit("set_token", token);
            _this.$store.commit("set_deptid", deptid);
            Toast("登录成功！");
          }
          window.setTimeout(() => {
            this.$router.replace("/");
          }, 1000);
        },
        err => {
          this.loading = false;
        }
      );
    },
    // 提交登录信息(正常用户名密码登录)
    sub() {
      let _this = this;
      this.isEmpty = false;
      this.isError = false;
      this.loading = true;
      if (this.loginInfo.userName == "" || this.loginInfo.passWord == "") {
        this.loading = false;
        return this.isEmpty = true;
      }
      this.$api.login.passwordLogin(this.loginInfo).then(
        res => {
          _this.loading = false;
          if (res.code == "200") {
            Toast.success("登录成功！");
            let token = res.token,
              deptid = res.deptid;
            _this.$store.commit("set_token", token);
            _this.$store.commit("set_deptid", deptid);
          }
          window.setTimeout(() => {
            _this.$router.replace("/");
          }, 1000);
        },
        err => {
          this.loading = false;
        }
      );
    },
    switchEye() {
      this.showPwd = !this.showPwd;
    },
    goForgetPass() {
      // 跳转忘记密码界面
      this.$router.push("forget");
    }
  }
};
</script>

<style scoped lang="less" type="text/less">
@import "../assets/less/common.less";
.loginContainer {
  width: 100%;
  height: 100%;

  //账号密码登录板块
  .imgWrap {
    width: 100%;
    height: 350 / @size;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    .imgContainer {
      width: 180 / @size;
      height: 180 / @size;
      background: url('../assets/img/login/loginLogo.png') no-repeat;
      background-size: 100% 100%;
    }
  }

  .formContainer {
    width: 100%;
    height: 250 / @size;
    box-sizing: border-box;
    padding: 0px 70 / @size;
    input {
      border: none;
      width: 100%;
      height: 70 / @size;
      line-height: 70 / @size;
      margin-bottom: 20 / @size;
      color: #a9a9a9;
      border-bottom: 1 / @size solid #e5e5e5;
      font-size: 24 / @size;
    }
    input::-webkit-input-placeholder {
      color: #a9a9a9;
      font-size: 20 / @size;
    }
    .pwdContainer {
      display: inline-block;
      position: relative;
      width: 100%;
      .eyes {
        position: absolute;
        right: 0 / @size;
        top: 25 / @size;
        color: #a9a9a9;
      }
    }
    .warning {
      color: #ff0000;
      font-size: 12 / @size;
    }
  }
  .codeFormContainer {
    width: 100%;
    height: 250 / @size;
    box-sizing: border-box;
    padding: 0px 70 / @size;
    position: relative;
    input {
      border: none;
      width: 100%;
      height: 70 / @size;
      line-height: 70 / @size;
      margin-bottom: 20 / @size;
      color: #a9a9a9;
      border-bottom: 1 / @size solid #e5e5e5;
      font-size: 24 / @size;
    }
    input::-webkit-input-placeholder {
      color: #a9a9a9;
      font-size: 20 / @size;
    }
    .getCode {
      position: absolute;
      height: 40 / @size;
      line-height: 40 / @size;
      color: #1989fa;
      border-left: 1px solid #e5e5e5;
      text-align: center;
      font-size: 20 / @size;
      width: 130 / @size;
      right: 70 / @size;
      top: 110 / @size;
    }
  }
  .btnContainer {
    width: 100%;
    padding: 0 70 / @size;
    box-sizing: border-box;
    height: 100 / @size;
    display: flex;
    align-items: center;
    button {
      border-radius: 10 / @size;
    }
  }
  .toOther {
    height: 80 / @size;
    line-height: 80 / @size;
    text-align: center;
    font-size: 20 / @size;
    color: #1989fa;
    font-weight: 600;
  }

  .forgetPass {
    text-align: center;
    font-size: 20 / @size;
    color: #ccc;
    font-weight: 600;
  }
}
</style>