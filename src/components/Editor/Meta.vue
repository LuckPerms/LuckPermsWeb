<template>
<div class="editor-meta">
  <div class="meta-weight" v-if="sessionData.type == 'group'">
    <strong>Weight: </strong> {{formatWeight(sessionData.weight)}}
  </div>
  <div class="meta-parents" v-if="sessionData.parents.length > 0">
    <strong>Parents:</strong>
    <ul>
      <li v-for="parent in sessionData.parents" @click="$emit('changeCurrentSession', parent)">
        <code>{{formatParent(parent)}}</code>
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
    formatWeight: function(weight) {
      if (weight.length == 0) {
        return 'N/A';
      } else if (weight.length == 1) {
        return weight[0].permission.split('.').pop();
      } else {
        return 'Multiple';
      }
    },
    formatParent: function(parent) {
      let group = parent.permission.split('.').pop();
      if (parent.server || parent.world || parent.expiry || parent.context) {
        return group + ' *';
      } else {
        return group;
      }
    }
  }
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
        // padding: .2em .5em;
        // background: rgba(0,0,0,0.2);
        margin-right: .5em;
        // border-radius: 2px;
      }
    }
  }
}
</style>
