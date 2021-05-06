<template>
  <img
    :src="`https://crafthead.net/helm/${key}`"
    :title="title && `${name}'s avatar`"
  />
</template>

<script>
export default {
  props: {
    id: {
      required: true,
    },
    name: {
      required: false,
    },
    title: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    key() {
      return this.id.replace(/-/g, '');
    },
  },
};
</script>
