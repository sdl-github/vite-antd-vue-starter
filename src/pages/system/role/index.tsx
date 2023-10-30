import type { TableColumnType } from 'ant-design-vue'
import {
  Button,
  Card,
  Divider,
  Input,
  Pagination,
  Popconfirm,
  Table,
  Tag,
  Tooltip,
  message,
} from 'ant-design-vue'
import type { Role, RoleUpdateInput, SearchParam } from './data'
import RoleModal from './components/RoleModal.vue'
import PermissionSelect from './components/PermissionSelect.vue'
import { deleteRole, queryRolePage, updateRole } from '@/api/role'

  <route lang="yaml">
    meta:
    layout: dashboard
  </route>

interface State {
  loading: boolean
  modalVisible: boolean
  permissionVisible: boolean
  data: Role[]
  currentItem: Role
  search: SearchParam
  total: number
}

function generateSearch() {
  const search: SearchParam = {
    pageNo: DEFAULT_PAGE_NO,
    pageSize: DEFAULT_PAGE_SIZE,
    name: '',
    key: '',
    sort: '',
  }
  return search
}

export default defineComponent({
  setup() {
    const state = reactive<State>({
      loading: false,
      modalVisible: false,
      permissionVisible: false,
      currentItem: {},
      data: [],
      search: generateSearch(),
      total: 0,
    })
    const columns: TableColumnType<Role>[] = [
      {
        title: '角色名称',
        fixed: 'left',
        align: 'center',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        sorter: true,
      },
      {
        title: '角色标识',
        align: 'center',
        dataIndex: 'key',
      },
      {
        title: '角色等级',
        align: 'center',
        dataIndex: 'level',
        customRender: ({ record }) => (
          <>
            <Tag color="#1677ff">{record.level}</Tag>
          </>
        ),
      },
      {
        title: '系统内建',
        align: 'center',
        dataIndex: 'default',
        customRender: ({ record }) => (
          <>
            {record.default
              ? <Tag color="#1677ff">是</Tag>
              : <Tag color="default">否</Tag>}
          </>
        ),
      },
      {
        title: '创建时间',
        align: 'center',
        dataIndex: 'createdAt',
        sorter: true,
      },
      {
        title: '操作',
        fixed: 'right',
        key: 'operation',
        align: 'center',
        customRender: ({ record }) => (
          <span>
            {!record.default && (
              <div>
                <a onClick={() => {
                  state.currentItem = record
                  state.modalVisible = true
                }}
                >
                  编辑
                </a>
                <Divider type="vertical"></Divider>
                <Popconfirm title={`确定要删除${record.name}?`} onConfirm={() => handleDelete(record.id!)}>
                  <a>删除</a>
                </Popconfirm>
                <Divider type="vertical"></Divider>
                <a onClick={() => {
                  state.currentItem = record
                  state.permissionVisible = true
                }}
                >
                  权限配置
                </a>
              </div>
            )}
          </span>
        ),
      },
    ]
    const { search } = toRefs(state)

    onMounted(() => {
      initData()
    })

    async function initData() {
      state.loading = true
      const { search } = state
      const res = await queryRolePage(search)
      const { content, totalElements } = res.queryRolePage!
      state.data = content as Role[]
      state.total = totalElements as number
      state.loading = false
    }

    function handleShowSizeChange(current: number, pageSize: number) {
      search.value.pageNo = current
      search.value.pageSize = pageSize
      initData()
    }

    // 搜索回调
    function handleSearch() {
      handleShowSizeChange(DEFAULT_PAGE_NO, DEFAULT_PAGE_SIZE)
    }

    function handleReset() {
      state.search = generateSearch()
      handleShowSizeChange(DEFAULT_PAGE_NO, DEFAULT_PAGE_SIZE)
    }
    async function handleDelete(id: string) {
      const loading = message.loading('加载中', 0)
      try {
        await deleteRole(id)
        loading()
        initData()
        message.success('成功')
        return true
      }
      catch (e) {
        loading()
        return false
      }
    }

    async function handleSetPermissions(params: RoleUpdateInput) {
      const loading = message.loading('加载中', 0)
      try {
        await updateRole(params)
        loading()
        initData()
        message.success('成功')
        return true
      }
      catch (e) {
        loading()
        return false
      }
    }
    return () => (
      <>
        <RoleModal
          open={state.modalVisible}
          currentItem={state.currentItem}
          onCancel={() => {
            state.modalVisible = false
          }}
          onOk={() => initData()}
        />
        <PermissionSelect
          visible={state.permissionVisible}
          currentRole={state.currentItem}
          onHandleCancel={() => {
            state.permissionVisible = false
          }}
          onHandleSave={(params: { id: string; menuIds: string[] }) => {
            handleSetPermissions(params)
          }}
        />
        <Card>
          <div class="flex">
            <Input
              value={search.value.name as string}
              placeholder="角色名称"
              class="w-200px"
              onChange={(e) => {
                search.value.name = e.target.value
              }}
            />
            <Input
              value={search.value.key as string}
              placeholder="角色标识"
              class="ml-4 w-200px"
              onChange={(e) => {
                search.value.key = e.target.value
              }}
            />
            <div class="ml-2 flex items-center">
              <Button class="flex items-center justify-end" icon={<div class="i-ri-search-line mr-2" />} loading={state.loading} type="primary" onClick={handleSearch}>查询</Button>
              <Button class="ml-10px" onClick={handleReset}>重置</Button>
            </div>
          </div>
        </Card>
        <div class="h-64px flex items-center justify-end px-16px">
          <Button
            onClick={() => {
              state.modalVisible = true
            }}
            type="primary"
          >
            新建

          </Button>
          <div class="ml-16px flex items-center">
            <Tooltip title="刷新">
              <Button onClick={initData} class="flex items-center justify-center" icon={<div class="i-ri-refresh-line" />} type="text" shape="circle"></Button>
            </Tooltip>
          </div>
        </div>
        <Table
          pagination={false}
          columns={columns}
          dataSource={state.data}
          loading={state.loading}
          onChange={(_p, _f, sorter: any) => {
            const sortType = {
              ascend: 'asc',
              descend: 'desc',
            }
            const { order, field } = sorter
            if (!order) {
              search.value.sort = ''
              initData()
              return
            }
            const sort = sortType[order as 'ascend' | 'descend']
            search.value.sort = `${field} ${sort}`
            initData()
          }}
        >
        </Table>
        <div class="my-10px h-60px w-full flex items-center justify-end rounded bg-white px-20px">
          <Pagination
            current={state.search.pageNo as number}
            pageSize={state.search.pageSize as number}
            total={state.total}
            showTotal={() => `共 ${state.total} 条`}
            onChange={handleShowSizeChange}
          >
          </Pagination>
        </div>
      </>
    )
  },
})
