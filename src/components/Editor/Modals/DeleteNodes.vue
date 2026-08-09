<template>
  <div class="delete-nodes-modal">
    <h2>{{ $t('editor.nodes.delete', selectedNodes.length) }}</h2>
    <div class="col-2 flex">
      <div class="flex-1">
        <p>
          {{ $t('editor.nodes.deleteConfirm', selectedNodes.length) }}
        </p>
      </div>
      <div class="flex flex-1 items-center justify-center pl-8">
        <button class="bg-red! px-8! py-4! text-[1.5rem]!" @click="deleteNodes">
          <font-awesome icon="times" />
          {{ $t('editor.delete') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedSession: null,
    };
  },
  props: {
    props: Array,
  },
  computed: {
    selectedNodes() {
      return this.$store.getters.selectedNodeIds;
    },
  },
  methods: {
    deleteNodes() {
      this.$store.dispatch('deleteNodes');
    },
  },
};
</script>
