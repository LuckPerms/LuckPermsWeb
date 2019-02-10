<template>
<li class="permission-node">
  <div class="permission">
    <code>{{node.permission}}</code>
  </div>

  <div class="value">
    <code>{{node.value}}</code>
  </div>

  <div class="expiry">
    <code v-if="node.expiry">{{node.expiry | moment('from')}}</code>
  </div>

  <div class="server">
    <code v-if="node.server">{{node.server}}</code>
  </div>

  <div class="world">
    <code v-if="node.world">{{node.world}}</code>
  </div>

  <div class="contexts">
    <code v-if="node.context">{{node.context}}</code>
  </div>
</li>
</template>

<script>
export default {
  name: 'Node',
  props: {
    node: Object,
  },
};
</script>

<style lang="scss">
.permission-node {
  border-bottom: 1px solid rgba(0,0,0,0.2);
  display: flex;

  > div {
    flex: 1 1 12%;
    padding: .5em 1em;
  }

  .permission {
    flex: 2 2 40%;
  }
}
</style>
