
<template>
  <div><a-button @click='handleLogin' type="primary">Login</a-button></div>
</template>

<script setup lang="ts">
import { setToken } from "@/utils/auth"

const handleLogin = () => {
    setToken('token')
}
</script>

<style>
</style>