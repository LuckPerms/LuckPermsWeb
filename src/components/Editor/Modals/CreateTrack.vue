<template>
<div @keyup.enter="addTrack" class="add-track flex h-[600px] flex-col">
  <h2>{{ $t(`editor.tracks.${isAddingTrack ? 'create' : 'edit'}`) }}</h2>
  <div class="row overflow-hidden">
    <div class="col h-full">
      <div class="form-group">
        <label for="trackName">{{ $t('editor.tracks.name') }}</label>
        <input type="text" id="trackName" :value="track.id" @input="updateTrackName($event)">
      </div>

      <h3 class="mb-0 mt-0">{{ $t('editor.tracks.groups') }}</h3>
      <p class="mt-0">{{ $t('editor.tracks.tip') }}</p>
      <draggable tag="ol" class="track-groups m-0 h-full list-none overflow-auto p-0" v-model="track.groups">
        <li v-for="(group, index) in track.groups" :key="`track_group_${group}`" class="relative mb-[2px] flex cursor-grab items-center justify-between bg-black/20 px-4 py-2 [&.sortable-chosen]:cursor-grabbing not-last:before:absolute not-last:before:left-[1.2rem] not-last:before:top-10 not-last:before:h-[0.7rem] not-last:before:w-0 not-last:before:border not-last:before:border-brand not-last:before:content-[''] not-last:after:absolute not-last:after:left-[0.95rem] not-last:after:top-[2.7rem] not-last:after:h-2 not-last:after:w-2 not-last:after:rotate-45 not-last:after:border-2 not-last:after:border-brand not-last:after:border-l-0 not-last:after:border-t-0 not-last:after:content-['']">
          <span><span class="mr-2 opacity-50">{{ index+1 }}</span> {{ group }}</span>
          <button class="delete m-0! w-auto! bg-transparent! text-white opacity-50 hover:opacity-100" @click="track.groups.splice(index, 1)">
            <font-awesome icon="times" full-width />
          </button>
        </li>
      </draggable>
    </div>
    <div class="col h-full">
      <h3 class="mb-0 mt-0">{{ $t('editor.tracks.addGroups') }}</h3>
      <ul class="available-groups m-0 h-full list-none overflow-auto p-0">
        <li
          v-for="group in availableGroups"
          v-bind:key="group.id"
          @click="track.groups.push(group.id)"
          class="mb-[2px] flex cursor-pointer items-center justify-between bg-black/20 px-4 py-1 hover:bg-black/10 [&_svg]:opacity-0 hover:[&_svg]:opacity-50"
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
      this.track.id = event.target.value.toLowerCase().replace(' ', '-');
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
