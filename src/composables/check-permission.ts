export function checkPermission(checks: string[]) {
  const userStore = useUserStore()
  const permissions = computed(() => userStore.user?.permissions)
  const roles = computed(() => userStore.user?.roles?.map(role => role?.key))
  if (checks && Array.isArray(checks) && checks.length > 0) {
    const hasPermission = permissions.value?.some((per) => {
      return checks.includes(per!)
    })
    const hasRole = roles.value?.some((role) => {
      return checks.includes(role!)
    })
    return hasPermission || hasRole || userStore.user?.superAdmin
  }
  return false
}
