import request from '@/utils/request'

const userApi = {
  // 获取用户信息
  UserInfo: '/lzy-system/account/user/info',
  // 修改用户信息
  UserUpdate: '/lzy-service-system/user/update/info'
}

export default {userApi}

export function queryUserInfo(data) {
  return request({
    url: userApi.UserInfo,
    method: 'get',
    data
  })
}

export function updateUserInfo(data) {
  return request({
    url: userApi.UserUpdate,
    method: 'post',
    data
  })
}
