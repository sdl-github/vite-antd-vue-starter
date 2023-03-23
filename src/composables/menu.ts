import { cloneDeep } from 'lodash'
import { useUserStore } from '@/stores/user'

export function useMenu() {
  const userStore = useUserStore()
  const list = userStore.menus.filter(menu => menu.type === 'MENU' && menu.visible).map((menu) => {
    return menu
  })
  const menus = listToTree(cloneDeep(list), 'id', 'pId', '#')
  return { menus }
}
