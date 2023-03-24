<script lang="ts" setup>
import PostImage from './PostImage.vue'

defineProps({
  title: {
    type: String,
    default: '',
  },
  cover: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: '',
  },
  time: {
    type: String,
    default: '',
  },
  level: {
    type: Number,
    default: () => 1,
  },
})
</script>

<template>
  <li
    role="listitem"
    class="tile-item nr-scroll-animation"
    :class="[{ 'item-hero': level === 1, 'item-2up': level === 2, 'item-3up': level === 3 }]"
  >
    <a
      href="{href}"
      aria-label="{label}"
      class="tile large-loaded medium-loaded small-loaded tile-hero"
      :class="[{ 'item-hero': level === 1, 'item-2up': level === 2, 'item-3up': level === 3 }]"
    >
      <div class="tile__media" aria-hidden="true">
        <PostImage :src="cover" />
      </div>
      <div class="tile__description" aria-hidden="true">
        <div class="tile__head">
          <div class="tile__category">category</div>
          <div class="tile__headline">{{ title }}</div>
        </div>
        <div class="tile__timestamp icon-hide icon icon-before icon-clock">2023-10-23</div>
      </div>
    </a>
  </li>
</template>
