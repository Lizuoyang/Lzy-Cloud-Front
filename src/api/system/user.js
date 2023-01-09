import request from '@/utils/request'

const userApi = {
  // 获取用户信息
  UserInfo: '/lzy-system/account/user/info',
  // 修改用户信息（限制部分字段）
  UserInfoUpdate: '/lzy-service-system/user/update/info',
  // 新增用户
  UserCreate: '/lzy-service-system/user/create',
  // 修改用户
  UserUpdate: '/lzy-service-system/user/update',
  // 修改用户状态
  UserStatusUpdate: '/lzy-service-system/user/status/',
  // 删除用户
  UserDelete: '/lzy-service-system/user/delete/',
  // 获取用户列表
  FetchUserList: '/lzy-service-system/user/list',
  // 获取角色列表
  FetchRoleList: '/lzy-service-system/role/all',
  // 导出用户列表
  ExportUserList: '/lzy-excel-operate/export/system/user/list'

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

export function updateUser(data) {
  return request({
    url: userApi.UserUpdate,
    method: 'post',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: userApi.UserDelete + id,
    method: 'post',
  })
}

export function updateStatus(userId, status) {
  return request({
    url: userApi.UserStatusUpdate  + userId + '/' + status,
    method: 'post',
  })
}

export function exportUserList(data) {
  return request({
    url: userApi.ExportUserList,
    method: 'get',
    responseType: 'blob',
    params: data
  })
}
