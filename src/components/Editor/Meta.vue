<template>
<div class="editor-meta">
  <div class="meta-weight" v-if="sessionData.type === 'group'">
    <strong>Weight: </strong>
    <code>{{ groupWeight }}</code>
  </div>
  <div class="meta-parents">
    <div class="add-group">
      <strong>Parent groups </strong>
      <button
        @click="addingGroup = true"
        :title="`Add a group to ${session.id}`"
      >
        +
      </button>
      <ul v-if="addingGroup" v-click-outside="closeGroups">
        <li
          v-for="group in groups"
          @click="addParentToGroup(group.id)"
          :key="`addParent_${group.id}`"
        >
          {{ group.id }}
        </li>
      </ul>
    </div>
    <ul>
      <li v-for="parent in parents" :key="`groupParent_${parent}`">
        <code
          @click="handleParentSessionSwitch(parent)"
          :title="`Go to the ${parent} group`"
        >
          {{ parent }}
          <span
            @click.stop="deleteParent(parent)"
            :title="`Remove ${parent} as a parent`"
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
    };
  },

  computed: {
    groupWeight() {
      const { weight } = this.sessionData;

      if (weight.length === 0) {
        return 'N/A';
      } if (weight.length === 1) {
        return weight[0].key.split('.').pop();
      }
      return 'Multiple';
    },
    groups() {
      return this.$store.getters.sessionSet.filter(session => session.type === 'group').filter(group => !this.parents.includes(group.id));
    },
    parents() {
      return this.sessionData.parents
        .filter(parent => parent.value)
        .map(parent => parent.key.split('.').pop());
    },
  },

  methods: {
    handleParentSessionSwitch(parent) {
      this.$store.commit('setCurrentSession', parent);
    },
    addParentToGroup(parentId) {
      const node = {
        sessionId: this.session.id,
        type: 'permission',
        key: `group.${parentId}`,
        value: true,
        isNew: true,
      };

      this.$store.dispatch('addNodes', [node]);
      this.addingGroup = false;
    },
    closeGroups() {
      this.addingGroup = false;
    },
    deleteParent(parentId) {
      const node = this.sessionData.parents.find(parent => parent.key === `group.${parentId}`);
      this.$store.commit('deleteNode', node.id);
    },
  },
};
</script>

<style lang="scss">
.editor-meta {
  background-color: rgba(255,255,255,.1);
  padding: 0 1em 1em;

  > div {
    flex: 1;
  }

  .meta-parents {
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;

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
      }
    }

    .add-group {
      position: relative;

      button {
        cursor: pointer;
        background: $brand-color;
        font: inherit;
        border: 0;
        border-radius: 2px;
        font-size: 1rem;
        font-weight: bold;
        padding: 0 .5rem;
        margin-left: .5rem;
      }

      ul {
        position: absolute;
        top: 100%;
        background: $grey;
        flex-direction: column;
        max-height: 40vh;
        overflow-y: auto;
        z-index: 100;
        box-shadow: 0 .2rem 1rem rgba(0,0,0,.2);
        max-height: 40vh;
        overflow-y: auto;

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
</style>
