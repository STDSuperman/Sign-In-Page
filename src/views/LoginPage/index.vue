<template>
  <div id="Login">
    <div class="main">
      <div class="title">系统登录</div>
      <el-form :model="form" :rules="rules" ref="formRule">
        <el-form-item prop="phoneNumber">
          <el-input placeholder="请输入手机号码" v-model="form.phoneNumber" class="input-with-select">
            <el-select class="area-select" v-model="form.areaCode" slot="prepend">
              <el-option
                v-for="(item,index) in areaCodeList"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item prop="verificationCode">
          <el-input placeholder="验证码" v-model="form.verificationCode" class="input-with-select">
            <span
              v-if="!isClickVerify"
              class="verification-code"
              slot="append"
              @click="getVerificationCode"
            >{{getVerifiCationText}}</span>
            <span v-else slot="append" class="verification-code-count">重发验证码({{countDown}}s)</span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :show-password="showPassword"
            placeholder="密码(不少于6位)"
            v-model="form.password"
            class="input-with-select"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn" @click="sumitData">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import area_data from "../../utils/AreaCode";
import { getVerifiCationData, submit } from "../../api/LoginApi";
const telReg = /^1([38][0-9]|4[579]|5[0-35-9]|6[6]|7[0135678]|9[89])\d{8}$/;
export default {
  name: "Login",
  data() {
    /**手机号校验 */
    const telValidate = (rule, value, callback) => {
      if (telReg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的手机号码格式"));
      }
    };

    /**验证验证码正确性 */
    const checkVerificationCode = (rule, value, callback) => {
      if (value === this.realVerification) {
        callback();
      } else {
        callback(new Error("验证码有误"));
      }
    };
    return {
      /**用户输入的表单数据 */
      form: {
        areaCode: "+86", // 地区代码;如：+86
        phoneNumber: "", // 电话号码
        verificationCode: "", // 验证码
        password: "" //密码
      },
      realVerification: null, //后台返回的正确的验证码
      showPassword: true, //是否显示密码
      isClickVerify: false, // 用户是否点击获取验证码
      countDown: 60, //倒计时秒数
      getVerifiCationText: "点击获取验证码", //获取验证码按钮文字
      /**统一校验规则 */
      rules: {
        phoneNumber: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          { validator: telValidate, trigger: "blur" }
        ],
        verificationCode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { validator: checkVerificationCode, trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码位数不得小于6位", trigger: "blur" }
        ]
      },
      areaCodeList: ["+86"] //可选地区代码类型集合
    };
  },
  methods: {
    /**获取验证码处理函数 */
    getVerificationCode() {
      if (telReg.test(this.form.phoneNumber)) {
        getVerifiCationData()
          .then(res => {
            /**
             * 如果请求成功，禁用获取验证码按钮并进行倒计数
             * 倒计时结束让按钮能重新获取并清楚定时器
             */
            this.isClickVerify = true;
            if (res.code === 200) {
              this.realVerification = this.form.verificationCode =
                res.data.captcha;
              let flag = setInterval(() => {
                if (!this.countDown--) {
                  this.countDown = 60;
                  clearInterval(flag);
                  this.isClickVerify = false;
                }
              }, 1000);
            }
          })
          .catch(e => {
            this.$message({
              type: "error",
              message: "网络堵塞了"
            });
            this.getVerifiCationText = "重新获取";
          });
      } else {
        this.$message({
          type: "warning",
          message: "请确认手机号码格式是否正确"
        });
      }
    },
    /**提交登录 */
    sumitData() {
      this.$refs.formRule.validate(value => {
        if (value) {
          /**组装接口所需数据 */
          let formData = {
            phone: this.form.phoneNumber,
            captcha: this.form.verificationCode
          };
          /**调用api请求方法并传入数据 */
          submit(formData).then(res => {
            if (res.data && res.data.success) {
              /**登录成功清空输入数据 */
              this.$refs.formRule.resetFields();
              /**清除引用，方便GC */
              formData = null;
              /**登录成功跳转到笔者的个人博客^o^哈哈哈哈 */
              window.location.href = "https://xhlqrn.xyz";
            }
          });
        } else {
          this.$message({
            type: "warning",
            message: "校验未通过"
          });
        }
      });
    }
  },
  created() {
    /**获取所有国家电话前缀 */
    this.areaCodeList = Object.values(area_data);
  }
};
</script>

<style lang="scss">
* {
  padding: 0px;
  margin: 0px;
}
#Login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: #2d3a4b;
  //   background-position: center center;
  //   background-size: cover;
  color: #eee;

  .main {
    width: 400px;
    height: 300px;
    opacity: 0.9;
    margin: 0px 20px;
    margin-top: -100px;
    animation: identifier 0.8s ease;
    // border: solid #ccc 1px;
    @keyframes identifier {
      from {
        opacity: 0;
        transform: scale(0.1);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    .title {
      color: #fff;
      font-weight: bold;
      font-size: 30px;
      text-align: center;
      height: 100px;
    }

    .el-form-item {
      border: 1px solid hsla(0, 0%, 100%, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }

    .el-input__inner {
      border-radius: 4px;
      border: 1px solid #606266;
      color: #fff;
    }

    .el-input-group__append,
    .el-input-group__prepend {
      background-color: transparent;
      border: none;
      color: #fff;
    }

    .area-select {
      width: 110px;
      background-color: transparent;
    }

    .verification-code {
      color: #3a8ee6;
      width: 30px;
      cursor: pointer;
      &:hover {
        color: #4393e7;
        user-select: none;
      }
    }

    .verification-code-count {
      color: #999;
      width: 30px;
      cursor: not-allowed;
      user-select: none;
    }

    .btn {
      width: 100%;
    }

    .el-input,
    .el-input__inner {
      height: 50px;
      background-color: transparent;
    }
  }
}
</style>