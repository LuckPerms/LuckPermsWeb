<template>
<div class="delete-group">
  <h2 v-html="$t('editor.groups.delete', { group: props.groupId })" />
  <p class="lighter">
    {{ $t('editor.groups.deleteConfirm', { count: permissions.length }) }}
  </p>
  <div>
    <button type="button" @click="deleteGroup">
      <font-awesome icon="check" />
      {{ $t('editor.delete') }}
    </button>
    <button type="button" class="red" @click="$emit('close')">
      <font-awesome icon="times" />
      {{ $t('editor.cancel') }}
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
    },
  },
  methods: {
    deleteGroup() {
      this.$store.commit('deleteSession', this.props.groupId);
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
