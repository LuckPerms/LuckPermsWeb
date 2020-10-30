<template>
  <img
    :src="`https://minotar.net/helm/${id}/${size}.png`"
    :alt="$t('avatar', { name })"
    :title="title ? $t('avatar', { name }) : ''"
  />
</template>

<script>
export default {
  props: {
    id: {
      required: true,
    },
    name: {
      required: true,
    },
    size: {
      type: Number,
      default: 100,
    },
    title: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
