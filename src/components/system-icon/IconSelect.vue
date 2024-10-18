<script setup lang="ts">
import { mapEntries } from 'radash'

interface IconList {
  prefix: string
  icons: string[]
  title: string
  total: number
  categories: Record<string, string[]>
}
const props = defineProps({
  value: String,
  placeholder: String,
})
const emits = defineEmits(['update:value'])
const open = ref(false)
const activeKey = ref('local')
const iconList = shallowRef<IconList[]>([])
const localIconList = shallowRef({})
const currentTag = ref('')
// 获取svg文件名
function getSvgName(path: string) {
  const regex = /\/([^/]+)\.svg$/
  const match = path.match(regex)
  if (match) {
    const fileName = match[1]
    return fileName
  }
  return path
}

// 获取所有本地图标
function generateLocalIconList() {
  const localSvgList = import.meta.glob('@/assets/svg-icons/*.svg', {
    query: '?raw',
    import: 'default',
    eager: true,
  })
  return mapEntries(localSvgList, (key, value) => {
    return [getSvgName(key), value]
  })
}

// 包含的图标库系列名
const nameList = ['icon-park-outline', 'carbon', 'ri']

// 获取单个图标库数据
async function fetchIconList(name: string): Promise<IconList> {
  return await fetch(`https://api.iconify.design/collection?prefix=${name}`).then(res => res.json())
}

// 获取所有图标库数据
async function fetchIconAllList(nameList: string[]) {
  const namePromises = nameList.map(name => fetchIconList(name))
  const targets = await Promise.all(namePromises)

  return targets.map((i) => {
    i.icons = Object.entries(i.categories).reduce((prev, next) => {
      const [_key, value] = next
      return prev.concat(value)
    }, [] as string[])
    return i
  })
}

onMounted(async () => {
  iconList.value = await fetchIconAllList(nameList)
  localIconList.value = generateLocalIconList()
})

function ok(value: string) {
  emits('update:value', value)
  open.value = false
}

function cancel() {
  open.value = false
}
// 切换tab
function handleChangeTab(_key: string | number) {
  currentTag.value = ''
}
// 搜索图标输入框值
const searchValue = ref('')

// 当前页数
const currentPage = shallowRef(1)

// 选择分类tag
function handleSelectIconTag(icon: string) {
  currentTag.value = currentTag.value === icon ? '' : icon
  currentPage.value = 1
}

// 包含当前分类或所有图标列表
const icons = computed(() => {
  const index = iconList.value.findIndex(i => i.prefix === activeKey.value)
  if (index === -1)
    return []

  const hasTag = !!currentTag.value
  if (hasTag)
    return iconList.value[index]?.categories[currentTag.value]
  else
    return iconList.value[index].icons
})

// 符合搜索条件的图标列表
const visibleIcons = computed(() => {
  return icons.value?.filter(i => i
    .includes(searchValue.value))?.slice((currentPage.value - 1) * 200, (currentPage.value) * 200)
})
</script>

<template>
  <AInput :value="value" :placeholder="placeholder">
    <template #prefix>
      <SystemIcon :icon="value" />
    </template>
    <template #suffix>
      <a @click="open = true">选择</a>
    </template>
  </AInput>

  <AModal
    :footer="false" :closable="true" :open="open" :mask-closable="false" :mask="true" width="800px"
    :mask-style="{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(243, 244, 246, 0.1)' }" @cancel="cancel"
  >
    <ATabs v-model:activeKey="activeKey" tab-position="left" @change="handleChangeTab">
      <ATabPane key="local" tab="本地">
        <div class="flex flex-wrap">
          <div v-for="(_icon, key) in localIconList" :key="key" class="flex cursor-pointer items-center justify-center rounded p-1 ring-[#1677ff] hover:(text-[#1677ff] ring-1)" @click="() => ok(`local:${key}`)">
            <SystemIcon :icon="`local:${key}`" class="h-5 w-5" />
          </div>
        </div>
      </ATabPane>
      <ATabPane v-for="item in iconList" :key="item.prefix" :tab="item.prefix">
        <ASpace :size="[0, 8]" wrap>
          <ACheckableTag
            v-for="(_v, key) in item.categories" :key="key"
            :checked="key === currentTag"
            @change="handleSelectIconTag(key)"
          >
            {{ key }}
          </ACheckableTag>
        </ASpace>

        <div class="mt-4 flex flex-wrap">
          <div v-for="icon in visibleIcons" :key="icon" class="m-1 flex cursor-pointer items-center justify-center rounded p-1 ring-[#1677ff] hover:(text-[#1677ff] ring-1)" @click="() => ok(`${item.prefix}:${icon}`)">
            <SystemIcon :icon="`${item.prefix}:${icon}`" class="h-5 w-5" />
          </div>
        </div>
        <APagination v-model:current="currentPage" class="mt-4" :total="icons?.length" show-less-items :page-size="200" />
      </ATabPane>
    </ATabs>
  </AModal>
</template>
