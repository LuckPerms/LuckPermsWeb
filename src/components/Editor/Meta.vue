<template>
<div class="editor-meta">
  <div class="meta-weight" v-if="sessionData.type == 'group'">
    <strong>Weight: </strong> <code>{{formatWeight(sessionData.weight)}}</code>
  </div>
  <div class="meta-parents" v-if="sessionData.parents.length > 0">
    <strong>Parent groups:</strong>
    <ul>
      <li v-for="parent in sessionData.parents">
        <code
          @click="handleParentSessionSwitch(parent)"
          :title="`Go to the ${formatParent(parent)} group`"
        >
          {{ formatParent(parent) }}
        </code>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
export default {
  name: 'Meta',
  props: {
    session: Object,
    sessionData: Object,
  },

  methods: {
    formatWeight(weight) {
      if (weight.length == 0) {
        return 'N/A';
      } if (weight.length == 1) {
        return weight[0].key.split('.').pop();
      }
      return 'Multiple';
    },
    formatParent(parent) {
      const group = parent.key.split('.').pop();
      if (parent.contexts && (parent.contexts.server || parent.contexts.world || parent.contexts.expiry || parent.contexts.context)) {
        return `${group} *`;
      }
      return group;
    },
    handleParentSessionSwitch(parent) {
      const sessionId = this.$store.state.editor.sessionList.find(session => {
        const sessionObject = this.$store.state.editor.sessions[session];
        return parent.key.indexOf(sessionObject.id) > -1;
      });

      this.$store.commit('setCurrentSession', sessionId);
    },
  },
};
</script>

<style lang="scss">
.editor-meta {
  background-color: rgba(255,255,255,.1);
  padding: 1em;
  padding-top: 0;
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
        }
      }
    }
  }
}
</style>
