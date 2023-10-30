import { useUserStore } from '@/stores/user'
import type { ModelTypes } from '@/utils/graphql/zeus'

type Menu = ModelTypes['Menu']

export function useMenu() {
  const route = useRoute()

  const userStore = useUserStore()
  const selectedKeys = ref<string[]>([])
  const openKeys = ref<string[]>([])

  const { path } = route
  const paths = path.split('/').map(p => `/${p}`)
  openKeys.value = paths
  watchEffect(() => {
    const { path } = route
    selectedKeys.value = [path]
  })

  const list = (userStore?.user?.menus || [] as Menu[]).map((menu: any) => {
    return menu
  })
  const menus = listToTree(deepClone(list), 'id', 'parentId', '0') as Menu[]

  return { menus, selectedKeys, openKeys }
}
