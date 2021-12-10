import { RouteRecordRaw } from "vue-router";
import { message } from 'ant-design-vue'
import Clipboard from 'clipboard'
const LOCAL_PREFIX = 'LOCAL_PREFIX'
/**
 * 删除树节点
 * @param menus 
 * @param hideKey 
 * @returns 
 */
export const delHideMenu = (menus: RouteRecordRaw[] | undefined, hideKey = 'hideInMenu') => {
    if (!menus) {
        return
    }
    menus.forEach((item, index) => {
        // 遍历子节点
        if (item?.meta?.[hideKey]) {
            // 删除hide
            menus.splice(index, 1)
        }
        delHideMenu(item.children)
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


export const setVal = (key: string, value: any) => {
    localStorage.setItem(LOCAL_PREFIX + key, JSON.stringify(value))
}

export const getVal = (key: string) => {
    const val = localStorage.getItem(LOCAL_PREFIX + key)
    if (!val) {
        return false
    }
    return JSON.parse(val)
}