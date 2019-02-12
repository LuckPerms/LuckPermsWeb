<template>
<li class="permission-node">
  <div class="permission">
    <code>{{node.permission}}</code>
  </div>

  <div class="value" @click="toggleValue(node)">
    <code :class="{'true': node.value}">{{node.value}}</code>
  </div>

  <div class="expiry">
    <code v-if="node.expiry">{{node.expiry | moment('from')}}</code>
    <code v-else disabled>never</code>
  </div>

  <div class="server">
    <code v-if="node.server">{{node.server}}</code>
    <code v-else disabled>global</code>
  </div>

  <div class="world">
    <code v-if="node.world">{{node.world}}</code>
    <code v-else disabled>global</code>
  </div>

  <div class="contexts">
    <code v-if="node.contexts">{{node.contexts}}</code>
    <code v-else disabled>none</code>
  </div>
</li>
</template>

<script>
export default {
  name: 'Node',
  props: {
    node: Object,
  },
  computed: {
    session() {
      return this.$store.getters.currentSession;
    },
  },
  methods: {
    toggleValue: function(node) {
      this.$store.commit('toggleNodeValue', node);
    },
  }
};
</script>

<style lang="scss">
.permission-node {
  border-bottom: 1px solid rgba(0,0,0,0.2);
  display: flex;
  cursor: pointer;

  &:hover {
    background-color: rgba(255,255,255,.1);
  }

  > div {
    flex: 1 1 12%;
    padding: .5em 1em;

    &:hover {
      background-color: rgba(255,255,255,.1);
    }
  }

  .permission {
    flex: 2 2 40%;
  }

  code {
    &[disabled] {
      opacity: .5;
    }
  }

  .value {
    code {
      color: tomato;
    }
    .true {
      color: lawngreen;
    }
  }
}
</style>
