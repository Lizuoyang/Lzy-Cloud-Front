import request from '@/utils/request'

const userApi = {
  // 获取用户信息
  UserInfo: '/lzy-system/account/user/info',
  // 修改用户信息
  UserUpdate: '/lzy-service-system/user/update/info',
  // 获取用户列表
  FetchUserList: '/lzy-service-system/user/list',
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

export function fetchUserList(query) {
  return request({
    url: userApi.FetchUserList,
    method: 'get',
    params: query
  })
}
