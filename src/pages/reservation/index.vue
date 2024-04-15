<route lang="yaml">
    meta:
      layout: dashboard
</route>

<script setup lang="ts">
import type { SorterResult } from "ant-design-vue/es/table/interface";
import { type TableColumnType, message } from "ant-design-vue";
import {
  ReservationStatusList,
  ReservationType,
  columns,
  generateSearch,
} from "./data";
import type { Reservation, State } from "./data";
import ReservationModal from "./components/ReservationModal.vue";
import {
  deleteReservation,
  queryReservationPage,
  queryReservationDoctorPage,
} from "~/api/reservation";

const state: State = reactive({
  loading: false,
  modalVisible: false,
  currentItem: null,
  data: [],
  search: generateSearch(),
  total: 0,
});

const { search } = toRefs(state);
const isAdmin = computed(() => checkPermission(["ADMIN", "SUPER_ADMIN"]));
initData();
// 初始化数据
async function initData() {
  state.loading = true;
  const { search } = state;
  const api = isAdmin.value ? queryReservationPage : queryReservationDoctorPage;
  const res = await api(search);
  const { content, totalElements } = res as any;
  state.data = content as Reservation[];
  state.total = totalElements as number;
  state.loading = false;
}
// 分页回调
function handleShowSizeChange(current: number, pageSize: number) {
  search.value.pageNo = current;
  search.value.pageSize = pageSize;
  initData();
}

// 搜索回调
function handleSearch() {
  handleShowSizeChange(DEFAULT_PAGE_NO, DEFAULT_PAGE_SIZE);
}

function handleReset() {
  state.search = generateSearch();
  handleShowSizeChange(DEFAULT_PAGE_NO, DEFAULT_PAGE_SIZE);
}

function handleTableChange(
  pagination: any,
  filters: any,
  sorter: SorterResult
) {
  const sortType = {
    ascend: "asc",
    descend: "desc",
  };
  const { order, field } = sorter;
  if (!order) {
    search.value.sort = "";
    initData();
    return;
  }
  const sort = sortType[order!];
  search.value.sort = `${field} ${sort}`;
  initData();
}

function handleOpenCreate() {
  state.modalVisible = true;
}

function handleOpenEdit(record: Reservation) {
  state.modalVisible = true;
  state.currentItem = record;
}

async function handleDelete(id: string) {
  const loading = message.loading("加载中", 0);
  try {
    await deleteReservation(id);
    initData();
    loading();
    message.success("成功");
    return true;
  } catch (e) {
    loading();
    return false;
  }
}
</script>

<template>
  <div class="w-full">
    <ReservationModal
      v-model:open="state.modalVisible"
      :current-item="state.currentItem"
      @ok="initData"
      @cancel="() => (state.currentItem = null)"
    />
    <!-- 搜索 -->
    <ACard>
      <div class="flex">
        <!-- <ASelect v-model:value="search.status" placeholder="请选择状态" :options="ReservationStatusList" /> -->
        <div class="ml-2 flex items-center">
          <ADatePicker
            v-model:value="search.startDate"
            placeholder="开始时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            class="ml-2"
          />
          <ADatePicker
            v-model:value="search.endDate"
            placeholder="结束时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            class="ml-2"
          />
          <AButton
            :loading="state.loading"
            class="flex items-center justify-center ml-2"
            type="primary"
            @click="handleSearch"
          >
            <template #icon>
              <div class="i-ri-search-line mr-2" />
            </template>
            <div>查询</div>
          </AButton>
          <AButton style="margin-left: 10px" @click="handleReset">
            重置
          </AButton>
        </div>
      </div>
    </ACard>
    <!-- 刷新 -->
    <div class="h-64px flex justify-end py-16px">
      <!-- <AButton type="primary" @click="handleOpenCreate">
        新建
      </AButton> -->
      <div class="mx-16px flex items-center">
        <ATooltip placement="top">
          <template #title>
            <span>刷新</span>
          </template>
          <AButton
            class="flex items-center justify-center"
            type="text"
            shape="circle"
            @click="initData"
          >
            <div class="i-ri-refresh-line" />
          </AButton>
        </ATooltip>
      </div>
    </div>
    <!-- 表格 -->
    <ATable
      :pagination="false"
      :columns="columns"
      :row-key="(record: any) => record.id"
      :data-source="state.data"
      :loading="state.loading"
      @change="handleTableChange"
    >
      <template
        #bodyCell="{
          column,
          record,
        }: {
          column: TableColumnType<Reservation>,
          record: Reservation,
        }"
      >
        <template v-if="column.dataIndex === 'appointmentDate'">
          <span>
            {{ record.appointmentDate }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'doctorName'">
          <span>
            {{ record.doctor?.nickName }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'nickName'">
          <span>
            {{ record.user?.nickName || record.user?.userName }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'orgName'">
          <span>
            {{ record.org?.name }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'address'">
          <span>
            {{ record.org?.address }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'shift'">
          <span>
            {{ record.schedule?.shift }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'status'">
          <span>
            {{ record.status == "0" ? "已预约" : "已完成" }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'createdAt'">
          <span>
            {{ formatDate(record.createdAt) }}
          </span>
        </template>
        <template v-if="column.key === 'operation'">
          <span>
            <a @click="handleOpenEdit(record)">编辑</a>
            <ADivider type="vertical" />

            <APopconfirm
              :title="`确定要删除?`"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleDelete(record.id!)"
            >
              <a>删除</a>
            </APopconfirm>
          </span>
        </template>
      </template>
    </ATable>
    <!-- 分页 -->
    <div
      class="my-10px h-60px w-full flex items-center justify-end bg-white px-20px"
    >
      <APagination
        v-model:pageSize="search.pageSize"
        :current="search.pageNo"
        show-size-changer
        :total="state.total"
        :show-total="() => `共 ${state.total} 条`"
        @change="handleShowSizeChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
