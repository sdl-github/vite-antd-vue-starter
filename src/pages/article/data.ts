import type { TableColumnType } from 'ant-design-vue'
import { ArticleStatusEnum, type ModelTypes, type ValueTypes } from '@/utils/graphql/zeus'

export type QueryArticlePageSpecificationInput = ModelTypes['QueryArticlePageSpecificationInput']
export type Article = ModelTypes['Article']

export type CreateArticleInput = ModelTypes['CreateArticleInputInput']
export type UpdateArticleInput = ModelTypes['UpdateArticleInputInput']
export const ArticleStatusList = [
  {
    label: '草稿',
    value: ArticleStatusEnum.DRAFT,
  },
  {
    label: '已发布',
    value: ArticleStatusEnum.PUBLISHED,
  },
]

export const ArticleStatus = Object.fromEntries(
  ArticleStatusList.map(({ label, value }) => [value, label]),
)

export function generateSearch() {
  const search: QueryArticlePageSpecificationInput = {
    pageNo: DEFAULT_PAGE_NO,
    pageSize: DEFAULT_PAGE_SIZE,
    title: '',
    markdown: '',
    sort: '',
    categoryId: undefined,
  }
  return search
}
export interface State {
  loading: boolean
  modalVisible: boolean
  data: Article[]
  currentItem: Article | null
  search: QueryArticlePageSpecificationInput
  total: number
}
export const columns: TableColumnType<Article>[] = [
  {
    title: '标题',
    fixed: 'left',
    align: 'center',
    dataIndex: 'title',
    key: 'title',
    ellipsis: true,
    sorter: true,
  },
  {
    title: '副标题',
    align: 'center',
    dataIndex: 'metaTitle',
    key: 'metaTitle',
  },
  {
    title: '分类',
    align: 'center',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: '图片',
    align: 'center',
    dataIndex: 'image',
    key: 'image',
  },
  {
    title: '描述',
    align: 'center',
    dataIndex: 'metaDescription',
    key: 'metaDescription',
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  {
    title: '发布时间',
    align: 'center',
    dataIndex: 'publishedAt',
    key: 'publishedAt',
  },
]
