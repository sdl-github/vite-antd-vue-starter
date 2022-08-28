<template>
    <div>
        <a-table :pagination="false" :scroll="{ x: 1500 }" :columns="columns" :row-key="(record: any) => record.id"
            :data-source="state.dataList" :loading="state.loading">
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'loginTime'">
                    <span v-time>
                        {{ record.loginTime }}
                    </span>
                </template>
                <template v-if="column.dataIndex === 'token'">
                    <a-tooltip>
                        <template #title>{{ record.token }}</template>
                        <div class="w-[250px] line-clamp-1"> {{ record.token }} </div>
                    </a-tooltip>
                </template>
                <template v-if="column.key === 'operation'">
                    <span>
                        <a>强退</a>
                    </span>
                </template>
            </template>
        </a-table>
    </div>
</template>


<script setup lang="ts">
import { getOnLineUser } from '@/api/auth';
import { ModelTypes } from '@/utils/graphql/zeus';
import { TableColumnType } from 'ant-design-vue';
import { onMounted, reactive } from 'vue';
type IOnLineUser = ModelTypes["OnLineUser"]
type IState = {
    pageNo: number,
    pageSize: number,
    total: number,
    dataList: IOnLineUser[],
    loading: boolean,
    searchParams: {
        name: string,
        ip: string
    }
}
const columns: TableColumnType<IOnLineUser>[] = [
    {
        title: "会话ID",
        width: 200,
        align: "center",
        dataIndex: "token",
        key: "token",
    },
    {
        title: "登录用户",
        width: 100,
        align: "center",
        dataIndex: "username",
        key: "username",
    },
    {
        title: "浏览器",
        align: "center",
        width: 160,
        dataIndex: "loginBrowser",
    },
    {
        title: "登录IP",
        align: "center",
        width: 160,
        dataIndex: "loginIp",
    },
    {
        title: "登录地址",
        align: "center",
        width: 160,
        dataIndex: "loginAddr",
    },
    {
        title: "登录时间",
        align: "center",
        width: 160,
        dataIndex: "loginTime",
    },
    {
        title: "操作",
        width: 180,
        fixed: "right",
        key: "operation",
        align: "center",
    },
];

const state = reactive<IState>({
    pageNo: 1,
    pageSize: 10,
    total: 0,
    dataList: [],
    loading: false,
    searchParams: {
        name: '',
        ip: '',
    }
})
onMounted(() => {
    initData()
})

async function initData() {
    state.loading = true
    const { getOnLineLoginUserList } = await getOnLineUser()
    state.dataList = getOnLineLoginUserList
    state.loading = false
}

</script>