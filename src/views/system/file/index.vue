<template>
  <div class='file_conteiner'>
    <a-row>
      <a-col v-for="(bucket, index) in bucketList" :span="6">
        <a-card hoverable style="width: 300px">
          <template #cover>
            <div class="gray-200"></div>
          </template>
          <a-card-meta :title="bucket.name">
            <template #description>
              <equalizer theme="outline" size="24" fill="#333"/>
              <span v-time="{ isTimestamp: true }">{{ bucket.creationDate }}</span>
            </template>
          </a-card-meta>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang='ts'>
import { Equalizer } from '@icon-park/vue-next'
import { listBuckets } from '@/api/file';
import { onMounted, ref } from 'vue';
onMounted(() => {
  initData();
});

const bucketList = ref()

async function initData() {
  const { listBuckets: buckets } = await listBuckets()
  bucketList.value = buckets
}

const name = ref('file')
</script>
<style scoped lang='scss'>
.file {
  position: relative;
}
</style>
