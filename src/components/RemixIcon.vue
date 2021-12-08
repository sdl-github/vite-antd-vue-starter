<template>
    <i :class="'ri-' + icon" aria-hidden="true"></i>
</template>

<script>
import 'remixicon/fonts/remixicon.css'

export default {
    name: 'RemixIcon',
    props: {
        icon: {
            type: String,
            required: true,
        },
    },
}
</script>

<style lang="scss" scoped>
[class*='ri'] {
    font-size: 16px;
    vertical-align: -1px;
}
</style>
