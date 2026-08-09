<template>
  <nav id="editor-menu">
    <div class="filter">
      <input
        type="text"
        :placeholder="$t('editor.search')"
        v-model="filter"
        :title="$t('editor.tracks.filter')"
      >
      <button
        class="delete"
        @click="filter = ''"
        v-if="filter !== ''"
        :title="$t('editor.clearFilters')"
      >
        <font-awesome icon="times" fixed-width />
      </button>
    </div>

    <div class="sessions">
      <div class="tracks">
        <h2 @click="toggle.tracks = !toggle.tracks">
          <button :title="$t('editor.tracks.toggle')">
            <font-awesome icon="caret-right" fixed-width :rotation="toggle.tracks ? 90 : null" />
          </button>
          <span>
            {{ $t('editor.nav.tracks') }}
            <small>({{ filteredTracks.length }})</small>
          </span>
          <button @click.stop="createTrack" :title="$t('editor.tracks.add')">
            <font-awesome icon="plus-circle" fixed-width />
          </button>
        </h2>
        <transition name="slide">
          <ul v-if="toggle.tracks">
            <li
              v-for="track in filteredTracks"
              :class="{ 'new': track.new }"
              :key="`track_${track.id}`"
            >
              <editor-menu-track
                :track="track"
                :filter="filter"
                :current-session="currentSession"
                :modified-sessions="modifiedSessions"
              />
            </li>
          </ul>
        </transition>
      </div>

      <div class="groups">
        <h2 @click="toggle.groups = !toggle.groups">
          <button :title="$t('editor.groups.toggle')">
            <font-awesome icon="caret-right" fixed-width :rotation="toggle.groups ? 90 : null" />
          </button>
          <span>
          {{ $t('editor.nav.groups') }}
          <small>({{ filteredGroups.length }})</small>
        </span>
          <button @click.stop="createGroup" title="Add a group">
            <font-awesome icon="plus-circle" fixed-width />
          </button>
        </h2>
        <transition name="slide">
          <ul v-if="toggle.groups">
            <li
              v-for="group in filteredGroups"
              @click="changeCurrentSession(group.id)"
              :class="{
                'active': currentSession && currentSession === group,
                'modified': modifiedSessions.includes(group.id),
                'new': group.new
              }"
              :key="`group_${group.id}`"
              :title="$t('editor.groups.edit')"
            >
              <EditorMenuGroup
                :group="group"
                @clear-query="emitClearQuery"
              />
            </li>
          </ul>
        </transition>
      </div>

      <div class="users">
        <h2 @click="toggle.users = !toggle.users">
          <button :title="$t('editor.users.toggleUsers')">
            <font-awesome icon="caret-right" fixed-width :rotation="toggle.users ? 90 : null" />
          </button>
          <span>
          {{ $t('editor.nav.users') }}
          <small>({{ filteredUsers.length }})</small>
        </span>
<!--      Add a fake button to force the flex layout-->
          <button disabled />
        </h2>
        <transition name="slide">
          <ul v-if="toggle.users">
            <li
              v-for="user in filteredUsers"
              @click="changeCurrentSession(user.id)"
              :class="{'active': currentSession && currentSession === user}"
              :key="user.id"
              :title="$t('editor.users.edit')"
            >
              <span class="username">
                <avatar :id="user.id" :title="false" />
                {{user.displayName}}
              </span>
              <button @click="deleteUser(user.id)" v-if="canDeleteUsers" title="Delete user">
                <font-awesome icon="times" fixed-width />
              </button>
            </li>
          </ul>
        </transition>
      </div>
    </div>
  </nav>
</template>

<script>
import { gte } from 'semver';
import Avatar from '../Avatar.vue';
import EditorMenuTrack from './EditorMenuTrack.vue';
import EditorMenuGroup from './EditorMenuGroup.vue';

export default {
  name: 'editor-menu',

  components: {
    Avatar,
    EditorMenuTrack,
    EditorMenuGroup,
  },

  data() {
    return {
      filter: '',
      toggle: {
        tracks: false,
        groups: false,
        users: false,
      },
    };
  },

  props: {
    sessions: Array,
    currentSession: Object,
  },

  computed: {
    tracks() {
      return this.$store.getters.tracks || null;
    },
    groups() {
      return this.sessions.filter(session => session.type === 'group');
    },
    users() {
      return this.sessions.filter(session => session.type === 'user');
    },
    filteredTracks() {
      return this.tracks.filter((track) => {
        const trackGroups = track.groups.filter(group => group.includes(this.filter));

        return track.id.includes(this.filter) || trackGroups.length;
      }).sort((a, b) => a.id.localeCompare(b.id));
    },
    filteredGroups() {
      return this.groups.filter(group => group.id.includes(this.filter)
        || group.displayName.includes(this.filter));
    },
    filteredUsers() {
      return this.users.filter(user => user.displayName.includes(this.filter));
    },
    modifiedSessions() {
      return this.$store.getters.modifiedSessions;
    },
    canDeleteUsers() {
      const supportedVersion = '5.1.105';
      const { pluginVersion } = this.$store.getters.metaData;

      return gte(pluginVersion, supportedVersion);
    },
  },

  methods: {
    changeCurrentSession(sessionId) {
      this.$store.commit('setCurrentSession', sessionId);
      this.emitClearQuery();
    },
    createTrack() {
      this.$store.commit('setModal', {
        type: 'createTrack',
      });
    },
    createGroup() {
      this.$store.commit('setModal', { type: 'createGroup', object: this.groups });
    },
    deleteUser(userId) {
      this.$store.commit('setModal', {
        type: 'deleteUser',
        object: {
          userId,
        },
      });
    },
    emitClearQuery() {
      this.$emit('clear-query');
    },
  },

  watch: {
    filter(newValue) {
      if (newValue !== '') {
        this.toggle = {
          tracks: true,
          groups: true,
          users: true,
        };
      }
    },
  },
};
</script>

