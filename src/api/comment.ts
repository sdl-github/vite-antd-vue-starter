import { mutation, query } from '@/utils/graphql'
import type { ModelTypes, ValueTypes } from '@/utils/graphql/zeus'

export function createComment(input: ModelTypes['CreateCommentInput']) {
  return mutation({
    createComment: [
      {
        input,
      },
      true,
    ],
  })
}
