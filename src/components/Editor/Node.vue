<template>
<li :class="{ 'permission-node': true, modified: node.modified, new: node.new }">
  <div
    :class="{ 'node-select': true, 'selected': isSelected }"
    @click="toggleNodeSelect(node.id)"
    title="Select node for mass operations"
  >
    <span></span>
  </div>

<!-- Permission node -->
  <div
    v-if="!permission.edit"
    class="permission"
    @click="permission.edit = true"
    title="Click to edit the permission"
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

  <div
    class="value"
    @click="toggleValue(node)"
    title="Click to toggle true/false"
  >
    <code :class="{'true': node.value}">{{ node.value }}</code>
  </div>

<!--  Expiry -->
  <div
    v-if="!expiry.edit"
    class="expiry"
    @click="expiry.edit = true"
    title="Click to choose an expiry"
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
    class="contexts"
    @click="context.ui = true"
    title="Click to edit the contexts for this node"
  >
    <span v-if="Object.keys(node.context).length">
      <code v-for="(value, key) in node.context"><small>{{ key }}:</small> {{ value }}</code>
    </span>
    <code v-else disabled>none</code>
  </div>

  <div class="delete" @click="deleteNode(node.id)">
    <font-awesome icon="times" />
  </div>

  <transition name="fade">
    <div v-if="context.ui" class="context-ui" v-click-outside="closeContextUi">
      <h4>Contexts <span>({{ Object.keys(node.context).length }})</span></h4>
      <div class="close" @click="closeContextUi">
        <font-awesome icon="times" />
      </div>
      <ul>
        <li v-for="(value, key) in node.context">
          <span v-html="key"></span>
          <span v-html="value"></span>
        </li>
        <li>
          <span class="edit">
            <input type="text" v-model="context.key" placeholder="key">
          </span>
          <span class="edit">
            <input type="text" v-model="context.value" placeholder="value">
          </span>
        </li>
      </ul>
      <button @click="addContext">
        <font-awesome icon="plus" />
        Add context
      </button>
    </div>
  </transition>
</li>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
import vClickOutside from 'v-click-outside';

export default {
  name: 'Node',
  components: {
    Datepicker
  },
  directives: {
    clickOutside: vClickOutside.directive
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
      context: {
        ui: false,
        key: '',
        value: '',
      }
    }
  },
  props: {
    node: Object,
    selectedNodes: Array,
  },
  computed: {
    session() {
      return this.$store.getters.currentSession;
    },
    isSelected() {
      return this.selectedNodes.indexOf(this.node.id) >= 0;
    },
  },
  methods: {
    toggleNodeSelect(nodeId) {
      this.$store.commit('toggleNodeSelect', nodeId);
    },
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
          data.edit = false;
          break;
        case 'context':
          this.$store.commit('updateNodeContext', { node: this.node, data });
          break;
      }
    },
    deleteNode(nodeId) {
      this.$store.commit('deleteNode', nodeId);
    },
    closeContextUi() {
      this.context.ui = false;
    },
    addContext() {
      if (this.context.key === '' || this.context.value === '') return;

      let context = JSON.parse(JSON.stringify(this.node.context));

      context[this.context.key] = this.context.value;

      this.updateNode('context', context);
      this.context.key = '';
      this.context.value = '';
    }
  },
};
</script>

<style lang="scss">
.permission-node {
  border-bottom: 1px solid rgba(0,0,0,0.2);
  display: flex;
  cursor: pointer;
  transition: all .3s;
  position: relative;

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

  > div:not(.context-ui) {
    padding: .5em 1em;

    &:hover {
      background-color: rgba(255,255,255,.1);
    }
  }

  .node-select {
    flex: 0 0 auto;

    span {
      display: block;
      width: 1.5rem;
      height: 1.5rem;
      border: 2px solid $grey;
      position: relative;
    }

    &.selected {
      span {
        &:after {
          position: absolute;
          display: block;
          content: '';
          width: 1rem;
          height: .5rem;
          border: 4px solid $brand-color;
          border-top: 0;
          border-right: 0;
          transform: rotate(-45deg);
        }
      }
    }
  }

  .permission {
    flex: 2 2 30%;
  }

  .value {
    flex: 1 1 10%;
  }

  .expiry {
    flex: 1 1 15%;
  }

  .contexts {
    flex: 1 1 20%;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    position: relative;

    code {
      &:not(:last-child) {
        margin-right: .5rem;
      }
    }
  }

  .context-ui {
    position: absolute;
    background: $grey;
    padding: 0;
    border-radius: 4px;
    z-index: 10;
    top: 50%;
    right: 3rem;
    transform: translateY(-50%);
    box-shadow: 0 0 1em rgba(0,0,0,.2);
    cursor: initial;
    min-width: 25%;

    .close {
      position: absolute;
      top: .7rem;
      right: 1rem;
      color: black;
      opacity: .25;
      cursor: pointer;

      &:hover {
        opacity: .5;
      }
    }

    h4 {
      padding: .8rem 1rem;
      line-height: 1;
      margin: 0;

      span {
        opacity: .4;
      }
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;

      li {
        width: 100%;
        display: flex;
        background: rgba(0,0,0,.1);
        border-top: 1px solid rgba(0,0,0,0.2);
        font-family: 'Source Code Pro', monospace;
        font-size: .9rem;

        span {
          padding: .5rem 1rem;

          &:first-child {
            flex: none;
            opacity: .5;
          }

          &:last-child {
            flex: auto;
          }

          &.edit {
            padding: 0;

            input {
              padding: .5rem 1rem;
            }
          }
        }
      }

      + button {
        width: 100%;
        font: inherit;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        border: 0;
        background: $brand-color;
        padding: .5rem 1rem;
        font-weight: bold;
        cursor: pointer;

        svg {
          margin-right: .5rem;
        }
      }
    }
  }

  code {
    &[disabled] {
      opacity: .5;
    }

    small {
      opacity: .5;
    }
  }

  .value {
    code {
      color: $red;
    }
    .true {
      color: $brand-color;
    }
  }

  .delete {
    flex: 0 0 3rem;
    color: $grey;
    text-align: center;
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
