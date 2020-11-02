<template>
<div class="delete-user">
  <i18n path="editor.users.delete" tag="h2">
    <template #user>
      <code class="username">
        <avatar :id="user.id" :name="user.displayName" />
        {{ user.displayName }}
      </code>
    </template>
  </i18n>
  <p class="lighter">
    {{ $t('editor.users.deleteConfirm', { count: permissions.length }) }}
  </p>
  <div>
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

<style lang="scss">
  .delete-user {
    > div {
      display: flex;
    }

    .username {
      display: flex;
      width: fit-content;
      align-items: center;
      margin-top: .5rem;
    }

    img {
      height: 1.5rem;
      width: auto;
      margin-right: .5rem;
    }
  }
</style>
