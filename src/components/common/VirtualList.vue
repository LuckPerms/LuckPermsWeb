<template>
  <div
    ref="parentRef"
    class="virtual-list"
  >
    <div
      class="virtual-list-inner"
      :style="{ height: `${virtualizer.getTotalSize()}px` }"
    >
      <div
        v-for="virtualItem in virtualizer.getVirtualItems()"
        :key="virtualItem.key"
        class="virtual-list-item"
        :data-index="virtualItem.index"
        :ref="virtualizer.measureElement"
        :style="{ transform: `translateY(${virtualItem.start}px)` }"
        role="listitem"
      >
        <component :is="dataComponent" :source="dataSources[virtualItem.index]" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useVirtualizer } from '@tanstack/vue-virtual';

const props = defineProps({
  dataSources: {
    type: Array,
    default: () => [],
  },
  dataKey: {
    type: String,
    default: 'id',
  },
  dataComponent: {
    type: Object,
    required: true,
  },
  keeps: {
    type: Number,
    default: 0,
  },
  estimateSize: {
    type: Number,
    default: 50,
  },
});

const parentRef = ref(null);

const virtualizer = useVirtualizer(computed(() => ({
  count: props.dataSources.length,
  getScrollElement: () => parentRef.value,
  estimateSize: () => props.estimateSize,
  overscan: 5,
})));
</script>

<style scoped>
  .virtual-list {
    position: relative;
    width: 100%;
  }

  .virtual-list-inner {
    position: relative;
    width: 100%;
  }

  .virtual-list-item {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
</style>
