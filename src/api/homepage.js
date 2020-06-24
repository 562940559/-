/**
  * 首页模块接口列表
  */

import axios from '@/utils/http'; // 导入http中创建的axios实例
import base from './base'; // 导入接口域名列表
import qs from 'qs';

const homepage = {
  applyConn(data) {
    // 推送一条消息
    return axios.post(`${base.baseUrl}/app/plateRecognition`, data)
  },
  refresh(data) {
    // 刷新数据
    return axios.post(`${base.baseUrl}/app/getInstitutionalVehicleFiles`, qs.stringify(data))
  },
  carDetailInfo(data) {
    // 获取车辆信息
    return axios.post(`${base.baseUrl}/app/cylinder/fillVerification`, qs.stringify(data))
  },
  deleteCarItem(data) {
    // 删除车辆
    return axios.post(`${base.baseUrl}/app/deleteLicense`, qs.stringify(data))
  },
  addCarItem(data) {
    // 手动添加车辆
    return axios.post(`${base.baseUrl}/app/addLicense`, qs.stringify(data))
  }
}

export default homepage;