<template>
<div class="node-list">
  <h2>Permission nodes <span>({{ nodes.length }})</span></h2>

  <div class="node-list-header">
    <span :class="{'active': sort.method == 'permission'}" @click="changeSort('permission')">
      Permission
      <font-awesome v-if="sort.method == 'permission'" :class="{'reverse': !sort.desc}" icon="chevron-circle-down" />
    </span>

    <span :class="{'active': sort.method == 'value'}" @click="changeSort('value')">
      Value
      <font-awesome v-if="sort.method == 'value'" :class="{'reverse': !sort.desc}" icon="chevron-circle-down" />
    </span>

    <span :class="{'active': sort.method == 'expiry'}" @click="changeSort('expiry')">
      Expiry
      <font-awesome v-if="sort.method == 'expiry'" :class="{'reverse': !sort.desc}" icon="chevron-circle-down" />
    </span>

    <span :class="{'active': sort.method == 'server'}" @click="changeSort('server')">
      Server
      <font-awesome v-if="sort.method == 'server'" :class="{'reverse': !sort.desc}" icon="chevron-circle-down" />
    </span>

    <span :class="{'active': sort.method == 'world'}" @click="changeSort('world')">
      World
      <font-awesome v-if="sort.method == 'world'" :class="{'reverse': !sort.desc}" icon="chevron-circle-down" />
    </span>

    <span :class="{'active': sort.method == 'contexts'}" @click="changeSort('contexts')">
      Contexts
      <font-awesome v-if="sort.method == 'contexts'" :class="{'reverse': !sort.desc}" icon="chevron-circle-down" />
    </span>
  </div>
  <ul>
    <Node v-for="(node, i) in sortedNodes" :node="node" :key="`node_${node.id}`" />
  </ul>
</div>
</template>

<script>
import Node from '@/components/Editor/Node.vue';

const sortBy = require('lodash.sortby');

export default {
  name: 'NodeList',
  components: {
    Node,
  },
  props: {
    nodes: Array,
  },
  data: function() {
    return {
      sort: {
        method: null,
        desc: true,
      }
    }
  },
  computed: {
    sortedNodes: function() {
      let sorted = sortBy(this.nodes, [this.sort.method]);

      if (this.sort.desc) {
        return sorted;
      } else {
        return sorted.reverse();
      }
    }
  },
  methods: {
    changeSort: function(method) {
      if (this.sort.method == method) {
        this.sort.desc = !this.sort.desc;
      } else {
        this.sort.desc = true;
      }

      this.sort.method = method;
    },
  }
};
</script>

<style lang="scss">
.node-list {
  background-color: rgba(255,255,255,.2);
  flex: 1;
  position: relative;

  h2 {
    margin: 0;
    margin-bottom: .5em;
    padding: .5em 1rem 0;

    span {
      margin-left: .5em;
      opacity: .5;
    }
  }

  .node-list-header {
    display: flex;
    position: sticky;
    top: 4em;
    background-color: rgb(67,67,78);
    border-bottom: 1px solid rgba(0,0,0,0.2);
    z-index: 5;

    > span {
      flex: 1 1 12%;
      padding: .5em 1em;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &.active {
        background: rgba(255,255,255,.1);
      }

      svg {
        opacity: .5;
        transition: transform .3s;

        &.reverse {
          transform: rotate(180deg);
        }
      }

      &:hover {
        background: rgba(255,255,255,0.2);
      }

      &:first-child {
        flex: 2 2 40%;
      }
    }
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;

  }
}
</style>
