import { useUserStore } from '@/stores/user'
import type { ModelTypes } from '@/utils/graphql/zeus'

type Menu = ModelTypes['Menu']

export function useMenu() {
  const route = useRoute()

  const userStore = useUserStore()
  const selectedKeys = ref<string[]>([])
  const openKeys = ref<string[]>([])

  const list = (userStore?.user?.menus || [] as Menu[]).map((menu: any) => {
    return menu
  })
  const menus = listToTree(deepClone(list), 'id', 'parentId', '0') as Menu[]

  watchEffect(() => {
    const { path } = route
    const curMenu = list.find((item: Menu) => item.path === path) as Menu
    let curSelectKey: string[] = []
    const keys: string[] = []

    const findParentKeys = (menu: Menu) => {
      if (menu.parentId) {
        const parent = list.find(item => item.id === menu.parentId)

        if (parent) {
          keys.push(parent.name)
          findParentKeys(parent)
        }
      }
    }

    if (curMenu) {
      findParentKeys(curMenu)
      curSelectKey = [curMenu.name!]
    }

    selectedKeys.value = curSelectKey
    openKeys.value = keys
  })

  return { menus, selectedKeys, openKeys }
}
