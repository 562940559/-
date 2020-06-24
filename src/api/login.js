/**
  * 登陆模块接口列表
  */

import axios from '@/utils/http'; // 导入http中创建的axios实例
import base from './base'; // 导入接口域名列表
import qs from 'qs';

const login = {
  passwordLogin(data) { // 密码登录
    return axios.post(`${base.baseUrl}/app/login`, qs.stringify(data));
  },
  getCode(data) { // 获取验证码
    return axios.post(`${base.baseUrl}/app/getVerificationCode`, qs.stringify(data))
  },
  codeLogin(data) { // 验证码登录
    return axios.post(`${base.baseUrl}/app/phoneLogin`, qs.stringify(data))
  }
}

export default login;