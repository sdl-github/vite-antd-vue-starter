import { mutation, query } from "@/utils/graphql";

export function listBuckets() {
  return query({
    listBuckets: {
      creationDate: true,
      name: true,
    },
  });
}

export function listObjects(bucketName: string) {
  return query({
    listObjects: [
      { bucketName },
      {
        name: true,
        url: true,
        lastModified: true,
        etag: true,
        prefix: true,
        size: true,
      },
    ],
  });
}
