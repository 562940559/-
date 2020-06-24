  <template>
  <!-- 充装记录 -->
  <div class="beforeFillingLog-wrap">
    <div class="line-wrap">
      <span>充装介质：</span>
      <van-radio-group v-model="formPara.fillingMedium" direction="horizontal">
        <van-radio name="CNG">CNG</van-radio>
        <van-radio name="LNG">LNG</van-radio>
      </van-radio-group>
    </div>
    <div class="line-wrap">
      <span>充装量：</span>
      <input
        type="text"
        placeholder="请输入充装量（KG）"
        onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')"
        v-model="formPara.fillingQuantity"
      />
    </div>
    <div class="img-wrap">
      <p>图片：</p>
      <van-uploader v-model="fileList1" multiple :max-count="1" />
    </div>
    <!-- 底部按钮组 -->
    <div class="bottom-wrap">
      <van-button type="info" size="small" @click="goFilling()">充装完成</van-button>
    </div>
  </div>
</template>

<script>
import * as $api from "@/api";
import { RadioGroup, Radio, Popup, Toast } from "vant";
import axios from "@/utils/http";
import base from "@/api/base";
export default {
  data() {
    return {
      fileList1: [],
      formPara: {
        id: localStorage.fillId, // 充装记录id
        proofImg: "", // 充装照片
        fillingQuantity: "", // 充装数量
        fillingMedium: "CNG" // 充装介质
      }
    };
  },
  created() {},
  mounted() {},
  methods: {
    routerBack() {
      this.$router.back("-1");
    },
    goFilling() {
      // 审核通过
      if (this.fileList1[0] == undefined) return Toast("图片未上传!");
      this.formPara.proofImg = this.fileList1[0].file;
      for (let a in this.formPara) {
        if (this.formPara[a] == "") {
          return Toast("请输入必填项！");
        }
      }
      var z_reg = /^\d+(\.\d+)?$/;
      if(!z_reg.test(this.formPara.fillingQuantity)) return Toast('请输入正确的充装数量')
      this.formPara.fillingQuantity = Number(this.formPara.fillingQuantity).toFixed(2)
      this.up();
    },
    up() {
      // 数据传输
      var formData = new FormData();
      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      formData.append("id", this.formPara.id);
      formData.append("proofImg", this.formPara.proofImg);
      formData.append("fillingQuantity", this.formPara.fillingQuantity);
      formData.append("fillingMedium", this.formPara.fillingMedium);
      axios
        .post(`${base.baseUrl}/app/cylinder/filling`, formData, config)
        .then(res => {
          if (res.code == "200") {
            Toast("处理成功");
            localStorage.fillId = res.fillId;
            return this.$router.replace("/recheckLog");
          }
        });
    }
  }
};
</script>

<style lang="less" type="text/less">
@import "../../assets/less/common.less";
.beforeFillingLog-wrap {
  .van-collapse-item__content {
    padding: 10 / @size 0 / @size;
  }
  .van-collapse {
    margin-bottom: 20 / @size;
  }
  .van-button--large {
    height: 100%;
  }
}
</style>
<style scoped lang="less" type="text/less">
@import "../../assets/less/common.less";
.beforeFillingLog-wrap {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  padding-top: 80 / @size;
  padding-bottom: 80 / @size;
  .line-wrap {
    width: 100%;
    height: 60 / @size;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;
    padding: 0 20 / @size;
    span {
      height: 60 / @size;
      line-height: 60 / @size;
      font-size: 22 / @size;
      font-weight: 600;
      float: left;
    }
    input {
      float: right;
      text-align: right;
      font-size: 20 / @size;
      height: 100%;
      box-sizing: border-box;
      border: none;
    }
    .van-radio-group {
      float: right;
      .van-radio {
        height: 60 / @size;
      }
      .van-radio:nth-child(1) {
        margin-right: 12 / @size;
      }
    }
  }
  .img-wrap {
    width: 100%;
    box-sizing: border-box;
    padding: 0 20 / @size 40 / @size 20 / @size;
    border-bottom: 1px solid #eee;
    p {
      height: 50 / @size;
      line-height: 50 / @size;
      font-size: 22 / @size;
      font-weight: 600;
    }
  }

  .bottom-wrap {
    height: 80 / @size;
    width: 100%;
    position: fixed;
    bottom: 0;
    background-color: #fff;
    color: #323232;
    font-family: SourceHanSansCN;
    font-size: 18 / @size;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding: 0 20 / @size;
    border-top: 1px solid #ccc;
    .van-button {
      margin: 0 20 / @size;
      padding: 0 20 / @size;
    }
  }
}
</style>