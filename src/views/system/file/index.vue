<template>
  <div class="file-container">
    <div class="table-header">
      <a-button @click='handleOpenUpload' type="primary">
        <template #icon>
          <icon>
            <template #component>
              <RemixIcon icon="upload-cloud-line" />
            </template>
          </icon>
        </template>
        <span>上传</span>
      </a-button>
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
        <template v-if="column.key === 'operation'">
          <span>
            <a-divider type="vertical" />
            <a-popconfirm :title="`确定要删除${record.username}?`" ok-text="确定" cancel-text="取消">
              <a>删除</a>
            </a-popconfirm>
            <a-divider type="vertical" />
          </span>
        </template>
      </template>
    </a-table>
    <UploadModal v-model:modalVisible='state.modalVisible' />
  </div>
</template>

<script setup lang='ts'>
import { onMounted, reactive } from 'vue';
import { getFileList } from '@/api/file';
import UploadModal from './components/UploadModal.vue'
import RemixIcon from '@/components/RemixIcon.vue'
import Icon from '@ant-design/icons-vue';
const state = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0,
  dataList: [],
  loading: false,
  modalVisible: false,
  currentItem: {},
  searchParams: {
    from: '',
    to: ''
  }
});
const columns = [
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
  initData()
})

async function initData() {
  state.loading = true;
  const { pageNo, pageSize, searchParams } = state;
  const { getFileList: { data, totalCount } } = await getFileList({
    pageNo, pageSize, ...searchParams
  })
  state.total = totalCount
  state.dataList = data as any
  state.loading = false;
}

function handleOpenUpload() {
  state.modalVisible = true
}
</script>
<style lang="scss" scoped>
.search-card {
  margin-bottom: 16px;
  background: #fff;
}

.file-container {
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

  .pagination-card {
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
  