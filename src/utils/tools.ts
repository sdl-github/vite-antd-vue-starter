import {RouteRecordRaw} from "vue-router";


export const delHideMenu = (menus: RouteRecordRaw[] | undefined, hideKey = 'hideInMenu') => {
    if (!menus) {
        return
    }
    menus.forEach((item, index) => {
        // 遍历子节点
        delHideMenu(item.children)
        if (item?.meta?.[hideKey]) {
            // 删除hide
            menus.splice(index, 1)
        }
    })
    return menus;
}