<template>
  <img
    class="avatar"
    :src="`https://crafthead.net/helm/${key}/8`"
    :alt="$t('avatar', { name })"
    :title="title ? $t('avatar', { name }) : ''"
    @error="replaceWithDefault"
  />
</template>

<script>
import defaultSkin from '../assets/defaultskin.png';

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
  methods: {
    replaceWithDefault(e) {
      e.target.src = defaultSkin;
    },
  },
};
</script>

<style lang="scss">
.avatar {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: pixelated;
}
</style>
