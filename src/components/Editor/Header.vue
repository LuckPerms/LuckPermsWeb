<template>
<div class="editor-header sticky top-0 z-[5] bg-[#2c2c39] p-4">
  <h1 class="flex items-center leading-none">
    <small class="mr-2 capitalize">{{sessionData.type}}:</small>
    <code class="leading-none">{{session.displayName}}</code>
    <span v-if="sessionData.type == 'group' && session.displayName !== session.id" class="ml-2 text-[0.83em] opacity-50 before:content-['('] after:content-[')']">
      {{ session.id }}
    </span>
    <avatar
      v-if="sessionData.type == 'user'"
      :id="session.id"
      :name="session.displayName"
      class="ml-2 h-auto w-[1em]"
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
