import { mutation, query } from '@/utils/graphql'
import type { ModelTypes } from '@/utils/graphql/zeus'

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
  return mutation({
    createTodo: [
      {
        input,
      },
      {
        id: true,
      },
    ],
  })
}

export function updateTodo(input: ModelTypes['UpdateTodoInput']) {
  return mutation({
    updateTodo: [
      {
        input,
      },
      {
        id: true,
      },
    ],
  })
}

export function deleteTodo(id: string) {
  return mutation({
    deleteTodo: [{ id }, true],
  })
}
