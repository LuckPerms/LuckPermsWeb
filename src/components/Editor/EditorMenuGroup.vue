<template>
  <intersect @enter="isVisible = true" @leave="isVisible = false">
    <span>
      <span class="group-name">
        <span class="group-display">{{ group.displayName }}</span>
        <small v-if="group.displayName !== group.id">{{ group.id }}</small>
      </span>



        <span v-if="isVisible && weight" class="weight" title="Weight">
          {{ weight }}
        </span>
    </span>
  </intersect>
</template>

<script>
import Intersect from 'vue-intersect';

export default {
  name: 'EditorMenuGroup',

  components: {
    Intersect,
  },

  data() {
    return {
      isVisible: false,
    }
  },
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

<style lang="scss">
  .group-name {
    max-width: 85%;
  }

  .group-display {
    white-space: nowrap;
    max-width: 100%;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
