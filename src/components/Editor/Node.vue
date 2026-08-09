<template>
  <div :class="{ 'permission-node': true, modified: source.modified, new: source.isNew }">
    <div
      :class="{ 'node-select': true, 'selected': isSelected }"
      @click="toggleNodeSelect()"
      :title="$t('editor.nodes.select')"
    >
      <span></span>
    </div>

    <div
      v-if="!permission.edit"
      class="permission"
      @click="permission.edit = true"
      :title="$t('editor.nodes.edit')"
    >
      <span class="node-type-badge" :class="`badge-${parsedNode.type}`">
        {{ $t(`editor.nodes.types.${parsedNode.type}`) }}
      </span>
      <code class="node-value">
        <template v-if="parsedNode.type === 'permission'">
          {{ source.key }}
        </template>
        <template v-else-if="parsedNode.type === 'inheritance'">
          {{ parsedNode.groupName }}
        </template>
        <template v-else-if="parsedNode.type === 'prefix'">
          {{ parsedNode.prefix }}
          <span class="weight-indicator">({{ $t('editor.nodes.weightLabel') }}: {{ parsedNode.weight }})</span>
        </template>
        <template v-else-if="parsedNode.type === 'suffix'">
          {{ parsedNode.suffix }}
          <span class="weight-indicator">({{ $t('editor.nodes.weightLabel') }}: {{ parsedNode.weight }})</span>
        </template>
        <template v-else-if="parsedNode.type === 'meta'">
          {{ parsedNode.key }} = {{ parsedNode.value }}
        </template>
        <template v-else-if="parsedNode.type === 'weight'">
          {{ parsedNode.weight }}
        </template>
        <template v-else-if="parsedNode.type === 'displayname'">
          {{ parsedNode.displayName }}
        </template>
      </code>
    </div>
    <div v-else class="permission">
      <input
        autofocus
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
      :title="$t('editor.nodes.toggle')"
    >
      <code :class="{'true': source.value}">{{ source.value }}</code>
    </div>

    <div
      v-if="!expiry.edit"
      class="expiry"
      @click="expiry.edit = true"
      :title="$t('editor.nodes.expiry')"
    >
      <code v-if="source.expiry">{{ relativeExpiry }}</code>
      <code v-else disabled>{{ $t('editor.nodes.never') }}</code>

      <button
        v-if="source.expiry"
        class="delete"
        @click.stop="deleteExpiry()"
        :title="$t('editor.nodes.deleteExpiry')"
      >
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
      :title="$t('editor.nodes.contexts')"
    >
      <span v-if="flattenedContexts.length">
        <code v-for="(entry, index) in flattenedContexts" :key="`node_context_${entry.key}_${entry.value}_${index}`">
          <small>{{ entry.key }}:</small> {{ entry.value }}
        </code>
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
          <li v-for="(entry, index) in flattenedContexts" :key="`flattened_context_${entry.key}_${entry.value}_${index}`">
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
                :placeholder="$t('editor.key')"
                @focus="context.keyFocus = true"
                @blur="blurField('keyFocus')"
              >
              <transition name="fade">
                <ul class="context-list" v-if="context.keyFocus">
                  <li
                    v-for="pContext in potentialContexts"
                    :key="`potential_context_key_${pContext.key}`"
                    @click="context.key = pContext.key"
                  >
                    {{ pContext.key }}
                  </li>
                </ul>
              </transition>
            </div>
            <div class="edit">
              <input
                type="text"
                v-model="context.value"
                :placeholder="$t('editor.value')"
                @focus="context.valueFocus = true"
                @blur="blurField('valueFocus')"
                @keydown.enter="addContext"
              >
              <transition name="fade">
                <ul class="context-list" v-if="context.valueFocus">
                  <li
                    v-for="value in potentialContextValues"
                    :key="`potential_context_value_${value}`"
                    @click="context.value = value"
                  >
                    {{ value }}
                  </li>
                </ul>
              </transition>
            </div>
          </li>
        </ul>
        <button @click="addContext">
          <font-awesome icon="plus" />
          {{ $t('editor.nodes.addContext') }}
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
import Datepicker from '@/components/common/DatePicker.vue';
import vClickOutside from 'v-click-outside';
import { relativeDate } from '@/util/date';
import { parseNodeType } from '@/util/editor';

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
    parsedNode() {
      return parseNodeType(this.source.key);
    },
    flattenedContexts() {
      const entries = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, values] of Object.entries(this.source.context)) {
        if (Array.isArray(values)) {
          // eslint-disable-next-line no-restricted-syntax
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
      const context = this.potentialContexts.find(c => c.key === this.context.key);
      if (!context) return null;
      return context.values;
    },
    relativeExpiry() {
      return relativeDate(this.source.expiry, this.$i18n.locale);
    },
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
          // eslint-disable-next-line no-param-reassign
          data.edit = false;
          break;
        case 'context':
          this.$store.commit('updateNodeContext', { node: this.source, data });
          break;
        default:
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

<style>
.permission-node {
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}
.permission-node:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.permission-node.modified {
  background-color: rgba(252, 252, 0, 0.15);
}
.permission-node.modified:hover {
  background-color: rgba(252, 252, 0, 0.2);
}
.permission-node.new {
  background-color: rgba(124, 252, 0, 0.15);
}
.permission-node.new:hover {
  background-color: rgba(124, 252, 0, 0.2);
}
.permission-node > div:not(.context-ui) {
  padding: 0.5em 1em;
}
.permission-node > div:not(.context-ui):hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.permission-node .node-select {
  flex: 0 0 auto;
}
.permission-node .node-select span {
  display: block;
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid var(--color-grey);
  position: relative;
}
.permission-node .node-select.selected span:after {
  position: absolute;
  display: block;
  content: "";
  width: 1rem;
  height: 0.5rem;
  border: 4px solid var(--color-brand);
  border-top: 0;
  border-right: 0;
  transform: rotate(-45deg);
}
.permission-node .permission {
  flex: 2 2 30%;
  word-break: break-all;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.permission-node .permission .node-type-badge {
  display: inline-block;
  padding: 0.2em 0;
  font-size: 0.75em;
  font-weight: bold;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25em;
  text-transform: uppercase;
  font-family: sans-serif;
  flex-shrink: 0;
  min-width: 105px;
}
.permission-node .permission .node-type-badge.badge-permission {
  background-color: #6c757d;
  color: #FFF;
}
.permission-node .permission .node-type-badge.badge-inheritance {
  background-color: #5470c6;
  color: #FFF;
}
.permission-node .permission .node-type-badge.badge-prefix {
  background-color: #91cc75;
  color: #2c3e50;
}
.permission-node .permission .node-type-badge.badge-suffix {
  background-color: #fac858;
  color: #2c3e50;
}
.permission-node .permission .node-type-badge.badge-meta {
  background-color: #ee6666;
  color: #FFF;
}
.permission-node .permission .node-type-badge.badge-weight {
  background-color: #73c0de;
  color: #2c3e50;
}
.permission-node .permission .node-type-badge.badge-displayname {
  background-color: #9a60b4;
  color: #FFF;
}
.permission-node .permission code.node-value {
  font-family: "Source Code Pro", monospace;
  word-break: break-all;
}
.permission-node .permission .weight-indicator {
  opacity: 0.6;
  font-size: 0.85em;
  margin-left: 0.3em;
  font-style: italic;
}
.permission-node .value {
  flex: 1 1 10%;
}
.permission-node .expiry {
  flex: 1 1 15%;
}
.permission-node .expiry .delete {
  background: transparent;
  border: 0;
  margin-left: 0.5rem;
  opacity: 0.75;
  cursor: pointer;
}
.permission-node .expiry .delete:hover {
  opacity: 1;
}
.permission-node .contexts {
  flex: 1 1 20%;
  min-width: 0;
  overflow: hidden;
  position: relative;
}
.permission-node .contexts code:not(:last-child) {
  margin-right: 0.5rem;
}
.permission-node code[disabled] {
  opacity: 0.5;
}
.permission-node code small {
  opacity: 0.5;
}
.permission-node .value code {
  color: var(--color-red);
}
.permission-node .value .true {
  color: var(--color-brand);
}
.permission-node .delete {
  flex: 0 0 3rem;
  color: var(--color-grey);
  text-align: center;
}
.permission-node input {
  width: 100%;
  border: 0;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  padding: 0.2rem 0.5rem;
  color: #FFF;
  font-size: 0.8rem;
  font-family: "Source Code Pro", monospace;
  line-height: 1.5;
}

.context-ui {
  position: absolute;
  background: var(--color-grey);
  padding: 0;
  border-radius: 4px;
  z-index: 11;
  top: 50%;
  right: 3rem;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.2);
  cursor: initial;
  min-width: 25%;
}
.context-ui .close {
  position: absolute;
  top: 0.7rem;
  right: 1rem;
  color: black;
  opacity: 0.25;
  cursor: pointer;
}
.context-ui .close:hover {
  opacity: 0.5;
}
.context-ui h4 {
  padding: 0.8rem 1rem;
  line-height: 1;
  margin: 0;
}
.context-ui h4 span {
  opacity: 0.4;
}
.context-ui > ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.context-ui > ul li {
  width: 100%;
  display: flex;
  background: rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(0, 0, 0, 0.2);
  font-family: "Source Code Pro", monospace;
  font-size: 0.9rem;
}
.context-ui > ul li h5 {
  padding: 0.25rem 1rem;
  margin: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.25);
  color: #FFF;
}
.context-ui > ul li h5 span {
  padding: 0;
  opacity: 0.5;
}
.context-ui > ul li div, .context-ui > ul li span {
  padding: 0.5rem 1rem;
  flex: 1;
}
.context-ui > ul li div.edit, .context-ui > ul li span.edit {
  padding: 0;
  position: relative;
}
.context-ui > ul li div.edit input, .context-ui > ul li span.edit input {
  padding: 0.5rem 1rem;
  width: 100%;
}
.context-ui > ul li:hover button {
  opacity: 0.25;
}
.context-ui > ul li button {
  position: absolute;
  right: 0.2rem;
  background: transparent;
  border: 0;
  padding: 0.7rem;
  opacity: 0;
  cursor: pointer;
}
.context-ui > ul li button:hover {
  opacity: 0.5;
}
.context-ui > ul + button {
  width: 100%;
  font: inherit;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border: 0;
  background: var(--color-brand);
  padding: 0.5rem 1rem;
  font-weight: bold;
  cursor: pointer;
}
.context-ui > ul + button svg {
  margin-right: 0.5rem;
}
.context-ui .context-list {
  position: absolute;
  min-width: 100%;
  top: 100%;
  margin: 0;
  padding: 0;
  background: var(--color-grey);
  max-height: 12rem;
  overflow-y: auto;
}
.context-ui .context-list li {
  padding: 0.5rem 1rem;
  cursor: pointer;
}
.context-ui .context-list li:hover {
  background: rgba(255, 255, 255, 0.05);
}
</style>
