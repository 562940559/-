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
