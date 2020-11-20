<template>
  <div :class="{ 'permission-node': true, modified: source.modified, new: source.isNew }">
    <div
      :class="{ 'node-select': true, 'selected': isSelected }"
      @click="toggleNodeSelect()"
      title="Select node for mass operations"
    >
      <span></span>
    </div>

    <div
      v-if="!permission.edit"
      class="permission"
      @click="permission.edit = true"
      title="Click to edit the permission"
    >
      <code>{{ source.key }}</code>
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
      @click="toggleValue()"
      title="Click to toggle true/false"
    >
      <code :class="{'true': source.value}">{{ source.value }}</code>
    </div>

    <div
      v-if="!expiry.edit"
      class="expiry"
      @click="expiry.edit = true"
      title="Click to choose an expiry"
    >
      <code v-if="source.expiry">{{ relativeExpiry }}</code>
      <code v-else disabled>never</code>

      <button v-if="source.expiry" class="delete" @click.stop="deleteExpiry()" title="Delete expiry">
        <font-awesome icon="times" />
      </button>
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
      <span v-if="flattenedContexts.length">
        <code v-for="entry in flattenedContexts"><small>{{ entry.key }}:</small> {{ entry.value }}</code>
      </span>
      <code v-else disabled>none</code>
    </div>

    <div class="delete" @click="deleteNode(source.id)">
      <font-awesome icon="times" />
    </div>

    <transition name="fade">
      <div v-if="context.ui" class="context-ui" v-click-outside="closeContextUi">
        <h4>Contexts <span>({{ flattenedContexts.length }})</span></h4>
        <div class="close" @click="closeContextUi">
          <font-awesome icon="times" />
        </div>
        <ul>
          <li v-for="entry in flattenedContexts">
            <span>{{ entry.key }}</span>
            <span>{{ entry.value }}</span>
            <button @click="removeContext(entry.key, entry.value)">
              <font-awesome icon="times" fixed-width />
            </button>
          </li>
          <li>
            <h5>
              Add context:
              <span class="lighter">(world, server, etc.)</span>
            </h5>
          </li>
          <li>
            <div class="edit">
              <input
                type="text"
                v-model="context.key"
                placeholder="key"
                @focus="context.keyFocus = true"
                @blur="blurField('keyFocus')"
              >
              <transition name="fade">
                <ul class="context-list" v-if="context.keyFocus">
                  <li
                    v-for="pContext in potentialContexts"
                    @click="context.key = pContext.key"
                  >{{ pContext.key }}</li>
                </ul>
              </transition>
            </div>
            <div class="edit">
              <input
                type="text"
                v-model="context.value"
                placeholder="value"
                @focus="context.valueFocus = true"
                @blur="blurField('valueFocus')"
                @keydown.enter="addContext"
              >
              <transition name="fade">
                <ul class="context-list" v-if="context.valueFocus">
                  <li
                    v-for="value in potentialContextValues"
                    @click="context.value = value"
                  >{{ value }}</li>
                </ul>
              </transition>
            </div>
          </li>
        </ul>
        <button @click="addContext">
          <font-awesome icon="plus" />
          Add context
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
import Datepicker from '@turbotailz/vuejs-datepicker';
import vClickOutside from 'v-click-outside';
import { relativeDate } from '@/util/date';

