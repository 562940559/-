/**
 * 验证手机号
 * @param phone(String) 手机号
 * @returns {*}
 */
export const verifyPhoneNumber = function (phone) {
  const reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
  return reg.test(phone);
};

/**
 * 验证手机验证码
 * @param code(String) 验证码
 * @returns {*}
 */
export const verifyCode = function (code) {
  const reg = /^[1-9]\d*|0$/;
  return reg.test(code);
};

/**
 * 验证姓名
 * @param name(String) 姓名
 * @returns {*}
 */
export const nameValidate = function (name) {
  const reg = /^[a-zA-Z\u4e00-\u9fa5]+$/;
  return reg.test(name);
};


/**
 * 验证姓名(编辑地址处)
 * @param name(String) 姓名
 * @returns {*}
 */
export const newNameValidate = function (name) {
  const reg = /^(?![0-9]+$)[\u4E00-\u9FA5A-Za-z]{2,10}$/;
  return reg.test(name);
};

/**
 * 验证详细地址(编辑地址处)
 * @param address(String) 详细地址
 * @returns {*}
 */
export const addressValidate = function (address) {
  const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[\u4E00-\u9FA5A-Za-z0-9]{1,40}$/;
  return reg.test(address);
};

/**
 * 验证身份证号
 * @param code(String) 身份证
 * @returns {*}
 */
export const cardValidate = function (code) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return reg.test(code);
};

/**
 * 验证银行卡号
 * @param bankCode(String) 银行卡号
 * @returns {*}
 */
export const bankCodeValidate = function (bankCode) {
  const reg =  /^([1-9]{1})(\d{14}|\d{18})$/;
  return reg.test(bankCode);
};
