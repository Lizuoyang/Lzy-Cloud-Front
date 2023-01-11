import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // 请求超时时间
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
    }
    // 请求头配置租户ID
    config.headers['TenantId'] = process.env.VUE_APP_TENANT_ID
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // console.log('response: ',response)
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200 && response.status !== 200) {
      // 102：登录超时
      if (res.code === 102) {
        Message({
          message: '登录超时，请重新登录',
          type: 'error',
          duration: 5 * 1000
        })
      } else if (res.code === 403) { // 403：没有权限
        MessageBox.confirm('您没有权限执行此操作', '没有权限', {
          cancelButtonText: '取消',
          type: 'warning'
        })
      } else if (res.code === 503) { // 503：服务下线
        MessageBox.confirm('系统升级中，请稍后再试', '系统升级', {
          cancelButtonText: '取消',
          type: 'warning'
        })
      } else {
        Message({
          message: res.msg,
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject(res).catch(()=>{})
    } else {
      return response.data
    }
  },
  error => {
    console.log(JSON.stringify(error.response)) // for debug
    Message({
      message:  error.response.data.msg || error,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
