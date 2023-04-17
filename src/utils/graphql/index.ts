import { Thunder } from './zeus'
import request from './request'

const thunder = Thunder(async (query) => {
  return new Promise((resolve) => {
    request({
      url: '/graphql',
      method: 'POST',
      data: { query },
    }).then((res) => {
      resolve(res.data)
    })
  })
})

export const query = thunder('query')
export const mutation = thunder('mutation')
