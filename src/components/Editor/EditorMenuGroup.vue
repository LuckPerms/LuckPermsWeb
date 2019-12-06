<template>
  <intersect @enter="isVisible = true" @leave="isVisible = false">
    <span>
      <span>
        {{ group.displayName }}
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
