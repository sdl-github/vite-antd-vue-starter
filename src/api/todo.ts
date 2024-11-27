import { mutation, query } from '@/utils/graphql'
import type { ModelTypes } from '@/utils/graphql/zeus'
import request from '~/utils/request'

export function queryTodoPage(specification: ModelTypes['QueryTodoPageSpecificationInput']) {
  return query({
    queryTodoPage: [{ specification }, {
      content: {
        id: true,
        icon: true,
        title: true,
        content: true,
        sort: true,
        planDate: true,
        warnDate: true,
        doneDate: true,
        createdAt: true,
        user: {
          avatar: true,
          userName: true,
        },
      },
      totalElements: true,
      hasNext: true,
    }],
  })
}

export function createTodo(input: ModelTypes['CreateTodoInput']) {
  return request({
    url: '/todo/create',
    method: 'post',
    data: input,
  })
}

export function updateTodo(input: ModelTypes['UpdateTodoInput']) {
  return request({
    url: '/todo/update',
    method: 'post',
    data: input,
  })
}

export function deleteTodo(id: string) {
  return mutation({
    deleteTodo: [{ id }, true],
  })
}
