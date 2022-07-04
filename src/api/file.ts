import { mutation, query } from "@/utils/graphql";


export function listBuckets() {
    return query({
        listBuckets: {
            code: true,
            msg: true,
            data: {
                creationDate: true,
                name: true
            }
        }
    })
}

