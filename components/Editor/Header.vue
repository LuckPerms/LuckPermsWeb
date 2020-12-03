<template>
<div class="editor-header">
  <h1>
    <small>{{sessionData.type}}:</small>
    <code>{{session.displayName}}</code>
    <span v-if="sessionData.type == 'group' && session.displayName !== session.id">
      {{ session.id }}
    </span>
    <avatar
      v-if="sessionData.type == 'user'"
      :id="session.id"
      :name="session.displayName"
    />
  </h1>
</div>
</template>

<script>
import Avatar from '../Avatar.vue';

export default {
  components: {
    Avatar,
  },
  name: 'Header',
  props: {
    session: Object,
    sessionData: Object,
  },

  methods: {

  },
};
</script>

<style lang="scss">
.editor-header {
  background-color: rgb(44,44,57);
  padding: 1em;
  position: sticky;
  top: 0;
  z-index: 5;

  h1 {
    display: flex;
    align-items: center;
    line-height: 1;

    small {
      margin-right: .5em;
      text-transform: capitalize;
    }

    code {
      line-height: 1;
    }

    span {
      opacity: .5;
      font-size: smaller;
      margin-left: .5em;

      &:before {
        content: '(';
      }

      &:after {
        content: ')';
      }
    }

    img {
      width: 1em;
      height: auto;
      margin-left: .5em;
    }
  }
}
</style>