export default {
  name: 'Node',
  components: {
    Datepicker,
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
  data() {
    return {
      permission: {
        edit: false,
        value: this.source.key,
      },
      expiry: {
        edit: false,
        value: this.source.expiry,
      },
      context: {
        ui: false,
        key: '',
        value: '',
        keyFocus: false,
        valueFocus: false,
      },
    };
  },
  props: {
    source: Object,
  },
  computed: {
    session() {
      return this.$store.getters.currentSession;
    },
    selectedNodes() {
      return this.$store.getters.selectedNodeIds;
    },
    isSelected() {
      return this.selectedNodes.indexOf(this.source.id) >= 0;
    },
    flattenedContexts() {
      const entries = [];
      for (const [key, values] of Object.entries(this.source.context)) {
        if (Array.isArray(values)) {
          for (const value of values) {
            entries.push({ key, value });
          }
        } else {
          entries.push({ key, value: values });
        }
      }
      return entries;
    },
    potentialContexts() {
      return this.$store.getters.potentialContexts;
    },
    potentialContextValues() {
      if (!this.context.key) return null;
      const context = this.potentialContexts.find(pContext => pContext.key === this.context.key);
      if (!context) return null;
      return context.values;
    },
    relativeExpiry() {
      return relativeDate(this.source.expiry);
    }
  },
  methods: {
    toggleNodeSelect() {
      this.$store.commit('toggleNodeSelect', this.source);
    },
    toggleValue() {
      this.$store.commit('toggleNodeValue', this.source);
    },
    updateNode(type, data) {
      switch (type) {
        case 'key':
        case 'value':
        case 'expiry':
          if (this.source[type] !== data.value) {
            this.$store.commit('updateNode', { node: this.source, type, data });
          }
          data.edit = false;
          break;
        case 'context':
          this.$store.commit('updateNodeContext', { node: this.source, data });
          break;
      }
    },
    deleteExpiry() {
      this.updateNode('expiry', { value: null });
    },
    deleteNode(nodeId) {
      this.$store.commit('deleteNode', nodeId);
    },
    closeContextUi() {
      this.context.ui = false;
    },
    addContext() {
      if (this.context.key === '' || this.context.value === '') return;

      const key = this.context.key.trim();
      const value = this.context.value.trim();

      const context = JSON.parse(JSON.stringify(this.source.context));

      let values = context[key] || [];
      if (!Array.isArray(values)) {
        values = [values];
      }

      if (!values.find(val => val === value)) {
        values.push(value);
        context[key] = values;
        this.updateNode('context', context);
      }

      this.context.key = '';
      this.context.value = '';
    },
    removeContext(key, value) {
      const context = JSON.parse(JSON.stringify(this.source.context));

      let values = context[key] || [];
      if (!Array.isArray(values)) {
        values = [values];
      }

      if (values.find(v => v === value)) {
        context[key] = values.filter(v => v !== value);
        this.updateNode('context', context);
      }
    },
    blurField(type) {
      setTimeout(() => {
        this.context[type] = false;
      }, 250);
    },
  },
};
</script>

<style lang="scss">
.permission-node {
  border-bottom: 1px solid rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
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
    word-break: break-all;
  }

  .value {
    flex: 1 1 10%;
  }

  .expiry {
    flex: 1 1 15%;

    .delete {
      background: transparent;
      border: 0;
      margin-left: .5rem;
      opacity: .75;
      cursor: pointer;

      &:hover {
        opacity: 1;
      }
    }
  }

  .contexts {
    flex: 1 1 20%;
    min-width: 0;
    overflow: hidden;
    position: relative;

    code {
      &:not(:last-child) {
        margin-right: .5rem;
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
    padding: .2rem .5rem;
    color: #FFF;
    font-size: .8rem;
    font-family: 'Source Code Pro', monospace;
    line-height: 1.5;
  }
}

.context-ui {
  position: absolute;
  background: $grey;
  padding: 0;
  border-radius: 4px;
  z-index: 11;
  top: 50%;
  right: 3rem;
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

  > ul {
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

      h5 {
        padding: .25rem 1rem;
        margin: 0;
        width: 100%;
        background: rgba(0,0,0,.25);
        color: #FFF;

        span {
          padding: 0;
          opacity: .5;
        }
      }

      div, span {
        padding: .5rem 1rem;
        flex: 1;

        &.edit {
          padding: 0;
          position: relative;

          input {
            padding: .5rem 1rem;
            width: 100%;
          }
        }
      }

      &:hover {
        button {
          opacity: .25;
        }
      }

      button {
        position: absolute;
        right: .2rem;
        background: transparent;
        border: 0;
        padding: .7rem;
        opacity: 0;
        cursor: pointer;

        &:hover {
          opacity: .5;
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

  .context-list {
    position: absolute;
    min-width: 100%;
    top: 100%;
    margin: 0;
    padding: 0;
    background: $grey;
    max-height: 12rem;
    overflow-y: auto;

    li {
      padding: .5rem 1rem;
      cursor: pointer;

      &:hover {
        background: rgba(255,255,255,.05);
      }
    }
  }
}
</style>
