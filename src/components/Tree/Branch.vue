<template>
  <div class="branch" :class="node ? '' : 'no-node'">
    <div class="node" @click="open = !open" v-if="node">
      <div>
        <button v-if="hasChildren && node">
          <font-awesome icon="caret-right" :rotation="open ? 90 : null" />
        </button>
        <code>{{ node }}</code>
      </div>
      <code v-if="result" :class="result">
        {{ result }}
      </code>
    </div>
    <template v-if="open && hasChildren">
      <branch
        v-for="(branch, node) in branchData"
        :node="node"
        :branch-data="branch"
        :key="node"
      />
    </template>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-self-import
import Branch from './Branch.vue';

export default {
  name: 'branch',
  components: {
    Branch,
  },
  props: {
    node: String,
    branchData: Object,
  },
  data() {
    return {
      open: true,
    };
  },
  computed: {
    hasChildren() {
      return Object.keys(this.branchData).length;
    },
    checkResults() {
      return this.$store.getters.tree.data?.checkResults;
    },
    result() {
      if (!this.checkResults) return null;

      if (Object.keys(this.checkResults).includes(this.node)) {
        return this.checkResults[this.node];
      }

      return null;
    },
  },
  created() {
    this.$root.$on('collapseTree', () => {
      if (this.node) this.open = false;
    });

    this.$root.$on('expandTree', () => {
      this.open = true;
    });
  },
};
</script>

<style lang="scss">
  .branch {
    padding-left: 2rem;

    &.no-node {
      padding-left: 0;

      > .branch {
        padding-left: 0;
      }
    }

    .node {
      background: $grey;
      border-radius: 2px;
      margin-bottom: .2rem;
      cursor: pointer;
      display: flex;
      justify-content: space-between;

      &:hover {
        background: lighten($grey, 10%);
      }

      code {
        background: transparent;
      }
    }

    button {
      background: transparent;
      color: #FFF;
      border: 0;
      padding: 0 .8rem;
      cursor: pointer;
      margin-left: .2rem;
    }
  }
</style>
