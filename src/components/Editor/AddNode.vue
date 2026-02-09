<template>
  <div class="add-node">
    <form class="row" autocomplete="off" @submit.prevent>

      <!-- Node input -->
      <div class="form-group node-builder" v-if="!selectedNodes.length">
        <label for="nodeType">{{ $t('editor.nodes.add') }}</label>
        <div class="node-builder-row">

          <!-- Node type selector -->
          <select id="nodeType" v-model="nodeType" class="node-type-select">
            <option v-for="type in nodeTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </option>
          </select>

          <!-- Permission input -->
          <div v-if="nodeType === 'permission'" class="node-type-inputs">
            <div class="input-group">
              <label class="input-label">{{ $t('editor.nodes.labels.permissions') }}</label>
              <multiselect
                v-model="nodeParts.permissionsList"
                :options="knownPermissions"
                :multiple="true"
                :taggable="true"
                :clearOnSelect="false"
                @tag="onPermissionTag"
                :tag-placeholder="$t('editor.nodes.enterToSelect')"
                :placeholder="$t('editor.nodes.permissionPlaceholder')"
                :close-on-select="false"
              />
            </div>
          </div>

          <!-- Inheritance input -->
          <div v-else-if="nodeType === 'inheritance'" class="node-type-inputs">
            <div class="input-group">
              <label class="input-label">{{ $t('editor.nodes.labels.groupName') }}</label>
              <multiselect
                v-model="nodeParts.groupName"
                :options="knownGroups"
                :taggable="true"
                :searchable="true"
                :multiple="false"
                :close-on-select="true"
                :placeholder="$t('editor.nodes.groupNamePlaceholder')"
              />
            </div>
          </div>

          <!-- Prefix input -->
          <div v-else-if="nodeType === 'prefix'" class="node-type-inputs">
            <div class="input-group" style="flex: 0 0 80px;">
              <label class="input-label">{{ $t('editor.nodes.labels.weight') }}</label>
              <input
                type="number"
                v-model="nodeParts.weight"
                class="node-input"
              />
            </div>
            <div class="input-group flex-grow">
              <label class="input-label">{{ $t('editor.nodes.labels.prefixText') }}</label>
              <input
                type="text"
                v-model="nodeParts.prefix"
                :placeholder="$t('editor.nodes.prefixPlaceholder')"
                class="node-input"
              />
            </div>
          </div>

          <!-- Suffix input -->
          <div v-else-if="nodeType === 'suffix'" class="node-type-inputs">
            <div class="input-group" style="flex: 0 0 80px;">
              <label class="input-label">{{ $t('editor.nodes.labels.weight') }}</label>
              <input
                type="number"
                v-model="nodeParts.weight"
                class="node-input"
              />
            </div>
            <div class="input-group flex-grow">
              <label class="input-label">{{ $t('editor.nodes.labels.suffixText') }}</label>
              <input
                type="text"
                v-model="nodeParts.suffix"
                :placeholder="$t('editor.nodes.suffixPlaceholder')"
                class="node-input"
              />
            </div>
          </div>

          <!-- Meta input -->
          <div v-else-if="nodeType === 'meta'" class="node-type-inputs">
            <div class="input-group">
              <label class="input-label">{{ $t('editor.nodes.labels.key') }}</label>
              <input
                type="text"
                v-model="nodeParts.key"
                :placeholder="$t('editor.nodes.metaKeyPlaceholder')"
                class="node-input"
              />
            </div>
            <div class="input-group">
              <label class="input-label">{{ $t('editor.nodes.labels.value') }}</label>
              <input
                type="text"
                v-model="nodeParts.value"
                :placeholder="$t('editor.nodes.metaValuePlaceholder')"
                class="node-input"
              />
            </div>
          </div>

          <!-- Weight input -->
          <div v-else-if="nodeType === 'weight'" class="node-type-inputs">
            <div class="input-group">
              <label class="input-label">{{ $t('editor.nodes.labels.weightValue') }}</label>
              <input
                type="number"
                v-model="nodeParts.weight"
                :placeholder="$t('editor.nodes.weightValuePlaceholder')"
                class="node-input"
              />
            </div>
          </div>

          <!-- Display Name input -->
          <div v-else-if="nodeType === 'displayname'" class="node-type-inputs">
            <div class="input-group input-with-warning">
              <label class="input-label">{{ $t('editor.nodes.labels.displayName') }}</label>
              <div class="input-wrapper">
                <input
                  type="text"
                  v-model="nodeParts.displayName"
                  :placeholder="$t('editor.nodes.displayNamePlaceholder')"
                  class="node-input"
                />
                <span class="warning-icon">
                  <font-awesome icon="exclamation-circle" />
                  <span class="tooltip">{{ $t('editor.nodes.displayNameWarning') }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="form-group bulk-edit">
        <p>
          <span v-html="$tc('editor.nodes.selected', selectedNodes.length)" />
          <button @click="deselectNodes" :title="$t('editor.nodes.deselect')">
            <font-awesome icon="times" />
          </button>
        </p>
        <div class="buttons">
          <button @click="copyNodes">
            <font-awesome icon="clone" />
            {{ $t('editor.copy') }}
          </button>
          <button @click="moveNodes">
            <font-awesome icon="sign-in-alt" />
            {{ $t('editor.move') }}
          </button>
          <button @click="deleteNodes">
            <font-awesome icon="times" />
            {{ $t('editor.delete') }}
          </button>
        </div>
      </div>

      <div>
        <div class="form-group">
          <label v-if="!selectedNodes.length">
            {{ $t('editor.value') }}
            <button
              type="button"
              @click="value = !value"
              :class="{ code: true, 'true': value}"
            >
              {{ value }}
            </button>
          </label>
          <div v-else class="bulk-value">
            <label>{{ $t('editor.value') }}</label>
            <div>
              <button
                type="button"
                class="code true"
                :class="{ selected: bulk.value === true }"
                @click="bulk.value = true"
                :title="$t('editor.nodes.selection.true')"
              >
                true
              </button>
              <button
                type="button"
                class="code null"
                :class="{ selected: bulk.value === null }"
                @click="bulk.value = null"
                :title="$t('editor.nodes.selection.keep')"
              >
                -
              </button>
              <button
                type="button"
                class="code false"
                :class="{ selected: bulk.value === false }"
                @click="bulk.value = false"
                :title="$t('editor.nodes.selection.false')"
              >
                false
              </button>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="expiry">{{ $t('editor.expiry') }}</label>
          <datepicker
            id="expiry"
            name="expiry"
            v-model="expiry"
            :placeholder="$t('editor.nodes.never')"
            :disabled-dates="{ to: new Date() }"
          />
        </div>
      </div>

      <div class="form-group contexts">
        <label v-if="!selectedNodes.length">
          {{ $t('editor.contexts') }}
          <button
            type="button"
            class="code"
            :title="$t('editor.nodes.addContexts')"
            @click="context.ui = true"
          >
            <font-awesome icon="plus" />
          </button>
        </label>
        <div class="bulk-contexts" v-else>
          <label for="bulk_contexts">{{ $t('editor.contexts') }}</label>
          <div>
            <button
              id="bulk_contexts_replace"
              :class="{ selected: bulk.replaceContexts }"
              @click="bulk.replaceContexts = !bulk.replaceContexts"
              :title="$t('editor.nodes.replace')"
            >
              <font-awesome icon="check" />
              {{ $t('editor.replace') }}
            </button>
            <button
              id="bulk_contexts"
              type="button"
              class="code"
              :title="$t('editor.nodes.addContexts')"
              @click="context.ui = true"
            >
              <font-awesome icon="plus" />
            </button>
          </div>
        </div>
        <div>
          <code v-for="(entry, index) in flattenedContexts" :key="`add_node_context_${entry.key}_${entry.value}_${index}`">
            <span>{{ entry.key }}:</span>
            {{ entry.value }}
          </code>
        </div>
      </div>

      <button
        v-if="!selectedNodes.length"
        type="submit"
        :disabled="!canAddNode"
        :title="$t('editor.nodes.add')"
        @click="addNodesToSession"
      >
        <span>
          <font-awesome icon="plus" />
          {{ $t('editor.add') }}
        </span>
      </button>
      <button
        v-else
        type="submit"
        :disabled="!canUpdateNode"
        :title="$t('editor.nodes.update')"
        @click="updateNodes"
      >
        <span>
          <font-awesome icon="edit" />
          {{ $t('editor.update') }}
        </span>
      </button>
    </form>

    <transition name="fade">
      <div v-if="context.ui" class="context-ui" v-click-outside="closeContextUi">
        <h4 v-html="$tc('editor.nodes.contextsCount', flattenedContexts.length)" />
        <div class="close" @click="closeContextUi">
          <font-awesome icon="times" />
        </div>
        <ul>
          <li v-for="(entry, index) in flattenedContexts" :key="`add_node_flattened_context_${entry.key}_${entry.value}_${index}`">
            <span v-html="entry.key"></span>
            <span v-html="entry.value"></span>
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
                  >{{ pContext.key }}</li>
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
                  >{{ value }}</li>
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
import Datepicker from '@turbotailz/vuejs-datepicker';
import Multiselect from 'vue-multiselect';
import vClickOutside from 'v-click-outside';
import { buildNodeKey } from '@/util/editor';

export default {
  name: 'AddNode',
  components: {
    Datepicker,
    Multiselect,
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
  data() {
    return {
      nodeType: 'permission',
      nodeParts: {
        permission: '',
        permissionsList: [],
        groupName: null,
        weight: '',
        prefix: '',
        suffix: '',
        key: '',
        value: '',
        displayName: '',
      },
      value: true,
      expiry: null,
      server: null,
      world: null,
      context: {
        contexts: {},
        ui: null,
        key: '',
        value: '',
        keyFocus: false,
        valueFocus: false,
      },
      bulk: {
        value: null,
        replaceContexts: false,
      },
    };
  },
  computed: {
    session() {
      return this.$store.getters.currentSession || null;
    },
    knownPermissions() {
      return this.$store.state.editor.knownPermissions;
    },
    knownGroups() {
      const sessionSet = this.$store.getters.sessionSet || [];
      return sessionSet
        .filter(session => session.type === 'inheritance')
        .map(group => group.id);
    },
    nodeTypes() {
      const allTypes = ['permission', 'inheritance', 'prefix', 'suffix', 'meta', 'weight', 'displayname'];
      const isUser = this.session && this.session.type === 'user';

      // weight and display name only show for groups
      const availableTypes = isUser
        ? allTypes.filter(type => !['weight', 'displayname'].includes(type))
        : allTypes;

      return availableTypes.map(type => (
        { value: type, label: this.$t(`editor.nodes.types.${type}`) }
      ));
    },
    canAddNode() {
      if (this.nodeType === 'permission') {
        return this.nodeParts.permissionsList.length > 0;
      }
      if (this.nodeType === 'inheritance') {
        return this.nodeParts.groupName !== null && this.nodeParts.groupName !== '';
      }
      if (this.nodeType === 'prefix') {
        return this.nodeParts.prefix.trim() !== '';
      }
      if (this.nodeType === 'suffix') {
        return this.nodeParts.suffix.trim() !== '';
      }
      if (this.nodeType === 'meta') {
        return this.nodeParts.key.trim() !== '' && this.nodeParts.value.trim() !== '';
      }
      if (this.nodeType === 'weight') {
        return this.nodeParts.weight.trim() !== '';
      }
      if (this.nodeType === 'displayname') {
        return this.nodeParts.displayName.trim() !== '';
      }
      return false;
    },
    flattenedContexts() {
      const entries = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, values] of Object.entries(this.context.contexts)) {
        // eslint-disable-next-line no-restricted-syntax
        for (const value of values) {
          entries.push({ key, value });
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
    selectedNodes() {
      return this.$store.getters.selectedNodeIds;
    },
    canUpdateNode() {
      return (this.expiry || this.bulk.value !== null || Object.keys(this.context.contexts).length);
    },
  },
  watch: {
    session(newSession) {
      if (newSession && newSession.type === 'user') {
        if (this.nodeType === 'weight' || this.nodeType === 'displayname') {
          this.nodeType = 'permission';
        }
      }
    },
  },
  methods: {
    onPermissionTag(tag) {
      const permissions = tag.split(/,\s*|\s+|\s*-\s+/);

      permissions.forEach((permission) => {
        if (permission === '') return;

        this.nodeParts.permissionsList.push(permission);

        if (!this.knownPermissions.find(knownPermission => knownPermission === permission)) {
          this.addKnownPermission(permission);
        }
      });
    },
    addKnownPermission(permission) {
      this.$store.dispatch('addKnownPermission', permission);
    },
    addNodesToSession() {
      if (this.nodeType === 'permission' && this.nodeParts.permissionsList.length > 0) {
        const nodes = [];
        this.nodeParts.permissionsList.forEach((permission) => {
          nodes.push({
            sessionId: this.session.id,
            type: 'permission',
            key: permission,
            value: this.value,
            expiry: this.expiry,
            context: this.context.contexts,
            isNew: true,
          });
        });
        this.$store.dispatch('addNodes', nodes);
      } else {
        if (!this.canAddNode) return;

        const key = buildNodeKey(this.nodeType, this.nodeParts);
        if (!key) return;
        const node = {
          sessionId: this.session.id,
          type: 'permission',
          key,
          value: this.value,
          expiry: this.expiry,
          context: this.context.contexts,
          isNew: true,
        };
        this.$store.dispatch('addNodes', [node]);
      }
      this.reset();
    },
    reset() {
      this.nodeParts = {
        permission: '',
        permissionsList: [],
        groupName: null,
        weight: '',
        prefix: '',
        suffix: '',
        key: '',
        value: '',
        displayName: '',
      };
      this.value = true;
      this.expiry = null;
      this.context.contexts = {};
    },
    updateNodes() {
      const payload = {
        value: this.bulk.value,
        replace: this.bulk.replaceContexts,
        contexts: this.context.contexts,
        expiry: this.expiry,
      };

      this.$store.dispatch('updateNodes', payload);
      this.context.contexts = {};
      this.bulk.value = null;
      this.expiry = null;
    },
    closeContextUi() {
      this.context.ui = false;
      this.context.key = '';
      this.context.value = '';
    },
    addContext() {
      if (this.context.key === '' || this.context.value === '') return;

      const key = this.context.key.trim();
      const value = this.context.value.trim();

      const values = this.context.contexts[key] || [];
      if (!values.find(val => val === value)) {
        values.push(value.trim());
        this.$set(this.context.contexts, key, values);
      }

      this.context.key = '';
      this.context.value = '';
    },
    removeContext(key, value) {
      const { contexts } = this.context;

      if (contexts[key].includes(value)) {
        this.$set(contexts, key, contexts[key].filter(v => v !== value));
      }
    },
    blurField(type) {
      setTimeout(() => {
        this.context[type] = false;
      }, 250);
    },
    deselectNodes() {
      this.$store.commit('deselectAllSelectedNodes');
    },
    copyNodes() {
      this.$store.commit('setModal', {
        type: 'copyNodes',
      });
    },
    moveNodes() {
      this.$store.commit('setModal', {
        type: 'moveNodes',
      });
    },
    deleteNodes() {
      this.$store.commit('setModal', {
        type: 'deleteNodes',
      });
    },
  },
};
</script>

<style lang="scss">
  @import '~vue-multiselect/dist/vue-multiselect.min.css';

  .add-node {
    background-color: #666670;
    box-shadow: 0 0 1em rgba(0,0,0,.2);
    z-index: 10;

    > .row {
      position: relative;
      display: flex;

      > div {
        border-right: 1px solid rgba(0,0,0,.2);
        padding: .5rem 0;
      }

      > button {
        margin: .5rem;
        color: $brand-color;
        background: $grey;
        border: 0;
        border-radius: 2px;
        width: 5em;
        cursor: not-allowed;
        opacity: .5;
        font-family: "Source Code Pro", monospace;

        span {
          display: flex;
          flex-direction: column;
          align-items: center;

          svg {
            margin-bottom: .5rem;
          }
        }

        &:not([disabled]) {
          opacity: 1;
          cursor: pointer;

          &:hover {
            opacity: .8;
          }
        }
      }

      .form-group {
        display: flex;
        flex-direction: column;
        flex: 1 1 12%;
        padding-left: .5em;
        padding-right: .5em;
        align-items: flex-start;
        position: relative;

        &:first-child {
          flex: 2 2 40%;
        }

        &.node-builder {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0;
          padding: 0.5rem;

          > label {
            margin-bottom: 0.5rem;
          }

          .node-builder-row {
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            width: 100%;
            gap: 0.5rem;
          }

          .node-type-select {
            flex: 0 0 auto;
            min-width: 120px;
            max-width: 140px;
            padding: 0.6rem 0.75rem;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 2px;
            margin-right: 0.5rem;
            color: #FFF;
            font-family: 'Source Code Pro', monospace;
            font-weight: 600;
            cursor: pointer;
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.5px;
            align-self: flex-end;
            min-height: 38px;

            &:focus {
              outline: none;
              border-color: $brand-color;
              background: rgba(0, 0, 0, 0.4);
            }
          }

          .node-type-inputs {
            flex: 1 1 auto;
            display: flex;
            flex-direction: row;
            gap: 0.5rem;
            align-items: flex-start;
            padding: 0;
            width: 100%;

            .input-group {
              display: flex;
              flex-direction: column;
              flex: 1 1 auto;
              gap: 0.15rem;
              min-width: 0;

              &.flex-grow {
                flex: 2 1 auto;
              }

              .input-label {
                font-size: 0.65rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: rgba(255, 255, 255, 0.5);
                font-weight: 600;
                margin: 0;
                padding: 0 0.25rem;
                line-height: 1;
                white-space: nowrap;
              }

              &.input-with-warning {
                .input-wrapper {
                  position: relative;
                  width: 100%;

                  .warning-icon {
                    position: absolute;
                    right: 0.5rem;
                    top: 0.5rem;
                    color: #fac858;
                    cursor: help;
                    font-size: 1rem;
                    pointer-events: all;
                    z-index: 1;

                    &:hover {
                      color: #ffdc73;

                      .tooltip {
                        visibility: visible;
                        opacity: 1;
                      }
                    }

                    .tooltip {
                      visibility: hidden;
                      opacity: 0;
                      position: absolute;
                      right: 0;
                      bottom: calc(100% + 0.5rem);
                      background: rgba(50, 50, 55, 0.98);
                      color: #FFF;
                      padding: 0.75rem 1rem;
                      border-radius: 4px;
                      width: 280px;
                    }
                  }
                }
              }
            }

            .node-input {
              width: 100%;
              padding: 0.6rem 0.65rem;
              background: rgba(0, 0, 0, 0.2);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 2px;
              color: #FFF;
              font-family: 'Source Code Pro', monospace;
              font-size: 0.9rem;
              box-sizing: border-box;
              min-height: 38px;

              &::placeholder {
                color: rgba(255, 255, 255, 0.4);
              }

              &:focus {
                outline: none;
                border-color: $brand-color;
                background: rgba(0, 0, 0, 0.3);
              }
            }

            .multiselect {
              flex: 1 1 auto;
              width: 100%;
              min-height: 38px;
            }

            > .input-group:first-child:last-child {
              flex: 1 1 100%;
            }
          }
        }

        + .form-group {
          padding-top: .5rem;
          border-top: 1px solid rgba(0,0,0,.2);
        }

        &.bulk-edit {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-direction: row;
          padding: 0 2rem;

          p {
            margin: 0;
            font-size: 1.5rem;
            display: flex;
            align-items: center;

            span span {
              font-size: 3rem;
              color: $brand-color;
              margin-right: 1rem;
              font-weight: 600;
            }

            button {
              background: transparent;
              margin-left: 1rem;
              border: 0;
              font-size: 1.5rem;
              opacity: .5;
              cursor: pointer;
              height: 1em;

              &:hover {
                opacity: .75;
              }
            }
          }

          .buttons {
            button {
              background: rgba(0,0,0,.25);
              font-family: "Source Code Pro", monospace;
              font-size: 1rem;
              border: 0;
              color: rgba(0,0,0,.8);
              margin-left: 1rem;
              padding: .5rem 1rem;
              cursor: pointer;

              svg {
                opacity: .5;
                margin-right: .5rem;
              }

              &:hover {
                background: rgba(0,0,0,.2);
              }

              &:nth-child(1) {
                color: $brand-color;
              }

              &:nth-child(2) {
                color: #FFF;
              }

              &:nth-child(3) {
                color: $red;
              }
            }
          }
        }

        label {
          line-height: 1;
          margin-bottom: .5em;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          cursor: pointer;

          button.code {
            width: auto;
          }
        }

        .bulk-value {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: .5rem;

          label {
            margin: 0;
            cursor: unset;
          }

          > div {
            display: flex;
          }

          button {
            opacity: 0.5;
            margin-left: .2rem;
          }

          .null {
            color: white;
          }

          .selected {
            opacity: 1;
          }
        }

        .multiselect__input {
          background: transparent;
          font: inherit;
          color: #FFF;

          &::placeholder {
            color: rgba(255,255,255,.2);
          }
        }

        input, textarea {
          width: 100%;
          height: 100%;
          border: 0;
          background: rgba(0,0,0,0.2);
          border-radius: 2px;
          padding: .2em .5em;
          color: #FFF;
          font-family: 'Source Code Pro', monospace;
          line-height: 1.5;
        }

        .code {
          color: $red;
          cursor: pointer;
          width: 100%;
          text-align: center;

          &.true {
            color: $brand-color;
          }

          &:hover {
            opacity: .8;
          }
        }
      }

      .contexts {
        .bulk-contexts {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: space-between;
          margin-bottom: .5rem;

          label {
            width: auto;
            margin: 0;
          }

          > div {
            display: flex;
          }
        }

        button.code {
          color: $brand-color;
        }

        code {
          display: inline-block;
          margin-right: .2rem;
          margin-top: .2rem;

          span {
            font-size: smaller;
            opacity: .5;
          }
        }
      }
    }

    .known-permissions {
      position: absolute;
      bottom: 100%;
      left: 0;
      background: #565660;
      z-index: 15;
      display: flex;
      flex-direction: column-reverse;
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

    .multiselect {
      color: white;
    }

    .multiselect__tags {
      background: rgba(0,0,0,.1);
      border: 0;
      border-radius: 2px;
      font: inherit;
      max-height: 30vh;
      overflow-y: auto;
      min-height: 38px;
      padding: 0.45rem 2.5rem 0.45rem 0.65rem;
    }

    .multiselect__single {
      background: transparent;
      color: #FFF;
      font-family: 'Source Code Pro', monospace;
      margin-bottom: 0;
      padding: 0;
    }

    .multiselect__placeholder {
      color: rgba(255, 255, 255, 0.4);
      margin-bottom: 0;
      padding-top: 0;
    }

    .multiselect__tag {
      background: rgba(0,0,0,.25);
      color: white;
      font-family: "Source Code Pro", monospace;
      font-size: .8rem;
      border-radius: 2px;
      padding: .25rem 1.5rem .25rem .5rem;

      &-icon {
        border-radius: 0;

        &:after {
          color: #000;
          opacity: .25;
        }

        &:hover {
          background: transparent;

          &:after {
            opacity: .5;
          }
        }
      }
    }

    .multiselect__content {
      font-family: "Source Code Pro", monospace;

      &-wrapper {
        background: $grey;
        border: 0;
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
        box-shadow: 0 -1rem 2rem rgba(0,0,0,.1);
      }
    }

    .multiselect__element {
      &:not(:first-child) {
        border-top: 1px solid rgba(0,0,0,.2);
      }
    }

    .multiselect__option {
      &--highlight {
        background: rgba(255,255,255,.2);

        &:after {
          background: rgba(0,0,0,.2);
        }
      }

      &--selected {
        background: $brand-color;
        color: $navy;

        &:after {
          color: rgba(0,0,0,.5);
        }

        &.multiselect__option--highlight {
          background: color.adjust($brand-color, $lightness: 10%);
        }
      }
    }

    .vdp-datepicker__calendar {
      bottom: 100%;
      top: unset;
    }

    .context-ui {
      bottom: 8rem;
      top: unset;
      right: 2rem;

      input {
        border: 0;
        background: rgba(0,0,0,.2);
        color: #FFF;
        font-family: "Source Code Pro", monospace;
      }

      .context-list {
        max-height: 10rem;
      }
    }
  }

  #bulk_contexts_replace {
    background: rgba(0,0,0,.2);
    color: $grey;
    font-family: "Source Code Pro", monospace;
    border: 0;
    opacity: .5;
    margin-right: .2rem;
    cursor: pointer;
    display: flex;
    align-items: center;

    svg {
      margin-right: .5rem;
    }

    &:hover {
      opacity: .75;
    }

    &.selected {
      color: $brand-color;
      opacity: 1;
    }
  }
</style>
