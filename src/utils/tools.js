import md5 from 'js-md5';
import { SIGN_KEY } from './constant';

/**
 * 创建请求头sign
 * @param data(Object) 请求参数
 * @returns String
 */
export const createRequestSign = function (data) {
  const keyList = Object.keys(data).sort();
  let urlParams = '';
  const aa = keyList.filter(key => {
    if (data[key] != null && data[key] !== '') return key;
  });
  for (const key of aa) {
    urlParams += aa[aa.length - 1] !== key
      ? `${key}=${data[key]}&`
      : `${key}=${data[key]}`;
  }
  return md5(`${urlParams}&signKey=${SIGN_KEY}`);
};
/**
 * 对象转字符串并拼接为请求参数
 * @param data(Object) 要转换数据
 * @returns {*}
 */
export const objToUrlParams = function (data) {
  const keyList = Object.keys(data);
  let urlParams = '';
  for (const key in data) {
    urlParams += keyList[keyList.length - 1] !== key
      ? `${key}=${data[key]}&`
      : `${key}=${data[key]}`;
  }
  return urlParams;
};

/**
 * 图片压缩
 * @param file
 * @param callback
 * @returns {base64}
 */
export const imgResize = function (file, callback) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    const imgUse = new Image();
    imgUse.src = this.result;
    imgUse.onload = function () {
      const w = this.naturalWidth;
      const h = this.naturalHeight;
      let resizeW = this.naturalWidth;
      let resizeH = this.naturalHeight;
      const maxSize = { width: 1200, height: 1200, level: 0.9 }; // 大于最大值的做等比缩小
      if (w > maxSize.width || h > maxSize.height) {
        var multiple = Math.max(w / maxSize.width, h / maxSize.height);
        resizeW = w / multiple;
        resizeH = h / multiple;
      }
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (window.navigator.userAgent.indexOf('iPhone') > 0) {
        canvas.width = resizeH;
        canvas.height = resizeW;
        ctx.rotate(90 * Math.PI / 180);
        ctx.drawImage(imgUse, 0, -resizeH, resizeW, resizeH);
      } else {
        canvas.width = resizeW;
        canvas.height = resizeH;
        ctx.drawImage(imgUse, 0, 0, resizeW, resizeH);
      }
      const base64 = canvas.toDataURL('image/jpeg', maxSize.level);
      return callback(base64);
    };
  };
};

/**
 * base64转file
 * @param dataUrl
 * @param filename
 * @returns {file}
 */
export const dataURLtoFile = function (dataUrl, filename) {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

/**
 * dataURL to blob
 * @param dataURI
 * @returns {Blob}
 */
export const dataURItoBlob = function (dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};
