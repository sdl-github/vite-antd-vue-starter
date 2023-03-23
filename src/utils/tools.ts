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

export function listToTree<T>(list: T[], id: keyof T, pId: keyof T, rootId = '#') {
  list.forEach((node) => {
    // find current node parent
    const pNode = list.find(row => row[id] === node[pId]) as (T & { children?: T[] })
    if (pNode) {
      pNode.children = pNode.children || []
      pNode.children.push(node)
    }
  })
  // remove child node
  return list.filter(node => node[pId] === rootId)
}

interface TreeNode<T> {
  [key: string]: T | TreeNode<T>[]
}

interface PathNode<T> {
  element: T
  index: number
}

export function findTreePath<T>(
  tree: TreeNode<T>[],
  key: keyof T,
  value: T[keyof T],
): PathNode<T>[] | null {
  const dfs = (
    tree: TreeNode<T>[],
    key: keyof T,
    value: T[keyof T],
    path: PathNode<T>[] = [],
  ): PathNode<T>[] | null => {
    for (let index = 0; index < tree.length; index++) {
      const element = tree[index]
      const tempPath = [...path]
      tempPath.push({ element, index })
      if (element[key] === value) {
        return tempPath
      }
      if (Array.isArray(element.children)) {
        const result = dfs(element.children, key, value, tempPath)
        if (result) {
          return result
        }
      }
    }
    return null
  }

  return dfs(tree, key, value)
}
