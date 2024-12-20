import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'
import { cloneDeep } from 'lodash'
import type { ModelTypes } from '@/utils/graphql/zeus'
import spaceApi from '@/api/space'
import spaceMenuApi, { moveSpaceMenuToRecycleBin } from '@/api/space-menu'
import { guid } from '@/utils/tools'
import { queryPost as queryPostById, updatePostVersion as updatePostVersionApi } from '@/api/post'
type Space = ModelTypes['Space']
type SpaceMenu = ModelTypes['SpaceMenu']
type Post = ModelTypes['Post']

export const useSpaceStore = defineStore('space', () => {
  const queryMenuLoading = ref(false)
  const queryPostLoading = ref(false)
  const updatePostLoading = ref(false)
  const router = useRouter()
  const route = useRoute()
  const spaces = ref<Space[]>([])
  const space = ref<Space>()
  const spaceListMenus = ref<SpaceMenu[]>()
  const post = ref<Post>()
  const currentId = computed<string>(() => {
    return route.query.id as string
  })
  const spaceMenus = computed(() => {
    return listToTree(cloneDeep(unref(spaceListMenus)), 'id', 'pId', null)
  })
  const spaceLineMenus = computed(() => {
    const tree = cloneDeep(unref(spaceMenus))
    const id = unref(currentId)
    if (!tree || (tree && !tree.length) || !id) {
      return
    }
    const paths = findTreePath(tree, 'id', id)
    return paths?.map(path => path.element)
  })

  watchThrottled(currentId, (id) => {
    queryPost(id)
  }, {
    immediate: true,
  })

  function refreshPost() {
    queryPost(currentId.value)
  }

  function queryPost(menuId: string) {
    if (!menuId) {
      return
    }
    queryPostLoading.value = true
    queryPostById({ menuId }).then((res) => {
      post.value = res.queryPost
    }).finally(() => {
      queryPostLoading.value = false
    })
  }

  function querySpace() {
    spaceApi.querySpace().then((res) => {
      if (res && res.querySpace.length) {
        spaces.value = res.querySpace
        if (Array.isArray(spaces.value) && spaces.value.length) {
          space.value = spaces.value[0]
          querySpaceMenu()
        }
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
      if (res.querySpaceMenu && res.querySpaceMenu.length) {
        const list = res.querySpaceMenu?.map((menu) => {
          const { id, icon, ...others } = menu
          return { ...others, id, key: id, menuIcon: icon }
        })
        spaceListMenus.value = list
      }
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
      icon: ':new:',
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

  async function moveToRecycleBin(menuId: string) {
    if (!menuId) {
      return
    }
    const loading = message.loading('加载中')
    return moveSpaceMenuToRecycleBin(menuId).then(() => {
      querySpaceMenu()
      message.success('移动到回收站成功')
    }).finally(() => {
      loading()
    })
  }

  const debouncedFn = useDebounceFn((id: string, title: string) => {
    spaceMenuApi.updateSpaceMenuTitle(id, title)
  }, 1000)

  function updateSpaceMenuTitle(id: string, title = '未命名页面') {
    updateSpaceMenu(id, { title })
    debouncedFn(id, title)
  }

  function updateSpaceMenuIcon(id: string, menuIcon: string) {
    updateSpaceMenu(id, { menuIcon })
    spaceMenuApi.updateSpaceMenu({ id, icon: menuIcon })
  }

  function updateSpaceMenu(id: string, data: { title?: string; menuIcon?: string; currentContent?: string }) {
    spaceListMenus.value?.some((menu, index) => {
      if (menu.id === id) {
        menu = { ...menu, ...data }
        spaceListMenus.value && (spaceListMenus.value[index] = { ...spaceListMenus.value[index], ...data })
        return true
      }
      return false
    })
  }

  function updatePostVersion(versionId: string, content: string) {
    updatePostLoading.value = true
    updatePostVersionApi(versionId, content).then((res) => {
      post.value && (post.value.updatedAt = res.updatePostVersion.updatedAt)
    }).finally(() => {
      updatePostLoading.value = false
    })
  }

  return {
    currentId,
    space,
    spaces,
    spaceMenus,
    spaceLineMenus,
    queryMenuLoading,
    queryPostLoading,
    updatePostLoading,
    post,
    querySpace,
    querySpaceMenu,
    queryPost,
    refreshPost,
    createNew,
    moveToRecycleBin,
    updateSpaceMenuTitle,
    updateSpaceMenuIcon,
    updatePostVersion,
  }
})
