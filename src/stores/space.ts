import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'
import type { ModelTypes } from '@/utils/graphql/zeus'
import spaceApi from '@/api/space'
import spaceMenuApi, { moveSpaceMenuToRecycleBin } from '@/api/space-menu'
import { guid } from '@/utils/tools'

type Space = ModelTypes['Space']
type SpaceMenu = ModelTypes['SpaceMenu']

export const useSpaceStore = defineStore('space', () => {
  const queryMenuLoading = ref(false)
  const queryPostLoading = ref(false)
  const router = useRouter()
  const route = useRoute()
  const spaces = ref<Space[]>([])
  const space = ref<Space>()
  const spaceMenus = ref<SpaceMenu[]>()
  const currentId = computed(() => {
    return route.query.id
  })

  watch(spaces, (val) => {
    if (val.length) {
      space.value = val[0]
      querySpaceMenu()
    }
  })

  function querySpace() {
    spaceApi.querySpace().then((res) => {
      if (res && res.querySpace.length) {
        spaces.value = res.querySpace
      }
      else {
        router.push('/post/init')
      }
    })
  }

  function querySpaceMenu() {
    if (!space.value?.id) {
      return
    }
    queryMenuLoading.value = true
    spaceMenuApi.querySpaceMenu(space.value!.id).then((res) => {
      res.querySpaceMenu.length && (spaceMenus.value = res.querySpaceMenu as SpaceMenu[])
    }).finally(() => {
      queryMenuLoading.value = false
    })
  }

  function createNew(pId?: string) {
    if (!space.value || !space.value?.id) {
      return
    }
    const loading = message.loading('加载中')
    const id = guid()
    const menu = {
      id,
      spaceId: space.value!.id,
      pId,
      title: '新文章',
      icon: '',
      iconType: '',
    }
    spaceMenuApi.createSpaceMenu(menu).then(() => {
      router.push({
        path: '/post/edit',
        query: { id },
      })
      querySpaceMenu()
      message.success('新增成功')
    }).finally(() => {
      loading()
    })
  }

  function moveToRecycleBin(menuId: string) {
    const loading = message.loading('加载中')
    moveSpaceMenuToRecycleBin(menuId).then(() => {
      querySpaceMenu()
      message.success('移动到回收站成功')
    }).finally(() => {
      loading()
    })
  }

  return {
    currentId,
    space,
    spaces,
    spaceMenus,
    queryMenuLoading,
    querySpace,
    querySpaceMenu,
    createNew,
    moveToRecycleBin,
  }
})
