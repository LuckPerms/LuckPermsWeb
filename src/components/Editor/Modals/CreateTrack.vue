<template>
<div class="add-track">
  <h2>Create a track</h2>
  <div class="row">
    <div class="col">
      <div class="form-group">
        <label for="trackName">Track name</label>
        <input type="text" id="trackName" :value="track.id" @input="updateTrackName($event)">
      </div>

      <h3>Groups</h3>
      <p>Tip: click and drag to re-order the track</p>
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
      <h3>Add groups</h3>
      <ul class="available-groups">
        <li v-for="group in availableGroups" @click="track.groups.push(group.id)">
          {{ group.id }}
        </li>
      </ul>
    </div>
  </div>
  <button type="button" @click="addTrack" :disabled="buttonDisabled">
    <font-awesome icon="plus-circle" />
    Add track
  </button>
</div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  components: {
    draggable
  },

  name: 'CreateTrack',

  data() {
    return {
      track: {
        id: '',
        groups: [],
        type: 'track'
      },
      groups: this.props.groups,
    };
  },

  props: {
    props: Object,
  },

  computed: {
    availableGroups() {
      return this.groups.filter(group => {
        return !this.track.groups.includes(group.id);
      })
    },
    buttonDisabled() {
      if (this.track.id === '') return true;
      if (this.track.groups.length === 0) return true;
      return false;
    }
  },

  methods: {
    updateTrackName(event) {
      this.track.id = event.target.value.toLowerCase().replace(' ', '-');
    },

    addTrack() {
      if (this.buttonDisabled) return;

      this.$store.dispatch('addTrack', this.track);
    }
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

    ul {
      li {
        padding: .25rem 1rem;
        cursor: pointer;

        &:hover {
          background: rgba(0,0,0,.1);
        }
      }
    }
  }
</style>
