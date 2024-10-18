<script setup lang="ts">
import useSWRV from 'swrv'
import { queryArticle } from '~/api/article'

const route = useRoute()
const id = route.params.id
const { data } = useSWRV(id && `queryArticle/${id}` || null, () => queryArticle(id as string))
const loading = computed(() => !data.value)
</script>

<template>
  <div class="m-auto mt-2 min-h-80vh w-768px rounded bg-white p-2">
    <ASkeleton :loading="loading">
      <div class="mx-auto w-xl overflow-clip">
        <h1 class="my-10 text-xl font-bold">
          {{ data?.queryArticle?.title }}
        </h1>
        <TextbusEditor :content="data?.queryArticle?.html" :readonly="true" />
      </div>
    </ASkeleton>
  </div>
</template>
