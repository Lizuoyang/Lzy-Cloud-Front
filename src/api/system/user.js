import request from '@/utils/request'

const userApi = {
  // 获取用户信息
  UserInfo: '/lzy-system/account/user/info',
  // 修改用户信息
  UserInfoUpdate: '/lzy-service-system/user/update/info',
  // 新增用户
  UserCreate: '/lzy-service-system/user/create',
  // 获取用户列表
  FetchUserList: '/lzy-service-system/user/list',
  // 获取角色列表
  FetchRoleList: '/lzy-service-system/role/all'
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
    url: userApi.UserInfoUpdate,
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

export function fetchRoleList(query) {
  return request({
    url: userApi.FetchRoleList,
    method: 'get',
    params: query
  })
}

export function createUser(data) {
  return request({
    url: userApi.UserCreate,
    method: 'post',
    data
  })
}
