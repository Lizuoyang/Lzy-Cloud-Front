import request from '@/utils/request'

const roleApi = {
  // 获取角色列表
  FetchRoleList : '/lzy-service-system/role/list',
  // 获取全部角色
  FetchRoleAll: '/lzy-service-system/role/all',
  // 新增角色
  RoleCreate: '/lzy-service-system/role/create',
  // 修改角色
  RoleUpdate: '/lzy-service-system/role/update',
  // 修改角色状态
  RoleStatusUpdate: '/lzy-service-system/role/status/',
  // 删除角色
  RoleDelete: '/lzy-service-system/role/delete/',
}

export default { roleApi }

export function fetchRoleAll(query) {
  return request({
    url: roleApi.FetchRoleAll,
    method: 'get',
    params: query
  })
}

export function fetchRoleList(data) {
  return request({
    url: roleApi.FetchRoleList,
    method: 'get',
    params: data
  })
}

export function createRole(data) {
  return request({
    url: roleApi.RoleCreate,
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: roleApi.RoleUpdate,
    method: 'post',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: roleApi.RoleDelete + id,
    method: 'post',
  })
}

export function updateRoleStatus(roleId, status) {
  return request({
    url: roleApi.RoleStatusUpdate + roleId + '/' + status,
    method: 'post'
  })
}
