import { useUserStore } from "@/stores/user";

export function useMenu() {
    const userStore = useUserStore()
    const menus = computed(() => {
        const list = userStore.menus.filter(menu => menu.type === 'MENU' && menu.visible).map((menu) => {
            return menu
        })
        return listToTree(list, 'id', 'pId', '#')
    })
    return { menus }
}