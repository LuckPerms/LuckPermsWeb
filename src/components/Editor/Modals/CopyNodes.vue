<template>
  <div class="copy-nodes-modal">
    <h2>{{ $t('editor.nodes.copy', selectedNodes.length) }}</h2>
    <div class="col-2 flex">
      <ul class="m-0 max-h-56 list-none flex-[2] overflow-y-auto p-0">
        <li
          v-for="session in sessions"
          :key="`copyNodeSession_${session.id}`"
          :class="{ selected: selectedSessions.includes(session.id) }"
          @click="toggleSession(session.id)"
          class="group mb-[0.2rem] flex cursor-pointer items-center bg-black/25 px-4 py-2 hover:bg-black/20 [&.selected]:text-brand"
        >
          <span class="checkbox relative mr-4 block h-6 w-6 border-2 border-black/[0.33] group-[.selected]:after:absolute group-[.selected]:after:block group-[.selected]:after:content-[''] group-[.selected]:after:border-4 group-[.selected]:after:border-brand group-[.selected]:after:border-r-0 group-[.selected]:after:border-t-0 group-[.selected]:after:h-2 group-[.selected]:after:w-4 group-[.selected]:after:rotate-[-45deg]"></span>
          {{ session.displayName }}
        </li>
      </ul>
      <div class="flex flex-1 items-center justify-center pl-8">
        <button :disabled="!selectedSessions.length" @click="copyNodes" class="px-8! py-4! text-[1.5rem]! disabled:cursor-not-allowed! disabled:opacity-50!">
          <font-awesome icon="clone" />
          {{ $t('copy') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedSessions: [],
    };
  },
  props: {
    props: Array,
  },
  computed: {
    selectedNodes() {
      return this.$store.getters.selectedNodeIds;
    },
    sessions() {
      return this.$store.getters.sessionSet;
    },
  },
  methods: {
    toggleSession(session) {
      if (this.selectedSessions.includes(session)) {
        this.selectedSessions.splice(this.selectedSessions.findIndex(s => s === session), 1);
      } else {
        this.selectedSessions.push(session);
      }
    },
    copyNodes() {
      this.$store.dispatch('copyNodes', this.selectedSessions);
    },
  },
};
</script>