<style>
#editor-menu {
  width: 100%;
  max-width: 20rem;
  overflow-y: auto;
  max-height: 100%;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  position: absolute;
  z-index: 55;
  background: black;
  top: 4rem;
  bottom: 0;
  left: -20rem;
  transition: left 0.2s;
  user-select: none;
}
@media screen and (min-width: 768px) {
  #editor-menu {
    position: relative;
    flex: 0 0 20rem;
    left: unset;
    top: unset;
  }
}
#editor-menu.active {
  left: 0;
}
#editor-menu .filter {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--color-navy);
}
#editor-menu .filter input {
  font: inherit;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  padding: 0.5rem 1rem;
  width: calc(100% - 4rem);
  outline-offset: -1px;
  height: 4rem;
  margin-left: 4rem;
}
@media screen and (min-width: 768px) {
  #editor-menu .filter input {
    height: unset;
    width: 100%;
    margin: 0;
  }
}
#editor-menu .filter .delete {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  color: white;
  opacity: 0.5;
  border: 0;
}
#editor-menu .filter .delete:hover {
  cursor: pointer;
  opacity: 1;
}
#editor-menu h2 {
  margin: 0;
  padding: 0.5em 1em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-transform: uppercase;
  position: sticky;
  top: 2.5rem;
  z-index: 5;
  background-color: var(--color-navy);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}
#editor-menu h2 small {
  opacity: 0.6;
}
#editor-menu h2 button {
  background: transparent;
  border: none;
  opacity: 0.5;
  cursor: pointer;
  color: white;
  font-size: 1.5rem;
  padding: 0;
}
#editor-menu h2 button svg {
  transition: transform 0.2s;
}
#editor-menu h2 button:hover {
  opacity: 1;
}
#editor-menu h2 button[disabled] {
  width: 1em;
}
#editor-menu ul {
  margin: 0;
  padding: 0;
  list-style: none;
  margin-bottom: 3rem;
}
#editor-menu ul li {
  padding: 0.5em 1em 0.5em 2em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
}
#editor-menu ul li:before {
  position: absolute;
  left: 0.5em;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 1rem;
  font-size: 0.8rem;
  font-family: "Source Code Pro", monospace;
  padding: 0.25rem;
  width: 1em;
  text-align: center;
  height: 1em;
  line-height: 1;
  opacity: 0.75;
}
#editor-menu ul li.active {
  background-color: rgba(255, 255, 255, 0.1);
}
#editor-menu ul li.modified {
  background-color: rgba(252, 252, 0, 0.1);
}
#editor-menu ul li.modified:before {
  content: "M";
}
#editor-menu ul li.new {
  background-color: rgba(124, 252, 0, 0.1);
}
#editor-menu ul li.new:before {
  content: "N";
}
#editor-menu ul li:hover {
  background-color: rgba(255, 255, 255, 0.15);
}
#editor-menu ul li small {
  opacity: 0.5;
  font-size: smaller;
  display: block;
}
#editor-menu ul li small:before {
  content: "(";
}
#editor-menu ul li small:after {
  content: ")";
}
#editor-menu .tracks > ul > li {
  padding: 0;
  flex-direction: column;
  align-items: stretch;
}
#editor-menu .tracks > ul > li:hover {
  background: transparent;
}
#editor-menu .tracks > ul > li ul {
  margin-bottom: 0;
}
#editor-menu .tracks > ul > li ul li:last-child {
  border-bottom: 0;
}
#editor-menu .groups li > span {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#editor-menu .groups li > span .weight {
  opacity: 0.5;
}
#editor-menu .groups li:hover button {
  opacity: 0.5;
}
#editor-menu .users img {
  width: 1em;
  height: auto;
  margin-right: 0.5em;
}
#editor-menu .users li:hover button {
  opacity: 0.5;
}
#editor-menu .users li:hover button:hover {
  opacity: 1;
}
#editor-menu .users li button {
  position: absolute;
  right: 1rem;
  background: transparent;
  border: 0;
  opacity: 0;
  cursor: pointer;
  color: white;
}
</style>
