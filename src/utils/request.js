import axios from 'axios'
import { Message } from 'element-ui'

// create an axios instance
const service = axios.create({
  // baseURL: '/cgi-bin/tt', // url = base url + request url
  baseURL: '/api', // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 3000 // request timeout
})

const LOGIN_AGAIN_REPLY_CODE = 2001;
const NO_RIGHT_ACCESS_SYSTEM = 2002;
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
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
    const res = response.data;
    console.log('response:' + JSON.stringify(res));
    if (res.replyCode === LOGIN_AGAIN_REPLY_CODE) {
      window.location.href = 'http://ssa.jd.com/sso/login?ReturnUrl=' + encodeURIComponent('http://login.tool.jd.com');
    } else if (res.replyCode === NO_RIGHT_ACCESS_SYSTEM) {
      Message({
        message: '权限不足，请联系管理员添加。',
        type: 'error'
      })
    } else if (res.replyCode !== 0) {
      Message({
        message: res,
        type: 'error'
      })
    }
    return res
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
