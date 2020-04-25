<template>
  <div class="branch" :class="!node ? 'no-node' : ''">
    <div class="node" @click="open = !open" v-if="node">
      <button v-if="hasChildren && node">
        <font-awesome icon="caret-right" :rotation="open ? 90 : 0" />
      </button>
      <code>{{ node }}</code>
    </div>
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
