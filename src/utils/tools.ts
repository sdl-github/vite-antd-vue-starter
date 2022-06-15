import { message } from 'ant-design-vue'
import Clipboard from 'clipboard'
const LOCAL_PREFIX = 'LOCAL_PREFIX'

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

export function listToTree(list: any[], id = 'id', pId = 'pId', rootId = '#') {
    list.forEach((node) => {
        // find current node parent
        const pNdoe = list.find((row) => row[id] === node[pId])
        if (pNdoe) {
            pNdoe.children = pNdoe.children || []
            pNdoe.children.push(node)
        }
    })
    // remove child node
    return list.filter((node) => node[pId] === rootId)
}
