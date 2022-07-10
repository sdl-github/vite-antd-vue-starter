<template>
  <div class='file_conteiner'>
    <a-row>
      <a-col v-for="(bucket, index) in bucketList" :span="6">
        <a-card @click="handleBucketInfo(index)" hoverable style="width: 300px">
          <template #cover>
            <div class="gray-200"></div>
          </template>
          <a-card-meta :title="bucket.name">
            <template #description>
              <span v-time="{ isTimestamp: true }">{{ bucket.creationDate }}</span>
            </template>
          </a-card-meta>
        </a-card>
      </a-col>
      <router-view />
    </a-row>
  </div>
</template>

<script setup lang='ts'>
import { listBuckets } from '@/api/file';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
onMounted(() => {
  initData();
});

const bucketList = ref()
const router = useRouter()

async function initData() {
  const { listBuckets: buckets } = await listBuckets()
  bucketList.value = buckets
}

function handleBucketInfo(index: number) {
  const { name } = bucketList.value[index]
  router.push(`/system/file/bucketInfo?bucket=${name}`)
}
</script>
<style scoped lang='scss'>
.file {
  position: relative;
}
</style>
