<template>
  <img
    class="avatar"
    :src="platform === 'Hytale' ? `https://crafthead.net/hytale/helm/${key}/24` : `https://crafthead.net/helm/${key}/24`"
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
    platform() {
      return this.$store.getters.metaData?.platform
        ?? this.$store.getters.verbose?.metadata?.platform
        ?? this.$store.getters.tree?.metadata?.platform
        ?? "Minecraft";
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
