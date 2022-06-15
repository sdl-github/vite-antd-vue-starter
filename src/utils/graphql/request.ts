import { notification } from 'ant-design-vue';
import axios from 'axios';
import { getToken, removeToken } from '../auth';
const baseURL = 'http://101.35.96.91:2333/graphql';
// const baseURL = 'http://localhost:2333/graphql';

const request = axios.create({
    baseURL,
    timeout: 5000
})

request.interceptors.request.use(config => {
    if (getToken()) {
        config.headers!['Authorization'] = 'Bearer ' + getToken() as string
    }
    return config
},
    err => {
        return Promise.reject(err);
    }
)

request.interceptors.response.use(response => {
    const { data } = response
    handleError(data)
    return data.data
},
    err => {
        const { response: { data } } = err
        handleError(data)
        return Promise.reject(err)
    }
)

function handleError(data: any) {
    if (data.errors) {
        console.debug('thunder data.errors', data.errors);
        const { code, message } = data.errors[0]
        let msg = message
        if (code === 'UNAUTHENTICATED') {
            removeToken()
            msg = '登录已经过期，请重新登录';
        }
        if (code === 'NOT_PERMISSION') {
            msg = '没有权限';
        }
        if (code === 'INTERNAL_SERVER_ERROR') {
            msg = '网络错误，请稍候再试'
        }
        notification.info({
            message: '提示',
            description: msg || "网络错误，请稍候再试",
        });
        throw new Error(msg);
    }
}

export default request