<script setup lang="ts">
import RemixIconSelect from '@/components/RemixIconSelect/index.vue';
import RemixIcon from '@/components/RemixIcon.vue';
import { ref } from 'vue';

const props = defineProps({
    value: {
        type: Array,
        default: () => [],
    },
});
const visible = ref(false);
const emits = defineEmits(['update:value'])

function onSelect(value: string) {
    visible.value = false;
    emits('update:value', value);
}

</script>

<template>
    <a-popover placement="bottom" trigger="click" destroyTooltipOnHide v-model:visible="visible">
        <template #content>
            <div class="icon_select_content">
                <RemixIconSelect @onSelect='onSelect' />
            </div>
        </template>

        <a-input placeholder="请选择" :value="value">
            <template v-if="value" #prefix>
                <RemixIcon :icon='value' />
            </template>
        </a-input>
    </a-popover>
</template>

<style lang="scss" scoped>
.icon_select_content {
    width: 400px;
    height: 300px;
    overflow: auto;
}
</style>