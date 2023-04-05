<script setup lang="tsx">
type MenuIconType = 'emoji'
interface IProps {
  icon: string
  type: MenuIconType
}
withDefaults(defineProps<IProps>(), {
  icon: ':new:',
  type: 'emoji',
})
</script>

<template>
  <div class="rounded hover:bg-[#ebebeb] p-3 w-20px h-25px flex items-center justify-center">
    <em-emoji :shortcodes="icon || ':new:'" size="1.2em" />
  </div>
</template>
