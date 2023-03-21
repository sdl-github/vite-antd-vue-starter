import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const title = ref('Super Admin')
  const theme = ref('dark')
  const collapsed = ref(false)
  const toggle = () => {
    collapsed.value = !collapsed.value
  }
  return {
    title,
    theme,
    collapsed,
    toggle,
  }
})
