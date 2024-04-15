import { mutation, query } from '@/utils/graphql'
import type { ModelTypes, ValueTypes } from '@/utils/graphql/zeus'

export function queryActivityPage(specification: ValueTypes['QueryActivityPageSpecificationInput']) {
  return query({
    queryActivityPage: [{ specification }, {
      content: {
        id: true,
        title: true,
        image: true,
        metaTitle: true,
        metaDescription: true,
        createdAt: true,
        publishedAt: true,
        status: true,
      },
      totalElements: true,
      hasNext: true,
    }],
  })
}



export function createActivity(input: ValueTypes["CreateActivityInputInput"]) {
  return mutation({
    createActivity: [
      { input }, {
        id: true
      }
    ]
  })
}


export function updateActivity(input: ValueTypes["UpdateActivityInputInput"]) {
  return mutation({
    updateActivity: [
      { input }, {
        id: true
      }
    ]
  })
}


export function delActivity(id: string) {
  return mutation({
    deleteActivity: [{ id }, true]
  })
}

export function queryActivity(id: string) {
  return query({
    queryActivity:[{id},{
      id: true,
      title: true,
      image: true,
      metaTitle: true,
      metaDescription: true,
      status: true,
      html: true,
      markdown: true,
    }]
  })
}

export function publishActivity(id: string) {
  return mutation({
    publishActivity: [{ id }, true]
  })
}

export function unpublishActivity(id: string) {
  return mutation({
    unpublishActivity: [{ id }, true]
  })
}