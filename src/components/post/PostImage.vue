<script setup lang="ts">
const props = defineProps({
  src: {
    type: String,
    default: '',
  },
})
const url = ref('')
const loading = ref(true)
onMounted(() => {
  loadImage()
})

function loadImage() {
  loading.value = true
  const image = new Image()
  image.src = props.src
  image.onload = (e) => {
    loading.value = false
    const percent = ((image.height / image.width) * 100).toFixed(5)
    url.value = props.src
  }
  image.onerror = (e) => {
    loading.value = false
  }
}

function renderStyle(sign: string, percent: string) {
  return `
      .image-${sign} {
      width: 100%;
      padding-top: ${percent}%;
      height: auto;
  }

  @media only screen and (max-width: 1068px) {
      .image-${sign} {
      width: 100%;
      padding-top: ${percent}%;
      height: auto;
    }
  }

  @media only screen and (max-width: 734px) {
    .image-${sign} {
    width: 100%;
    padding-top: ${percent}%;
    height: auto;
  }
  };`
}
</script>

<template>
  <div v-if="loading" class="h-full w-full flex items-center justify-center">
    <a-spin />
  </div>
  <img v-else class="cover image" :data-src="src" :src="url" alt="lt">
</template>
