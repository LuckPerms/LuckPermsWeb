<template>
<div class="node-list">
  <h2>Permission nodes <span>({{ nodes.length }})</span></h2>

  <div class="node-list-header">
    <div class="add-node">
      <div class="row">
        <div class="form-group">
          <label for="permission">Add permission</label>
          <input
            type="text"
            id="permission"
            name="permission"
            v-model="addNode.permission"
            @focus="handlePermissionFocus"
            @blur="handlePermissionBlur"
            @keydown.down="handlePermissionKeyDown"
            @keydown.up="handlePermissionKeyUp"
            @keydown.enter="handlePermissionAddition(null)"
            @keydown.tab="handlePermissionAddition(null)"
          />
        </div>

        <ul
          class="known-permissions"
          v-if="addNode.list && sortedKnownPermissions"
        >
          <li
            v-for="(node, i) in sortedKnownPermissions"
            :key="i + '_' + node"
            :class="{ 'highlighted': i === addNode.highlightedNode }"
            @click.stop="handlePermissionAddition(node)"
          >{{node}}</li>
        </ul>

        <div class="form-group">
          <label>Value</label>
          <code @click="addNode.value = !addNode.value" :class="{'true': addNode.value}">{{addNode.value}}</code>
        </div>

        <div class="form-group">
          <label for="expiry">Expiry</label>
          <input type="text" id="expiry" name="expiry" v-model="addNode.expiry" placeholder="never">
        </div>

        <div class="form-group">
          <label for="server">Server</label>
          <input type="text" id="server" name="server" v-model="addNode.server"  placeholder="global">
        </div>

        <div class="form-group">
          <label for="world">World</label>
          <input type="text" id="world" name="world" v-model="addNode.world"  placeholder="global">
        </div>

        <div class="form-group">
          <label for="contexts">Contexts</label>
          <input type="text" id="contexts" name="contexts" v-model="addNode.contexts"  placeholder="none">
        </div>
      </div>
    </div>

    <div class="sorting-tabs">
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
  data() {
    return {
      sort: {
        method: null,
        desc: true,
      },
      addNode: {
        permission: '',
        highlightedNode: 0,
        list: false,
        value: true,
        expiry: null,
        server: null,
        world: null,
        contexts: null,
      },
    };
  },
  computed: {
    sortedNodes() {
      const sorted = sortBy(this.nodes, [this.sort.method]);

      if (this.sort.desc) {
        return sorted;
      }
      return sorted.reverse();
    },
    knownPermissions() {
      return this.$store.state.editor.knownPermissions;
    },
    sortedKnownPermissions() {
      if (this.addNode.permission !== '') {
        const sortedArray = this.$store.state.editor.knownPermissions
          .filter((node) => node.indexOf(this.addNode.permission) >= 0);

        return sortedArray.slice(0, 100);
      }
      return null;
    },
  },
  methods: {
    changeSort(method) {
      if (this.sort.method === method) {
        this.sort.desc = !this.sort.desc;
      } else {
        this.sort.desc = true;
      }

      this.sort.method = method;
    },
    handlePermissionAddition(node) {
      if (node) {
        this.addNode.permission = node;
      } else {
        this.addNode.permission = this.sortedKnownPermissions[this.addNode.highlightedNode];
      }

      this.addNode.list = false;
    },
    handlePermissionFocus() {
      this.addNode.highlightedNode = 0;
      this.addNode.list = true;
    },
    handlePermissionBlur() {
      setTimeout(() => {
        this.addNode.list = false;
      }, 500);
    },
    handlePermissionKeyDown() {
      this.addNode.list = true;

      if (this.addNode.highlightedNode < this.sortedKnownPermissions.length - 1) {
        this.addNode.highlightedNode++;
      }
    },
    handlePermissionKeyUp() {
      this.addNode.list = true;

      if (this.addNode.highlightedNode > 0) {
        this.addNode.highlightedNode--;
      }
    },
  },
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
    position: sticky;
    top: 4em;
    background-color: rgb(67,67,78);
    border-bottom: 1px solid rgba(0,0,0,0.2);
    z-index: 4;

    .sorting-tabs {
      display: flex;

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
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;

  }

  .add-node {
    background-color: #666670;

    > .row {
      position: relative;
    }

    .known-permissions {
      position: absolute;
      top: 100%;
      left: 0;
      background: #565660;
      z-index: 15;
      width: 40%;
      max-height: 50vh;
      overflow-y: auto;
      padding: .5em 0;
      box-shadow: 0 0 1em rgba(0,0,0,.2);

      li {
        padding: .2em 1em;
        border-bottom: 1px solid rgba(0,0,0,0.2);
        cursor: pointer;
        word-break: break-all;
        font-family: 'Source Code Pro', monospace;

        &:hover {
          background: rgba(255,255,255,.2);
        }

        &.highlighted {
          background: rgba(255,255,255,.2);
        }
      }
    }

    .row {
      display: flex;
      padding: 1em .5em;

      .form-group {
        display: flex;
        flex-direction: column;
        flex: 1 1 12%;
        padding: 0 .5em;
        align-items: flex-start;
        position: relative;

        &:first-child {
          flex: 2 2 40%;
        }

        label {
          line-height: 1;
          margin-bottom: .5em;
        }

        input {
          width: 100%;
          border: 0;
          background: rgba(0,0,0,0.2);
          border-radius: 2px;
          padding: .2em .5em;
          color: #FFF;
          font-family: 'Source Code Pro', monospace;
          line-height: 1.5;
        }


        code {
          color: tomato;
          cursor: pointer;

          &.true {
            color: lawngreen;
          }

          &:hover {
            opacity: .8;
          }
        }
      }
    }
  }
}
</style>
