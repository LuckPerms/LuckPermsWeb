<template>
  <div class="branch" :class="hasChildren ? 'has-children' : 'no-children'">
    <button @click="open = !open" v-if="hasChildren && node">
      <font-awesome icon="caret-right" :rotation="open ? 90 : 0" />
    </button>
    <code v-if="node">{{ node }}</code>
    <branch
      v-for="(branch, node) in branchData"
      :node="node"
      :branch-data="branch"
      v-if="open && hasChildren"
    />
  </div>
</template>

<script>
  import Branch from './Branch';

  export default {
    name: 'branch',
    components: {
      Branch
    },
    props: {
      node: String,
      branchData: Object
    },
    data() {
      return {
        open: true,
      }
    },
    computed: {
      hasChildren() {
        return Object.keys(this.branchData).length;
      }
    },
    created() {
      this.$root.$on('collapseTree', () => {
        if (this.node) this.open = false;
      });

      this.$root.$on('expandTree', () => {
        this.open = true;
      });
    }
  }
</script>

<style lang="scss">
  .branch {
    padding-left: 1rem;

    &.no-children {
      padding-left: 2em;
    }

    button {
      background: transparent;
      color: #FFF;
      border: 0;
    }
  }
</style>
