import { Modal, notification } from 'ant-design-vue'
import axios from 'axios'
import { getToken } from './auth'

export const baseURL = import.meta.env.VITE_BASE_URL
let authModal = false
const request = axios.create({
  baseURL,
  timeout: 50000,
})

request.interceptors.request.use((config) => {
  if (getToken())
    config.headers!.Authorization = `${getToken()}` as string
  return config
}, (err) => {
  return Promise.reject(err)
})

request.interceptors.response.use((response) => {
  const { data } = response
  handleServiceError(data)
  return data
}, (err) => {
  const { response } = err
  handleHttpError(response)
  return Promise.reject(err)
})

function handleHttpError(response: any) {
  const { status, data: { code, message } } = response
  if (status !== 200) {
    const msg = message
    notification.info({
      message: '提示',
      description: msg || '网络错误，请稍候再试',
    })
  }
}

function handleServiceError(data: any) {
  if (data.errors) {
    const { message, extensions: { code } } = data.errors[0]
    let msg = message
    if (code === 'UNAUTHENTICATED' || code === 401) {
      removeToken()
      msg = '登录已经过期，请重新登录'
      if (!authModal) {
        authModal = true
        Modal.success({
          title: 'tip',
          mask: false,
          content: '登录已经过期，请重新登录',
          onOk: () => {
            window.location.href = '/#/login'
          },
        })
      }
      return
    }
    if (code === 'NOT_PERMISSION')
      msg = '没有权限'

    if (code === 'INTERNAL_SERVER_ERROR')
      msg = '网络错误，请稍候再试'

    notification.info({
      message: '提示',
      description: msg || '网络错误，请稍候再试',
    })
    throw new Error(code || msg)
  }
}

export default request
