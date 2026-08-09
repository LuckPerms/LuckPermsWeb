<template>
  <div class="editor-menu-track">
    <h3 @click="toggle = !toggle" class="group m-0 flex select-none items-center justify-between border-b border-grey p-2 text-brand uppercase">
      <span>
        <button :title="$t('editor.tracks.toggleGroup')" class="mr-2 cursor-pointer bg-transparent p-0 text-[1.5rem] text-white opacity-50 hover:opacity-100 [&_svg]:transition-transform [&_svg]:duration-200">
          <font-awesome icon="caret-right" fixed-width :rotation="toggle ? 90 : null" />
        </button>
        <span>{{ track.id }}</span>
      </span>
      <span class="actions">
        <button @click.stop="editTrack" :title="$t('editor.tracks.edit')" class="mr-2 cursor-pointer bg-transparent p-0 text-base text-white opacity-0 group-hover:opacity-50">
          <font-awesome icon="edit" fixed-width />
        </button>
        <button @click.stop="deleteTrack" :title="$t('editor.tracks.delete')" class="mr-2 cursor-pointer bg-transparent p-0 text-base text-white opacity-0 group-hover:opacity-50">
          <font-awesome icon="times" fixed-width />
        </button>
      </span>
    </h3>
    <transition name="slide">
      <ul v-if="track.groups.length && toggle">
        <li
          v-for="group in filteredGroups"
          @click="changeCurrentSession(group)"
          :class="{
            'active': currentSession && currentSession.id === group,
            'modified': modifiedSessions.includes(group)
          }"
          :key="`${track.id}_${group}`"
          :title="$t('editor.groups.edit')"
        >
          {{ group }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'editor-menu-track',

  props: {
    track: {
      type: Object,
      required: true,
    },
    filter: {
      type: String,
      required: true,
    },
    currentSession: {
      required: true,
    },
    modifiedSessions: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      toggle: false,
    };
  },

  computed: {
    filteredGroups() {
      return this.track.groups.filter(group => group.includes(this.filter));
    },
  },

  methods: {
    changeCurrentSession(sessionId) {
      this.$store.commit('setCurrentSession', sessionId);
      this.$emit('clear-query');
    },

    editTrack() {
      this.$store.commit('setModal', {
        type: 'createTrack',
        object: {
          track: this.track,
        },
      });
    },

    deleteTrack() {
      this.$store.dispatch('deleteTrack', this.track.id);
    },
  },

  watch: {
    filter(newValue) {
      if (newValue !== '') {
        this.toggle = true;
      }
    },
  },
};
</script>
