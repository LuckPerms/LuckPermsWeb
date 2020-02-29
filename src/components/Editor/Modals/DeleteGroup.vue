<template>
<div class="delete-group">
  <h2>
    Are you sure you want to delete group:
    <code>{{ props.groupId }}</code>
  </h2>
  <p class="lighter">
    All {{ permissions.length }} of its permissions will be deleted. This currently can not be undone.
  </p>
  <div>
    <button type="button" @click="deleteGroup">
      <font-awesome icon="plus-circle" />
      Delete group
    </button>
    <button type="button" class="red" @click="$emit('close')">
      <font-awesome icon="times" />
      Cancel
    </button>
  </div>
</div>
</template>

<script>

export default {
  name: 'DeleteGroup',

  props: {
    props: Object,
  },

  computed: {
    permissions() {
      return this.$store.getters.allNodes.filter(node => node.sessionId === this.props.groupId);
    }
  },
  methods: {
    deleteGroup() {
      this.$store.commit('deleteGroup', this.props.groupId);
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss">
  .delete-group {
    > div {
      display: flex;
    }
  }
</style>
