<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">LZY CLOUD</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="captchaVerify"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-row :gutter="5" v-if="loginCaptchaType === 'image'">
        <el-col :span="17">
          <el-form-item prop="captchaCode">
            <span class="svg-container">
              <svg-icon icon-class="captcha-code" />
            </span>
            <el-input
              v-model="loginForm.captchaCode"
              placeholder="验证码"
              name="captchaCode"
              type="text"
              tabindex="3"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <img
            :src="captchaImage"
            class="v-code-img"
            @click="refreshImageCode"
          >
        </el-col>
      </el-row>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="captchaVerify">登录</el-button>

      <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: any</span>
      </div>

    </el-form>
    <Verify
      ref="verify"
      :mode="'pop'"
      :captcha-type="'blockPuzzle'"
      :img-size="{ width: '330px', height: '155px' }"
      @success="verifySuccess"
    />
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import {} from '@/api/login'
import Verify from '@/components/Verifition'
import {getCaptchaType, getImageCaptcha} from '@/api/login'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入账号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入不小于6位的密码'))
      } else {
        callback()
      }
    }
    const validateVCode = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('请输入图片验证码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '123456',
        captchaCode: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        captchaCode: [{ required: true, trigger: 'blur', validator: validateVCode }],
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      grantType: 'password',
      loginCaptchaType: 'sliding',
      captchaKey: '',
      captchaImage: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAEALAAAAAABAAEAAAICRAEAOw=='
    }
  },
  components: {Verify},
  created() {
    this.queryCaptchaType()
    // window.addEventListener('storage', this.afterQRScan)
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    queryCaptchaType(){
      getCaptchaType().then(res => {
        this.loginCaptchaType = res.data
        if (this.loginCaptchaType === 'image') {
          this.refreshImageCode()
        }
      })
    },
    refreshImageCode() {
      getImageCaptcha().then(res => {
        const data = res.data
        this.captchaKey = data.captchaKey
        this.captchaImage = data.captchaImage
      })
    },
    verifySuccess(params) {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.loginForm.grant_type = 'captcha'
          // this.loginForm.grant_type = this.grantType
          this.loginForm.client_id = process.env.VUE_APP_CLIENT_ID
          this.loginForm.client_secret = process.env.VUE_APP_CLIENT_SECRET

          // 判断是图片验证码还是滑动验证码
          if (this.loginCaptchaType === 'image') {
            this.loginForm.captcha_type = 'image'
            this.loginForm.captcha_key = this.captchaKey
            this.loginForm.captcha_code = this.loginForm.captchaCode
          } else {
            delete this.loginForm.captchaCode
            this.loginForm.captcha_verification = params.captchaVerification
          }
          console.log("params: ", this.loginForm)
          this.$store
            .dispatch('user/loginByPassword', this.loginForm)
            .then(() => {
              this.loading = false
              this.$router.push({ path: this.redirect || '/' })
            })
            .catch(() => {
              this.loading = false
            })


        } else {
          console.log('登录失败')
          return false
        }
      })
    },
    captchaVerify(e) {
      e.preventDefault()
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          if (this.loginCaptchaType === 'sliding') {
            this.$refs.verify.show()
          } else {
            this.verifySuccess()
          }
        } else {
          setTimeout(() => {
            this.loading = false
          }, 600)
        }
      })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.loginForm.grant_type = this.grantType
          this.loginForm.client_id = process.env.VUE_APP_CLIENT_ID
          this.loginForm.client_secret = process.env.VUE_APP_CLIENT_SECRET
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .v-code-img {
    margin-top: 0.5px;
    height: 51px;
    float: right;
    width: 98%;
    border-radius: 5px;
    cursor: pointer;
    opacity: 0.8;
    filter: alpha(opacity=60);
  }
}
</style>
