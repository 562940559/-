/**
  * 接口域名的管理
  */

let base = {
  baseUrl: '',
  connectUrl: '',
}
let localEdition = function () { // 本地接口
  base.baseUrl = '',
  base.connectUrl = 'http://tfxq.aiaudit.cn:9005/app/endpoint-websocket'
}
let testEdition = function () { // 测试接口
  base.baseUrl = 'http://tfxq.aiaudit.cn:9005',
  base.connectUrl = 'http://tfxq.aiaudit.cn:9005/app/endpoint-websocket'
};
let formalEdition = function () { // 正式接口
  base.baseUrl = 'https://zhjj.cdaudit.cn:9010',
  base.connectUrl = 'http://tfxq.aiaudit.cn:9005/app/endpoint-websocket'
}

testEdition() // 运行环境

export default base;