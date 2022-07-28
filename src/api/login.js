import request from '@/utils/request'

// url 常量
const userApi = {
  // 登录并生成token
  Login: '/lzy-oauth/oauth/token',
  // 退出登录
  Logout: '/lzy-oauth/oauth/logout',
  // 获取验证码类型
  CaptchaType: '/lzy-oauth/oauth/captcha/type',
  // 生成图片验证
  ImageCaptcha: '/lzy-oauth/oauth/captcha/image',
  // 获取用户信息
  UserInfo: '/lzy-system/account/user/info'
}

export default userApi

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login(data) {
  return request({
    url: userApi.Login,
    method: 'post',
    data
  })
}

export function logout (data) {
  return request({
    url: userApi.Logout,
    method: 'post',
    data
  })
}

export function getInfo () {
  return request({
    url: userApi.UserInfo,
    method: 'get'
  })
}

export function getCaptchaType () {
  return request({
    url: userApi.CaptchaType,
    method: 'get'
  })
}

export function getImageCaptcha () {
  return request({
    url: userApi.ImageCaptcha,
    method: 'get'
  })
}
