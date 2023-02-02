import request from '@/utils/request'

const resourceApi = {
  // 获取资源树形结构列表
  FetchResouceTree : '/lzy-service-system/resource/tree',
}

export default { resourceApi }

export function fetchResourceTree(data) {
  return request({
    url: resourceApi.FetchResouceTree,
    method: 'get',
    params: data
  })
}


