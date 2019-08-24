<template>
<li :class="{ 'permission-node': true, new: node.new }">
  <div
    v-if="!permission.edit"
    class="permission"
    @click="permission.edit = true"
  >
    <code>{{ node.permission }}</code>
  </div>
  <div v-else class="permission">
    <input
      v-autofocus
      type="text"
      v-model="permission.value"
      @keydown.enter="updateNode('permission', permission)"
      @keydown.tab="updateNode('permission', permission)"
      @blur="updateNode('permission', permission)"
    />
  </div>

  <div class="value" @click="toggleValue(node)">
    <code :class="{'true': node.value}">{{ node.value }}</code>
  </div>

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

  <div
    v-if="!server.edit"
    class="server"
    @click="server.edit = true"
  >
    <code v-if="node.server">{{ node.server }}</code>
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

  <div
    v-if="!world.edit"
    class="world"
    @click="world.edit = true"
  >
    <code v-if="node.world">{{ node.world }}</code>
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
    <code v-if="node.contexts">{{ node.contexts }}</code>
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
        value: this.node.permission,
      },
      expiry: {
        edit: false,
        value: this.node.expiry,
      },
      server: {
        edit: false,
        value: this.node.server,
      },
      world: {
        edit: false,
        value: this.node.world,
      },
      contexts: {
        edit: false,
        value: this.node.contexts,
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
  },
  methods: {
    toggleValue(node) {
      this.$store.commit('toggleNodeValue', node);
    },
    updateNode(type, data) {
      if (this.node[type] !== data.value) {
        this.$store.commit('updateNode', { node: this.node, type, data });
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
