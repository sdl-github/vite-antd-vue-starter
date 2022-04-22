import { Thunder } from './zeus'
import request from './request';

const thunder = Thunder(async (query) => {
    return request({
        method: 'POST',
        data: { query}
    })
})

export const query = thunder('query');
export const mutation = thunder('mutation');