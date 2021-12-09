import { RouteRecordRaw } from "vue-router";
import { message } from 'ant-design-vue'
import Clipboard from 'clipboard'

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

/**
 * @description 复制数据
 * @param text
 * @param event
 */
export function handleClipboard(text: string, event: any) {
    const clipboard = new Clipboard(event.target, {
        text: () => text,
    })
    clipboard.on('success', () => {
        message.success(`复制${text}成功`)
        clipboard.destroy()
    })
    clipboard.on('error', () => {
        message.success(`复制${text}失败`)
        clipboard.destroy()
    })
}
