<template>
<div class="node-list">
  <h2>Permission nodes</h2>
  <div class="node-list-header">
    <span @click="sort.method = 'permission'">Permission</span>
    <span @click="sort.method = 'value'">Value</span>
    <span @click="sort.method = 'expiry'">Expiry</span>
    <span @click="sort.method = 'server'">Server</span>
    <span @click="sort.method = 'world'">World</span>
    <span @click="sort.method = 'context'">Contexts</span>
  </div>
  <ul>
    <Node v-for="(node, i) in sortedNodes" :node="node" :key="`${i}_${node.permission}`" />
  </ul>
</div>
</template>

<script>
import Node from '@/components/Editor/Node.vue';

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
      if (this.sort.method == 'permission') {
        return this.nodes.sort(this.sortByPermission);
      } else if (this.sort.method == 'value') {
        return this.nodes.sort(this.sortByValue);
      } else if (this.sort.method == 'expiry') {
        return this.nodes.sort(this.sortByExpiry);
      } else if (this.sort.method == 'server') {
        return this.nodes.sort(this.sortByServer);
      } else if (this.sort.method == 'world') {
        return this.nodes.sort(this.sortByWorld);
      } else if (this.sort.method == 'context') {
        return this.nodes.sort(this.sortByContext);
      } else {
        return this.nodes;
      }
    }
  },
  methods: {
    sortByPermission: function(a, b) {
      if (a.permission < b.permission) {
        return -1;
      } else if (a.permission > b.permission) {
        return 1;
      } else {
        return 0;
      }
    },
    sortByValue: function(a, b) {
      if (a.value < b.value) {
        return -1;
      } else if (a.value > b.value) {
        return 1;
      } else {
        return 0;
      }
    },
    sortByExpiry: function(a, b) {
      return a - b;
    },
    sortByServer: function(a, b) {
      if (a.server < b.server) {
        return -1;
      } else if (a.server > b.server) {
        return 1;
      } else {
        return 0;
      }
    },
    sortByWorld: function(a, b) {
      if (a.world < b.world) {
        return -1;
      } else if (a.world > b.world) {
        return 1;
      } else {
        return 0;
      }
    },
    sortByContext: function(a, b) {
      if (a.context < b.context) {
        return -1;
      } else if (a.context > b.context) {
        return 1;
      } else {
        return 0;
      }
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
    padding: .5em 1rem 0;
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
