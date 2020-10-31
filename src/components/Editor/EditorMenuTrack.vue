<template>
  <div class="editor-menu-track">
    <h3 @click="toggle = !toggle">
      <span>
        <button :title="$t('editor.tracks.toggleGroup')">
          <font-awesome icon="caret-right" fixed-width :rotation="toggle ? 90 : null" />
        </button>
        <span>{{ track.id }}</span>
      </span>
      <span class="actions">
        <button @click.stop="editTrack" :title="$t('editor.tracks.edit')">
          <font-awesome icon="edit" fixed-width />
        </button>
        <button @click.stop="deleteTrack" :title="$t('editor.tracks.delete')">
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

<style lang="scss">
  .editor-menu-track {
    h3 {
      margin: 0;
      padding: .5rem;
      color: $brand-color;
      border-bottom: $grey 1px solid;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      justify-content: space-between;
      user-select: none;

      &:hover {
        .actions {
          button {
            opacity: .5;
          }
        }
      }

      button {
        background: transparent;
        border: none;
        opacity: .5;
        cursor: pointer;
        color: white;
        font-size: 1.5rem;
        padding: 0;
        margin-right: .5rem;

        svg {
          transition: transform .2s;
        }

        &:hover {
          opacity: 1;
        }

        &[disabled] {
          width: 1em;
        }
      }

      .actions {
        button {
          opacity: 0;
          font-size: 1rem;

          &:hover {
            opacity: 1;
          }
        }
      }
    }
  }
</style>
