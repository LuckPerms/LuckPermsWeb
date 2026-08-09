<template>
  <span ref="el" class="intersect">
    <slot />
  </span>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const emit = defineEmits(['enter', 'leave']);

const el = ref(null);
let observer = null;

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        emit('enter');
      } else {
        emit('leave');
      }
    });
  });
  observer.observe(el.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>
