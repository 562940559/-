<template>
  <div class="forgetPage-wrap">
    <div class="codeFormContainer">
      <input type="text" placeholder="请输入手机号" maxlength="11" 
        v-model="forgetInfo.phone"
        oninput="value=value.replace(/[^\d]/g,'')" />
      <span class="getCode" v-if="!isSend" @click="getCode()">获取验证码</span>
      <span class="getCode" v-else>倒计时{{number}}</span>
      <input
        type="text"
        maxlength="6"
        placeholder="请输入验证码"
        v-model="forgetInfo.code"
        oninput="value=value.replace(/[^\d]/g,'')"
      />
    </div>

    <div class="formContainer">
      <input :type="showPwd === true ? 'text' : 'password'"
       placeholder="请输入密码" v-model="password" />
      <span class="pwdContainer">
        <input
          :type="showPwd === true ? 'text' : 'password'"
          placeholder="请确认密码"
          v-model="newPassword"
        />
        <van-icon
          @click="switchEye()"
          class="eyes"
          :name="showPwd === true ? 'eye-o' : 'closed-eye'"
        />
      </span>
    </div>
    <div class="btnContainer">
      <van-button
        type="primary"
        size="large"
        @click="sub()"
      >确认修改</van-button>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant';
export default {
  data() {
    return {
      password: '',
      newPassword: '',
      forgetInfo: {
        phone: '', // 用户电话
        code: '', // 验证码
        newPass: '', // 新密码
      },
      showPwd: false,
      timer: null, //定时器
      number: '', //倒计时
      isSend: false, //是否发送验证码
    }
  },
  created(){},
  mounted(){},
  methods: {
    getCode() {
      //获取验证码
      if(this.forgetInfo.phone == '') {
        return Toast('请输入手机号！')
      }if(!(/^1[3456789]\d{9}$/.test(this.forgetInfo.phone))) {
        return Toast('请输入正确的手机号！')
      }
      this.$api.login.getCode(this.forgetInfo)
      .then(res=>{
        if(res.code == '500') {
          return Toast(res.msg)
        }
        Toast('短信发送成功')
        this.isSend = true;
        this.nodeLoginInfo.userId = res.userId;
        this.number = 179;
        this.timer = window.setInterval(() => {
          this.number = this.number - 1;
          if(this.number == 0) {
            clearInterval(this.timer);
            this.timer = null;
            this.isSend = false;
          }
        },1000)
      })
    },
    switchEye() { // 切换密码显示隐藏
      this.showPwd = !this.showPwd
    },
    sub() { // 提交
      if(this.password != this.newPassword) {
        return Toast('两次密码不一致，请重新输入')
      }
    }
  }
};
</script>

<style scoped lang="less" type="text/less">
@import "../assets/less/common.less";
.forgetPage-wrap {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 120 / @size;
  .formContainer {
    width: 100%;
    height: 200 / @size;
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
      color: #07c160;
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
}
</style>