<template>
<div @keyup.enter="addTrack" class="add-track">
  <h2>{{ $t(`editor.tracks.${isAddingTrack ? 'create' : 'edit'}`) }}</h2>
  <div class="row">
    <div class="col">
      <div class="form-group">
        <label for="trackName">{{ $t('editor.tracks.name') }}</label>
        <input type="text" id="trackName" :value="track.id" @input="updateTrackName($event)">
      </div>

      <h3>{{ $t('editor.tracks.groups') }}</h3>
      <p>{{ $t('editor.tracks.tip') }}</p>
      <draggable tag="ol" class="track-groups" v-model="track.groups">
        <li v-for="(group, index) in track.groups" :key="`track_group_${group}`">
          <span><span>{{ index+1 }}</span> {{ group }}</span>
          <button class="delete" @click="track.groups.splice(index, 1)">
            <font-awesome icon="times" full-width />
          </button>
        </li>
      </draggable>
    </div>
    <div class="col">
      <h3>{{ $t('editor.tracks.addGroups') }}</h3>
      <ul class="available-groups">
        <li
          v-for="group in availableGroups"
          v-bind:key="group.id"
          @click="track.groups.push(group.id)"
        >
          <span>{{ group.id }}</span>
          <font-awesome icon="plus" fixed-width />
        </li>
      </ul>
    </div>
  </div>
  <button type="button" @click="addTrack" :disabled="buttonDisabled" class="save-button">
    <font-awesome :icon="isAddingTrack ? 'plus-circle' : 'save'" />
    {{ $t(`editor.tracks.${isAddingTrack ? 'add' : 'save'}`) }}
  </button>
</div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  components: {
    draggable,
  },

  name: 'CreateTrack',

  data() {
    return {
      track: {
        id: '',
        groups: [],
        type: 'track',
      },
      error: null,
    };
  },

  props: {
    props: Object,
  },

  computed: {
    groups() {
      return this.$store.getters.sessionSet.filter(session => session.type === 'group');
    },
    tracks() {
      return this.$store.getters.tracks;
    },
    availableGroups() {
      return this.groups.filter(group => !this.track.groups.includes(group.id));
    },
    buttonDisabled() {
      // track has no name
      if (this.track.id === '') return true;

      // track has no groups
      if (this.track.groups.length === 0) return true;

      const existingTrack = this.tracks.find(track => track.id === this.track.id);

      // new track with existing name
      if (this.isAddingTrack && existingTrack) return true;

      // todo - editing track with existing name (that isn't the track's name)
      // if (!this.isAddingTrack && !existingTrack.id === this.track.id) return true;
      // else we good
      return false;
    },
    isAddingTrack() {
      return !(this.props && this.props.track);
    },
  },

  created() {
    if (!this.isAddingTrack) {
      this.track = {
        id: this.props.track.id,
        groups: this.props.track.groups,
        type: 'track',
      };
    }
  },

  methods: {
    updateTrackName(event) {
      this.track.id = event.target.value.toLowerCase().replace(/ /g, '-');
    },

    addTrack() {
      if (this.buttonDisabled) return;

      if (!this.isAddingTrack) {
        // todo - updateTrack action
        this.$store.dispatch('updateTrack', {
          id: this.props.track.id,
          newTrack: this.track,
        });
      } else {
        this.$store.dispatch('addTrack', this.track);
      }
    },
  },
};
</script>

<style lang="scss">
  .add-track {
    height: 600px;
    display: flex;
    flex-direction: column;

    .row {
      overflow: hidden;

      .col {
        height: 100%;

        ol, ul {
          overflow: auto;
        }
      }
    }

    h3 {
      margin-bottom: 0;

      + p {
        margin-top: 0;
      }

      &:first-child {
        margin-top: 0;
      }
    }

    ol, ul {
      margin: 0;
      padding-left: 0;
      list-style: none;
      height: 100%;

      li {
        background: rgba(0,0,0,.2);
        padding: .5rem 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2px;

        span {
          span {
            margin-right: .5rem;
            opacity: .5;
          }
        }

        .delete {
          width: auto;
          background: transparent;
          margin: 0;
          color: white;
          opacity: .5;

          &:hover {
            opacity: 1;
          }
        }
      }
    }

    ol {
      li {
        cursor: grab;
        position: relative;

        &.sortable-chosen {
          cursor: grabbing;
        }

        &:not(:last-child) {
          &:before {
            content: '';
            position: absolute;
            left: 1.2rem;
            top: 2.5rem;
            width: 0;
            height: .7rem;
            border: 1px solid $brand-color;
          }

          &:after {
            content: '';
            position: absolute;
            left: 0.95rem;
            top: 2.7rem;
            width: .5rem;
            height: .5rem;
            border: 2px solid $brand-color;
            border-left: 0;
            border-top: 0;
            transform: rotate(45deg);
          }
        }
      }
    }

    ul {
      li {
        padding: .25rem 1rem;
        cursor: pointer;

        svg {
          opacity: 0;
        }

        &:hover {
          background: rgba(0,0,0,.1);

          svg {
            opacity: .5;
          }
        }
      }
    }
  }
</style>
