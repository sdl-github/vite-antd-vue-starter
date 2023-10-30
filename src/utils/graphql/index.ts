import request from '../request'
import { Thunder } from './zeus'

const thunder = Thunder(async (query) => {
  return new Promise((resolve, reject) => {
    request({
      url: '/graphql',
      method: 'POST',
      data: { query },
    }).then((res) => {
      resolve(res.data)
    }).catch((e) => {
      reject(e)
    })
  })
})

export const query = thunder('query')
export const mutation = thunder('mutation')
