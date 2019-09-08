<template>
<li :class="{ 'permission-node': true, modified: node.modified, new: node.new }">

<!-- Permission node -->
  <div
    v-if="!permission.edit"
    class="permission"
    @click="permission.edit = true"
  >
    <code>{{ node.key }}</code>
  </div>
  <div v-else class="permission">
    <input
      v-autofocus
      type="text"
      v-model="permission.value"
      @keydown.enter="updateNode('key', permission)"
      @keydown.tab="updateNode('key', permission)"
      @blur="updateNode('key', permission)"
    />
  </div>

  <div class="value" @click="toggleValue(node)">
    <code :class="{'true': node.value}">{{ node.value }}</code>
  </div>

<!--  Expiry -->
  <div
    v-if="!expiry.edit"
    class="expiry"
    @click="expiry.edit = true"
  >
    <code v-if="node.expiry">{{ node.expiry | moment('from') }}</code>
    <code v-else disabled>never</code>
  </div>
  <div v-else class="expiry">
    <datepicker
      @closed="updateNode('expiry', expiry)"
      v-model="expiry.value"
      :disabled-dates="{ to: new Date() }"
      :autofocus="true"
    />
  </div>

<!--  Server context -->
  <div
    v-if="!server.edit"
    class="server"
    @click="server.edit = true"
  >
    <code v-if="node.context.server">{{ node.context.server }}</code>
    <code v-else disabled>global</code>
  </div>
  <div v-else>
    <input
      v-autofocus
      type="text"
      v-model="server.value"
      @keydown.enter="updateNode('server', server)"
      @keydown.tab="updateNode('server', server)"
      @blur="updateNode('server', server)"
    />
  </div>

<!--  World context -->
  <div
    v-if="!world.edit"
    class="world"
    @click="world.edit = true"
  >
    <code v-if="node.context.world">{{ node.context.world }}</code>
    <code v-else disabled>global</code>
  </div>
  <div v-else>
    <input
      v-autofocus
      type="text"
      v-model="world.value"
      @keydown.enter="updateNode('world', world)"
      @keydown.tab="updateNode('world', world)"
      @blur="updateNode('world', world)"
    />
  </div>

  <div class="contexts">
    <code v-if="customContexts.length">{{ customContexts.length }}</code>
    <code v-else disabled>none</code>
  </div>
</li>
</template>

<script>
import Datepicker from 'vuejs-datepicker';

export default {
  name: 'Node',
  components: {
    Datepicker
  },
  data() {
    return {
      permission: {
        edit: false,
        value: this.node.key,
      },
      expiry: {
        edit: false,
        value: this.node.expiry,
      },
      server: {
        edit: false,
        value: this.node.context.server,
      },
      world: {
        edit: false,
        value: this.node.context.world,
      },
      contexts: {
        edit: false,
        value: this.customContexts,
      }
    }
  },
  props: {
    node: Object,
  },
  computed: {
    session() {
      return this.$store.getters.currentSession;
    },
    customContexts() {
      let contexts = [];

      for (let context in this.node.context) {
        if (['server', 'world'].indexOf(context) === -1) contexts.push({
          context: context[context],
        });
      }

      return contexts;
    }
  },
  methods: {
    toggleValue(node) {
      this.$store.commit('toggleNodeValue', node);
    },
    updateNode(type, data) {
      switch (type) {
        case 'key':
        case 'value':
        case 'expiry':
          if (this.node[type] !== data.value) {
            this.$store.commit('updateNode', { node: this.node, type, data });
          }
          break;
        case 'server':
        case 'world':
          if (this.node.context[type] !== data.value) {
            this.$store.commit('updateNodeContext', { node: this.node, type, data });
          }
          break;
      }


      data.edit = false;
    }
  },
};
</script>

<style lang="scss">
.permission-node {
  border-bottom: 1px solid rgba(0,0,0,0.2);
  display: flex;
  cursor: pointer;

  &:hover {
    background-color: rgba(255,255,255,.1);
  }

  &.modified {
    background-color: rgba(252, 252, 0, .15);

    &:hover {
      background-color: rgba(252, 252, 0, .2);
    }
  }

  &.new {
    background-color: rgba(124, 252, 0, .15);

    &:hover {
      background-color: rgba(124, 252, 0, .2);
    }
  }

  > div {
    flex: 1 1 12%;
    padding: .5em 1em;

    &:hover {
      background-color: rgba(255,255,255,.1);
    }
  }

  .permission {
    flex: 2 2 40%;
  }

  code {
    &[disabled] {
      opacity: .5;
    }
  }

  .value {
    code {
      color: tomato;
    }
    .true {
      color: lawngreen;
    }
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
}
</style>
