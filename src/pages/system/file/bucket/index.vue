<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
onMounted(() => {
  initData()
})

const bucketList = ref()
const router = useRouter()

async function initData() {
}

function handleBucketInfo(index: number) {
  const { name } = bucketList.value[index]
  router.push(`/system/file/bucketInfo?bucket=${name}`)
}
</script>

<template>
  <div class="file_conteiner">
    <div v-for="(bucket, index) in bucketList" :key="index" class="mb-2">
      <a-card hoverable @click="handleBucketInfo(index)">
        <template #cover>
          <div class="gray-200" />
        </template>
        <a-card-meta :title="bucket.name">
          <template #description>
            <span v-time="{ isTimestamp: true }">{{
              bucket.creationDate
            }}</span>
          </template>
        </a-card-meta>
      </a-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.file {
  // position: relative;
}
</style>
