<template>
  <div class="container">
    <TableSearchCard @handleSearch='handleSearch' />

    <div class="table-header">
      <a-button @click='handleOpenCreate' type="primary">新建</a-button>
      <div class="table-action">
        <a-tooltip placement="top">
          <template #title>
            <span>刷新</span>
          </template>
          <a-button @click="initData" type="text" shape="circle">
            <RemixIcon icon="refresh-line" />
          </a-button>
        </a-tooltip>
      </div>
    </div>
    <a-table :pagination="false" :scroll="{ x: 1500 }" :columns="columns" :row-key="(record: any) => record.id"
      :data-source="state.dataList" :loading="state.loading">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'avatar'">
          <span>
            <a-avatar :src="record.avatar">{{ record.username }}</a-avatar>
          </span>
        </template>
        <template v-if="column.dataIndex === 'nickname'">
          <span>
            {{ formatValue(record.nickname) }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'phone'">
          <span>
            {{ formatValue(record.phone) }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'email'">
          <span>
            {{ formatValue(record.email) }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'gender'">
          <span>
            {{ GenderEnum[record.gender] }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'createdAt'">
          <span>
            {{ formatDate(record.createdAt) }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'roles'">
          <span v-if="record.roles.length > 0">
            <a-tag style="margin: 5px" v-for="role in record.roles" :key="role.id" color="blue">{{ role.name }}</a-tag>
          </span>
          <span v-else> -- </span>
        </template>
        <template v-if="column.key === 'operation'">
          <span>
            <a @click='handleOpenEdit(record)'>编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm :title="`确定要删除${record.username}?`" ok-text="确定" cancel-text="取消"
              @confirm="handleDelete(record.id)">
              <a>删除</a>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a @click='handleOpenEdit(record)'>重置密码</a>
          </span>
        </template>
      </template>
    </a-table>
    <div class="pagination-card">
      <a-pagination v-model:current="state.pageNo" v-model:pageSize="state.pageSize" show-size-changer
        :total="state.total" :show-total="() => `共 ${state.total} 条`" @change="handleShowSizeChange" />
    </div>

    <UserModal :current-item="state.currentItem" v-model:modalVisible='state.modalVisible' @handleOk="handleOk" />
  </div>
</template>
<script setup lang="ts">
import TableSearchCard from "./components/TableSearchCard.vue";
import UserModal from './components/UserModal.vue'
import { createUser, delUsers, editUser, queryUserList } from "@/api/user";
import { onMounted, reactive } from "vue";
import { ICreateUserInput, IEditUserInput, IState, IUser, IUserActionModal } from "./data";
import type { TableColumnType } from "ant-design-vue";
import RemixIcon from "@/components/RemixIcon.vue";
import dayjs from "dayjs";
import { message } from "ant-design-vue";

enum GenderEnum {
  MALE = "男",
  FEMALE = "女",
  UNKNOWN = "未知",
}

const state = reactive<IState>({
  pageNo: 1,
  pageSize: 10,
  total: 10,
  dataList: [],
  loading: false,
  modalVisible: false,
  currentItem: {
    id: '',
    username: '',
    roles: []
  },
  searchParams: {
    username: '',
    phone: '',
    email: '',
    from: '',
    to: ''
  }
});

const columns: TableColumnType<IUser>[] = [
  {
    title: "用户名",
    fixed: "left",
    width: 100,
    align: "center",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "昵称",
    align: "center",
    dataIndex: "nickname",
    key: "nickname",
  },
  {
    title: "头像",
    align: "center",
    dataIndex: "avatar",
  },
  {
    title: "手机",
    align: "center",
    ellipsis: true,
    dataIndex: "phone",
  },
  {
    title: "邮箱",
    align: "center",
    ellipsis: true,
    dataIndex: "email",
  },
  {
    title: "性别",
    align: "center",
    dataIndex: "gender",
  },
  {
    title: "角色",
    align: "center",
    width: 300,
    dataIndex: "roles",
  },
  {
    title: "创建时间",
    align: "center",
    width: 160,
    dataIndex: "createdAt",
  },
  {
    title: "操作",
    width: 180,
    fixed: "right",
    key: "operation",
    align: "center",
  },
];

onMounted(() => {
  initData();
});

// 初始化数据
async function initData() {
  state.loading = true;
  const { pageNo, pageSize, searchParams } = state;
  const {
    getUserList: { data, totalCount },
  } = await queryUserList({
    pageNo,
    pageSize,
    includeRole: true,
    ...searchParams,
  });
  state.total = totalCount
  state.dataList = data as IUser[];
  state.loading = false;
};

// 格式化时间
function formatDate(date: string) {
  return dayjs(date).format("YYYY-MM-DD HH:mm");
};
// 格式化内容
function formatValue(value: string) {
  return value ? value : '--'
}
// 打开编辑
function handleOpenEdit(record: IUser) {
  state.currentItem = record
  state.modalVisible = true
}
// 打开创建
function handleOpenCreate() {
  state.currentItem = {} as any
  state.modalVisible = true
}
// 完成 创建/编辑 请求
async function handleOk(v: IUserActionModal) {
  let success;
  if (v.id) {
    success = await handleUpdate(v)
  } else {
    success = await handleCreate(v)
  }
  if (success) {
    state.modalVisible = false
    await initData()
  }
}

// 编辑请求
async function handleUpdate(v: IEditUserInput) {
  const loading = message.loading('加载中', 0);
  try {
    await editUser(v)
    loading()
    message.success('成功');
    return true
  } catch (e) {
    loading()
    return false
  }
}
// 创建请求
async function handleCreate(v: ICreateUserInput) {
  const loading = message.loading('加载中', 0);
  try {
    await createUser(v)
    loading()
    message.success('成功');
    return true
  } catch (e) {
    loading()
    return false
  }
}
// 删除请求
async function handleDelete(id: string) {
  const loading = message.loading('加载中', 0);
  try {
    await delUsers([id])
    loading()
    initData()
    message.success('成功');
    return true
  } catch (e) {
    loading()
    return false
  }
}
// 搜索回调
function handleSearch(v: any) {
  state.searchParams = v
  state.pageNo = 1
  state.pageSize = 10
  initData()
}
// 分页回调
function handleShowSizeChange(current: number, pageSize: number) {
  state.pageNo = current
  state.pageSize = pageSize
  initData()
}
</script>

<style lang="scss" scoped>
.search-card {
  margin-bottom: 16px;
  background: #fff;
}

.container {
  width: 100%;

  .table-header {
    height: 64px;
    padding: 16px 0;
    display: flex;
    justify-content: flex-end;
  }

  .table-action {
    display: flex;
    align-items: center;
    margin-left: 16px;
  }

  .pagination-card{
    height: 60px;
    width: 100%;
    background: #fff;
    margin: 10px 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 20px;
  }
}
</style>
