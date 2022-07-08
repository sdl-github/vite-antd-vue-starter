import { mutation, query } from "@/utils/graphql";


export function listBuckets() {
    return query({
        listBuckets: {
            creationDate: true,
            name: true
        }
    })
}

