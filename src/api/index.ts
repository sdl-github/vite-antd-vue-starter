export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
  previousPage: number
  nextPage: number
  empty: boolean
}
