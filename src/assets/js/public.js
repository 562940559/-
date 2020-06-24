import axios from 'axios';
import md5 from 'js-md5';
import MobileDetect from 'mobile-detect'//导入文件
var common = {
  basics: {
    isNull (o) {
      if (!o || o === 'null' || o === 'undefined' || o === 'false' || o === 'NaN') return true
      return false;
    },
    isObj (o) { // 是否对象
      return Object.prototype.toString.call(o).slice(8, -1) === 'Object'
    },
    isArray (o) { // 是否数组
      return Object.prototype.toString.call(o).slice(8, -1) === 'Array'
    },
    isArrNull (o) {
      return o.length === 0;
    },
    isFunction (o) { // 是否函数
      return Object.prototype.toString.call(o).slice(8, -1) === 'Function'
    },
    isString (o) { // 是否字符串
      return Object.prototype.toString.call(o).slice(8, -1) === 'String'
    },
    objMosaic () { // 对象拼接
      var obj = {};
      for (var i = 0; i < arguments.length; i++) {
        for (var key in arguments[i]) {
          obj[key] = arguments[i][key];
        }
      }
      return obj;
    },
    objBetween(obj, objAttr, str) {
      for(var i in obj) {
        if(obj[i][objAttr] == str) {
          return true;
        }
      }
    }
  },
  route: {
    picturesLinking () {
      return common.Storage.readCaching().imgAddress;
    }
  },
  methods: {
    /**
     * 创建请求头sign
     * @param data(Object) 请求参数
     * @returns String
     */
    createRequestSign (data) {
      const keyList = Object.keys(data).sort();
      let urlParams = '';
      const sortKey = keyList.filter(key => {
        if (data[key] != null && data[key] !== '') return key;
      });
      for (const key of sortKey) {
        urlParams += sortKey[sortKey.length - 1] !== key
          ? `${key}=${data[key]}&`
          : `${key}=${data[key]}`;
      }
      return md5(`${urlParams}&signKey=${common.signKey}`);
    },
    // 图路径替换
    picturePath(picturePath) {
      if (!common.basics.isNull(picturePath)) {
        picturePath = picturePath.replace(/\/upload/g, common.route.picturesLinking() + "/upload");
      }
      return picturePath;
    },
   // 图片上传
    pictureUploading (opinion) {
      Indicator.open('加载中...');
      let param = new FormData(); // 创建form对象
      if (!common.basics.isNull(opinion.file)) {
        for (var i in opinion.file) {
          param.append(opinion.file[i].pictureName, opinion.file[i].fileChild, opinion.file[i].name);
        }
        // //通过append向form对象添加数据
      }
      param.get('file'); // FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }; // 添加请求头
      for (var i in common.Storage.getLocal('user')) {
        param.append(i, common.Storage.getLocal('user')[i]);
      }
      if (!common.basics.isNull(opinion.param)) {
        for (var i in opinion.param) {
          param.append(i, opinion.param[i]);
        }
      }

      // this.http.userCertificate.updateCertificate
      axios.post(opinion.Interface, param, config)
        .then(res => {
          Indicator.close();
          if (res.data.status == 0) {
            opinion.success(res.data);
          } else {
            Toast(res.data.msg);
          }
        }, error => {
          Indicator.close();
          Toast('网络错误');
        })
    },
    //判断设备类型 ios 等
    chkDevice() {
      var u = navigator.userAgent, app = navigator.appVersion;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

      return isAndroid === true ? 'Android' : 'IOS';
    },

    //判断浏览器类型
    chkUseragent () {
      var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
      var md = new MobileDetect(userAgent);
      return md.userAgent() + '.' + md.versionStr('Build');
    },

    // 图片在线预览
    pictureOnlineLook(event) {
      var size = (event.target.files[0].size / 1024).toFixed(2);
      if (common.config.uploadImgSize < size) {
        Toast('图片过大，请上传图片小于' + common.config.uploadImgSize + 'kb');
        return false;
      } else {
        let file = event.target.files[0];
        window.URL = window.URL || window.webkitURL;
        let imgSrc = window.URL.createObjectURL(file);
        var obj = {
          file: file,
          imgSrc: imgSrc
        }
        return obj;
      }

    },
    /*去掉下划线并大写*/
    caseAndCase (field) {
      if (!common.basics.isNull(field)) {
        return field = field.replace(/\_\w/g, function (letter, position) {
          letter = letter.replace(/\_/g, '');
          return letter.toUpperCase();
        });
      }

    },
    //渠道截取
    channelInterception() {
      var regExp = new RegExp("\/.*#", 'g');
      var a = window.location.href;
      var test = regExp.exec(a)[0];
      var reg2 = /([?][^?]+)$/;
      if (!common.basics.isNull(test.match(reg2))) {
        test = test.replace(test.match(reg2)[0], '');
      }
      for (var i = 0; i < test.length; i++) {
        var urlTest = test[test.length - (i + 1)];
        if (urlTest == '/') {
          return test.replace(test.substring(0, test.length - i), '').replace('#', '');
          break;
        }
      }
    }, //操作系统
    deepClone(obj) { //深拷贝
      let objClone = Array.isArray(obj) ? [] : {};
      if (obj && typeof obj === "object") {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            //判断ojb子元素是否为对象，如果是，递归复制
            if (obj[key] && typeof obj[key] === "object") {
              objClone[key] = this.deepClone(obj[key]);
            } else {
              //如果不是，简单复制
              objClone[key] = obj[key];
            }
          }
        }
      }
      return objClone;
    }
  },
  picture: {
    photoCompress(event, w, objDiv) {
      var file = event.target.files[0];
      var ready = new FileReader();
      /*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
      ready.readAsDataURL(file);
      ready.onload = function () {
        var re = this.result;
        common.picture.canvasDataURL(re, w, objDiv)
      }
    },

    canvasDataURL(path, obj, callback) {
      var arr = path.split(','),
        mime = arr[0].match(/:(.*?);/)[1];
      var img = new Image();
      img.src = path;
      img.onload = function () {
        var that = this;
        // 默认按比例压缩
        var w = that.width,
          h = that.height,
          scale = w / h;
        w = obj.width || w;
        h = obj.height || (w / scale);
        var quality = 0.7; // 默认图片质量为0.7
        //生成canvas
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        // 创建属性节点
        var anw = document.createAttribute("width");
        anw.nodeValue = w;
        var anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, w, h);
        // 图像质量
        if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
          quality = obj.quality;
        }
        // quality值越小，所绘制出的图像越模糊
        var base64 = canvas.toDataURL(mime, quality);
        // 回调函数返回base64的值
        callback(base64);
      }
    },
    /**
     * 将以base64的图片url数据转换为Blob
     * @param urlData
     *            用url方式表示的base64图片数据
     */
    convertBase64UrlToBlob(urlData) {
      var arr = urlData.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {
        type: mime
      });
    },

  },
  toJSON(obj) {
    if (!obj) return false;
    Object.keys(obj).map(item => {//将后台数据转换成对象
      try {
        obj[item] = JSON.parse(obj[item]);
      } catch (e) {
      }
    });
    return obj;
  }
};
common.install = function (Vue, options) {
  Vue.prototype.common = common;
  Vue.prototype.$ajax = common.ajax;
};

export default common;
