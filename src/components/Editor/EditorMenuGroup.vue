<template>
  <intersect @enter="isVisible = true" @leave="isVisible = false">
    <span class="group">
      <span class="group-name">
        <span class="group-display">{{ group.displayName }}</span>
        <small v-if="group.displayName !== group.id">{{ group.id }}</small>
      </span>
      <span v-if="isVisible">
        <span v-if="weight" class="weight" title="Weight">
          {{ weight }}
        </span>
        <button @click="deleteGroup" v-if="group.id !== 'default'">
          <font-awesome icon="times" fixed-width />
        </button>
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

  props: {
    group: Object
  },

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

  methods: {
    deleteGroup() {
      this.$store.commit('deleteGroup', this.group.id);
    }
  }
};
</script>

<style lang="scss" scoped>
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

  button {
    background: transparent;
    color: white;
    opacity: 0;
    border: 0;
    cursor: pointer;
    padding: 0 .5rem;

    &:hover {
      opacity: 1 !important;
    }
  }
</style>
