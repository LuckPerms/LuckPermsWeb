<template>
<div class="delete-user">
  <i18n-t keypath="editor.users.delete" tag="h2">
    <template #user>
      <code class="username mt-2 flex w-fit items-center">
        <avatar :id="user.id" :name="user.displayName" class="mr-2 h-6 w-auto" />
        {{ user.displayName }}
      </code>
    </template>
  </i18n-t>
  <p class="lighter">
    {{ $t('editor.users.deleteConfirm', { count: permissions.length }) }}
  </p>
  <div class="flex">
    <button type="button" @click="deleteUser">
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
import Avatar from '@/components/Avatar.vue';

export default {
  name: 'DeleteUser',
  components: {
    Avatar,
  },
  props: {
    props: Object,
  },
  computed: {
    permissions() {
      return this.$store.getters.allNodes.filter(node => node.sessionId === this.props.userId);
    },
    user() {
      return this.$store.getters.sessionSet.find(({ id }) => id === this.props.userId);
    },
  },
  methods: {
    deleteUser() {
      this.$store.commit('deleteSession', this.props.userId);
      this.$emit('close');
    },
  },
};
</script>
