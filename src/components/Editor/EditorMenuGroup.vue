<template>
  <span>
    <span>
      {{ group.displayName }}
      <small v-if="group.displayName !== group.id">{{ group.id }}</small>
    </span>

    <span v-if="weight" class="weight" title="Weight">
      {{ weight }}
    </span>
  </span>
</template>

<script>
export default {
  name: 'EditorMenuGroup',
  props: { group: Object },
  computed: {
    weightNodes() {
      return this.$store.getters.weightNodes;
    },
    weight() {
      const node = this.weightNodes.find(node => node.sessionId === this.group.id);

      if (!node) return null;

      return node.key.split('weight.')[1];
    },
  },
};
</script>
