/**
  * 充装流程模块接口列表
  */

 import axios from '@/utils/http'; // 导入http中创建的axios实例
 import base from './base'; // 导入接口域名列表
 import qs from 'qs';
 
 const fillingProgress = {
   upFillingLog(data) {
     // 充装前检查
     return axios.post(`${base.baseUrl}/app/cylinder/fillingInspection`, qs.stringify(data))
   },
 }
 
 export default fillingProgress;