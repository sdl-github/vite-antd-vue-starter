
<template>
  <div class="container">
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
    <a-table
      :columns="columns"
      :row-key="(record) => record.id"
      :data-source="state.dataList"
      :loading="state.loading"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'avatar'">
          <span>
            <a-avatar :src="record.avatar">{{ record.username }}</a-avatar>
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
        <template v-if="column.key === 'operation'">
          <span>
            <a @click='handleOpenEdit'>编辑</a>
            <a-divider type="vertical" />
            <a>删除</a>
          </span>
        </template>
      </template>
    </a-table>

    <UserModal 
    :modalVisible='state.modalVisible'
    @handleModalVisible='(v) => {
      state.modalVisible = v
    }'
    />
  </div>
</template>
<script setup lang="ts">
import UserModal from './components/UserModal.vue'
import { queryUserList } from "@/api/user";
import { UserGenderEnum } from "@/utils/graphql/zeus";
import { onMounted, reactive } from "vue";
import { IState, IUser } from "./data";
import type { TableColumnType } from "ant-design-vue";
import RemixIcon from "@/components/RemixIcon.vue";
import dayjs from "dayjs";

const MALE = UserGenderEnum.MALE;
const FEMALE = UserGenderEnum.FEMALE;
const UNKNOWN = UserGenderEnum.UNKNOWN;
enum GenderEnum {
  MALE = "男",
  FEMALE = "女",
  UNKNOWN = "未知",
}

const state = reactive<IState>({
  pageNo: 1,
  pageSize: 10,
  dataList: [],
  loading: false,
  modalVisible: false,
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
    title: "创建时间",
    align: "center",
    dataIndex: "createdAt",
  },
  {
    title: "操作",
    width: 120,
    fixed: "right",
    key: "operation",
    align: "center",
  },
];

onMounted(() => {
  initData();
});

// 初始化数据
async function initData(params:type){
  state.loading = true;
  const { pageNo, pageSize } = state;
  const {
    getUserList: { data },
  } = await queryUserList({
    pageNo,
    pageSize,
    includeRole: true,
  });
  state.dataList = data as IUser[];
  state.loading = false;
};

function formatDate (date: string){
  return dayjs(date).format("YYYY-MM-DD HH:mm");
};

function handleOpenEdit () {
  state.modalVisible = true
}
function handleOpenCreate () {
  state.modalVisible = true
}
</script>

<style lang="scss" scoped>
.search-card {
  margin-bottom: 16px;
  background: #fff;
}
.container {
  width: 100%;
  background: #fff;
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
}
</style>
