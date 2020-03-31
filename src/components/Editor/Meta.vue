<template>
<div class="editor-meta">
  <div class="meta-weight" v-if="sessionData.type === 'group'">
    <strong>Weight: </strong>
    <code>{{ groupWeight }}</code>
  </div>
  <div class="meta-parents">
    <strong>Parent groups:</strong>
    <ul>
      <li class="add-group">
        <button
          @click="addingGroup = true"
          :title="`Add a group to ${session.id}`"
        >
          + add group
        </button>
        <ul v-if="addingGroup" v-click-outside="closeGroups">
          <li v-for="group in groups" @click="addParentToGroup(group.id)">
            {{ group.id }}
          </li>
        </ul>
      </li>
      <li v-for="parent in sessionData.parents">
        <code
          @click="handleParentSessionSwitch(parent)"
          :title="`Go to the ${formatParent(parent)} group`"
        >
          {{ formatParent(parent) }}
          <span
            @click.stop="deleteParent(parent)"
            :title="`Remove ${formatParent(parent)} as a parent`"
          >
            <font-awesome icon="times" />
          </span>
        </code>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
import vClickOutside from 'v-click-outside';

export default {
  name: 'Meta',
  directives: {
    clickOutside: vClickOutside.directive,
  },
  props: {
    session: Object,
    sessionData: Object,
  },

  data() {
    return {
      addingGroup: false,
    }
  },

  computed: {
    groupWeight() {
      const weight = this.sessionData.weight;

      if (weight.length === 0) {
        return 'N/A';
      } if (weight.length === 1) {
        return weight[0].key.split('.').pop();
      }
      return 'Multiple';
    },
    groups() {
      return this.$store.getters.sessionSet.filter(session => {
        return session.type === 'group';
      }).filter(group =>  {
        return !this.parents.includes(group.id);
      });
    },
    parents() {
      return this.sessionData.parents.map(parent => {
        return parent.key.split('.').pop();
      });
    }
  },

  methods: {
    formatParent(parent) {
      const group = parent.key.split('.').pop();
      if (parent.contexts && (parent.contexts.server || parent.contexts.world || parent.contexts.expiry || parent.contexts.context)) {
        return `${group} *`;
      }
      return group;
    },
    handleParentSessionSwitch(parent) {
      const sessionId = this.$store.state.editor.sessionList.find((session) => {
        const sessionObject = this.$store.state.editor.sessions[session];
        return parent.key.indexOf(sessionObject.id) > -1;
      });

      this.$store.commit('setCurrentSession', sessionId);
    },
    addParentToGroup(parentId) {
      const node = {
        sessionId: this.session.id,
        type: 'permission',
        key: 'group.' + parentId,
        value: true,
        isNew: true,
      };

      this.$store.dispatch('addNodes', [node]);
      this.addingGroup = false;
    },
    closeGroups() {
      this.addingGroup = false;
    },
    deleteParent(parent) {
      this.$store.commit('deleteNode', parent.id);
    }
  },
};
</script>

<style lang="scss">
.editor-meta {
  background-color: rgba(255,255,255,.1);
  padding: 0 1em 1em;
  // display: flex;

  > div {
    flex: 1;
  }

  .meta-parents {
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
      flex-wrap: wrap;

      li {
        margin-right: .5em;

        code {
          cursor: pointer;

          span {
            color: white;
            opacity: .1;

            &:hover {
              opacity: .5;
            }
          }
        }

        button {
          cursor: pointer;
          background: $brand-color;
          font: inherit;
          border: 0;
          border-radius: 2px;
          font-size: .8rem;
          font-weight: bold;
          padding: .1rem .5rem;
        }

        &.add-group {
          position: relative;

          ul {
            position: absolute;
            top: 100%;
            background: $grey;
            flex-direction: column;
            z-index: 100;

            li {
              padding: .25rem 1rem;
              margin: 0;
              font-family: "Source Code Pro", monospace;
              font-size: .8rem;
              cursor: pointer;

              &:not(:last-child) {
                border-bottom: 1px solid rgba(0,0,0,.2);
              }

              &:hover {
                background: rgba(255,255,255,.05);
              }
            }
          }
        }
      }
    }
  }
}
</style>
