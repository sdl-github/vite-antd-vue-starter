import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'
import { cloneDeep } from 'lodash'
import type { ModelTypes } from '@/utils/graphql/zeus'
import spaceApi from '@/api/space'
import spaceMenuApi, { moveSpaceMenuToRecycleBin } from '@/api/space-menu'
import { guid } from '@/utils/tools'
import { queryPostByMenuId } from '@/api/post'

type Space = ModelTypes['Space']
type SpaceMenu = ModelTypes['SpaceMenu']
type Post = ModelTypes['Post']

export const useSpaceStore = defineStore('space', () => {
  const queryMenuLoading = ref(false)
  const queryPostLoading = ref(false)
  const router = useRouter()
  const route = useRoute()
  const spaces = ref<Space[]>([])
  const space = ref<Space>()
  const spaceMenus = ref<SpaceMenu[]>()
  const spaceLineMenus = ref<SpaceMenu[]>()
  const post = ref<Post>()
  const currentId = computed<string>(() => {
    return route.query.id as string
  })

  watchThrottled(currentId, (id) => {
    queryPost(id)
    findMenuLine()
  }, {
    immediate: true,
  })

  function findMenuLine() {
    const tree = cloneDeep(unref(spaceMenus))
    const id = unref(currentId)
    if (!tree || (tree && !tree.length) || !id) {
      return
    }
    const paths = findTreePath(tree, 'id', id)
    spaceLineMenus.value = paths?.map(path => path.element)
  }

  function queryPost(menuId: string) {
    if (!menuId) {
      return
    }
    queryPostLoading.value = true
    queryPostByMenuId(menuId).then((res) => {
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
          const { id: key } = menu
          return { ...menu, key }
        })
        spaceMenus.value = listToTree(cloneDeep(list), 'id', 'pId', null)
      }
    }).finally(() => {
      queryMenuLoading.value = false
      findMenuLine()
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

  return {
    currentId,
    space,
    spaces,
    spaceMenus,
    spaceLineMenus,
    queryMenuLoading,
    queryPostLoading,
    post,
    querySpace,
    querySpaceMenu,
    queryPost,
    createNew,
    moveToRecycleBin,
  }
})
