<template>
<div class="editor-header">
  <h1>
    <small>{{sessionData.type}}:</small>
    <code>{{session.displayName}}</code>
    <span v-if="sessionData.type == 'group' && session.displayName !== session.id">{{ session.id }}</span>
    <img v-if="sessionData.type == 'user'" :src="`https://minotar.net/helm/${session.who.uuid}/100.png`">
  </h1>
</div>
</template>

<script>
export default {
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
