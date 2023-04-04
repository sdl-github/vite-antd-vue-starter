<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const token = route.query.accessToken
if (token) {
  setToken(token as string)
  router.push('/')
}
</script>

<template>
  <div class="w-full h-100vh flex justify-center items-center">
    <a-spin />
  </div>
</template>
