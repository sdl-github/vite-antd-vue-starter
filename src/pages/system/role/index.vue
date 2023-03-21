<script setup lang="ts">
import RoleModal from './components/RoleModal.vue';
import PermissionSelect from './components/PermissionSelect.vue'
import TableSearchCard from './components/TableSearchCard.vue';
import { createRole, delRoles, queryRolePage, updateRole } from '@/api/role';
import dayjs from 'dayjs';
import { onMounted, reactive } from 'vue';
import { message } from 'ant-design-vue';
const columns = [
    {
        title: "权限名称",
        align: "center",
        dataIndex: "name",
    },
    {
        title: "权限标识",
        align: "center",
        dataIndex: "key",
    },
    {
        title: "权限级别",
        align: "center",
        dataIndex: "level",
    },
    {
        title: "是否默认角色",
        align: "center",
        dataIndex: "isDefault",
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
const state = reactive({
    pageNo: 1,
    pageSize: 10,
    total: 0,
    dataList: [],
    loading: false,
    modalVisible: false,
    drawerVisible: false,
    currentItem: {},
    searchParams: {}
});


onMounted(() => {
    initData();
});


// 初始化数据
async function initData() {
    state.loading = true;
    const { pageNo, pageSize, searchParams } = state;
    const {
        queryRolePage: { data, totalCount },
    } = await queryRolePage({
        includeMenu: true,
        pageNo,
        pageSize,
        ...searchParams,
    });
    console.log(data);
    state.total = totalCount
    state.dataList = data as any;
    state.loading = false;
}
// 打开创建
function handleOpenCreate() {
    state.currentItem = {} as any
    state.modalVisible = true
}
// 格式化时间
function formatDate(date: string) {
    return dayjs(date).format("YYYY-MM-DD HH:mm");
};
// 分页回调
function handleShowSizeChange(current: number, pageSize: number) {
    state.pageNo = current
    state.pageSize = pageSize
    initData()
}

async function handleOk(v: any) {
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

function handleOpenEdit(record: any) {
    state.currentItem = record
    state.modalVisible = true
}

function handleOpenDrawer(record: any) {
    state.currentItem = record
    state.drawerVisible = true
}

async function handleUpdate(v: any) {
    const loading = message.loading('加载中', 0);
    try {
        await updateRole(v)
        loading()
        message.success('成功');
        return true
    } catch (e) {
        loading()
        return false
    }
}
async function handleCreate(v: any) {
    const loading = message.loading('加载中', 0);
    try {
        await createRole(v)
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
        await delRoles([id])
        loading()
        initData()
        message.success('成功');
        return true
    } catch (e) {
        loading()
        return false
    }
}

function handleSearch(params: any) {
    state.searchParams = params
    initData()
}


function handleSave(v) {
    handleOk(v)
}

function handleCancel() {
   state.drawerVisible = false
}
</script>


<template>
    <div class="role-container">
        <TableSearchCard @handleSearch="handleSearch" />
        <div class="table-header">
            <a-button @click='handleOpenCreate' type="primary">新建</a-button>
            <div class="table-action">
                <a-tooltip placement="top">
                    <template #title>
                        <span>刷新</span>
                    </template>
                    <a-button @click="initData" type="text" shape="circle">
                        <div class="i-ri-refresh-line"></div>
                    </a-button>
                </a-tooltip>
            </div>
        </div>
        <a-table :pagination="false" :columns="columns" :row-key="(record: any) => record.id"
            :data-source="state.dataList" :loading="state.loading">
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'createdAt'">
                    <span>
                        {{ formatDate(record.createdAt) }}
                    </span>
                </template>
                <template v-if="column.dataIndex === 'key'">
                    <span
                        class="ml-2 px-2 py-1 bg-purple-100 dark:bg-purple-100 text-xs font-semibold text-purple-800 dark:text-purple-800 rounded uppercase">
                        {{ record.key }}
                    </span>
                </template>
                <template v-if="column.dataIndex === 'isDefault'">
                    <span>
                        {{ record.isDefault ? '是' : '否' }}
                    </span>
                </template>
                <template v-if="column.key === 'operation'">
                    <span>
                        <a @click='handleOpenEdit(record)'>编辑</a>
                        <a-divider type="vertical" />
                        <a @click='handleOpenDrawer(record)'>权限分配</a>
                        <a-divider type="vertical" />
                        <a-popconfirm :title="`确定要删除${record.name}?`" ok-text="确定" cancel-text="取消"
                            @confirm="handleDelete(record.id)">
                            <a>删除</a>
                        </a-popconfirm>
                    </span>
                </template>
            </template>
        </a-table>
        <div class="pagination-card">
            <a-pagination v-model:current="state.pageNo" v-model:pageSize="state.pageSize" show-size-changer
                :total="state.total" :show-total="() => `共 ${state.total} 条`" @change="handleShowSizeChange" />
        </div>

        <PermissionSelect :visible="state.drawerVisible" :currentRole='state.currentItem' @handleSave='handleSave'
            @handleCancel="handleCancel" />
        <RoleModal :current-item="state.currentItem" v-model:modalVisible='state.modalVisible' @handleOk="handleOk" />
    </div>
</template>

<style lang="scss" scoped>
.search-card {
    margin-bottom: 16px;
    background: #fff;
}

.role-container {
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
