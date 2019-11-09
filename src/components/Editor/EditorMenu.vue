<template>
  <nav id="editor-menu">
    <div class="filter">
      <input type="text" placeholder="Search" v-model="filter" title="Filter tracks, groups and users">
      <button class="delete" @click="filter = ''" v-if="filter !== ''" title="Clear filter">
        <font-awesome icon="times" fixed-width />
      </button>
    </div>

    <div class="sessions">
      <div class="tracks" v-if="filteredTracks.length">
        <h2>
          <button @click="toggle.tracks = !toggle.tracks" title="Show/hide tracks">
            <font-awesome icon="caret-right" fixed-width :rotation="toggle.tracks ? 90 : null" />
          </button>
          <span>
          Tracks
          <small>({{ filteredTracks.length }})</small>
        </span>
          <button @click="createTrack" title="Add a track">
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
              ></editor-menu-track>
            </li>
          </ul>
        </transition>
      </div>

      <div class="groups" v-if="filteredGroups.length">
        <h2>
          <button @click="toggle.groups = !toggle.groups" title="Show/hide groups">
            <font-awesome icon="caret-right" fixed-width :rotation="toggle.groups ? 90 : null" />
          </button>
          <span>
          Groups
          <small>({{ filteredGroups.length }})</small>
        </span>
          <button @click="createGroup" title="Add a group">
            <font-awesome icon="plus-circle" fixed-width />
          </button>
        </h2>
        <transition name="slide">
          <ul v-if="toggle.groups">
            <li
              v-for="group in filteredGroups"
              @click="changeCurrentSession(group.id)"
              :class="{ 'active': currentSession && currentSession === group, 'modified': modifiedSessions.includes(group.id), 'new': group.new }"
              :key="group.id"
              title="Edit group"
            >
            <EditorMenuGroup :group="group" />
            </li>
          </ul>
        </transition>
      </div>

      <div class="users" v-if="filteredUsers.length">
        <h2>
          <button @click="toggle.users = !toggle.users" title="Show/hide users">
            <font-awesome icon="caret-right" fixed-width :rotation="toggle.users ? 90 : null" />
          </button>
          <span>
          Users
          <small>({{ filteredUsers.length }})</small>
        </span>
<!--      Add a fake button to force the flex layout-->
          <button disabled></button>
        </h2>
        <transition name="slide">
          <ul v-if="toggle.users">
            <li
              v-for="user in filteredUsers"
              @click="changeCurrentSession(user.id)"
              :class="{'active': currentSession && currentSession === user}"
              :key="user.id"
              title="Edit user"
            >
              <img :src="`https://minotar.net/helm/${user.id}/100.png`">
              {{user.displayName}}
            </li>
          </ul>
        </transition>
      </div>
    </div>


  </nav>
</template>

<script>
  import EditorMenuTrack from './EditorMenuTrack';
  import EditorMenuGroup from './EditorMenuGroup';

  export default {
    name: 'editor-menu',

    components: {
      EditorMenuTrack,
      EditorMenuGroup
    },

    data() {
      return {
        filter: '',
        toggle: {
          tracks: false,
          groups: false,
          users: false,
        }
      }
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
        return this.tracks.filter(track => {
          const trackGroups = track.groups.filter(group => {
            return group.includes(this.filter);
          });

          return track.id.includes(this.filter) || trackGroups.length;
        }).sort((a, b) => a.id.localeCompare(b.id));
      },
      filteredGroups() {
        return this.groups.filter(group => {
          return group.id.includes(this.filter) || group.displayName.includes(this.filter);
        });
      },
      filteredUsers() {
        return this.users.filter(user => {
          return user.displayName.includes(this.filter);
        });
      },
      modifiedSessions() {
        return this.$store.getters.modifiedSessions;
      }
    },

    methods: {
      changeCurrentSession(sessionId) {
        this.$store.commit('setCurrentSession', sessionId);
      },
      createTrack() {
        this.$store.commit('setModal', {
          type: 'createTrack',
        });
      },
      createGroup() {
        this.$store.commit('setModal', { type: 'createGroup', object: this.groups });
      }
    },

    watch: {
      filter(newValue) {
        if (newValue !== '') {
          this.toggle = {
            tracks: true,
            groups: true,
            users: true,
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  #editor-menu {
    flex: 0 0 20em;
    overflow-y: auto;
    max-height: 100%;
    border-right: 1px solid rgba(255,255,255,.2);

    .filter {
      position: sticky;
      top: 0;
      z-index: 10;
      background: $navy;

      input {
        font: inherit;
        color: white;
        background: rgba(255,255,255,.1);
        border: none;
        padding: .5rem 1rem;
        width: 100%;
        outline-offset: -1px;
      }

      .delete {
        position: absolute;
        right: .5rem;
        top: 50%;
        transform: translateY(-50%);
        background: transparent;
        color: white;
        opacity: .5;
        border: 0;

        &:hover {
          cursor: pointer;
          opacity: 1;
        }
      }
    }

    h2 {
      margin: 0;
      padding: .5em 1em;
      border-bottom: 1px solid rgba(255,255,255,.1);
      text-transform: uppercase;
      position: sticky;
      top: 2.5rem;
      z-index: 5;
      background-color: $navy;
      display: flex;
      align-items: center;
      justify-content: space-between;

      small {
        opacity: .6;
      }

      button {
        background: transparent;
        border: none;
        opacity: .5;
        cursor: pointer;
        color: white;
        font-size: 1.5rem;
        padding: 0;

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
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      margin-bottom: 3rem;

      li {
        padding: .5em 2em;
        border-bottom: 1px solid rgba(255,255,255,.1);
        cursor: pointer;
        display: flex;
        align-items: center;
        position: relative;

        &:before {
          position: absolute;
          left: .5em;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 1rem;
          font-size: .8rem;
          font-family: "Source Code Pro", monospace;
          padding: 0.25rem;
          width: 1em;
          text-align: center;
          height: 1em;
          line-height: 1;
          opacity: .75;
        }

        &.active {
          background-color: rgba(255,255,255,.1);
        }

        &.modified {
          background-color: rgba(252, 252, 0, .1);

          &:before {
            content: 'M';
          }
        }

        &.new {
          background-color: rgba(124, 252, 0, .1);

          &:before {
            content: 'N';
          }
        }

        &:hover {
          background-color: rgba(255,255,255,.15);
        }

        small {
          opacity: .5;
          font-size: smaller;

          &:before {
            content: '(';
          }

          &:after {
            content: ')';
          }
        }
      }
    }

    .tracks {
      > ul {
        > li {
          padding: 0;
          flex-direction: column;
          align-items: stretch;

          &:hover {
            background: transparent;
          }

          ul {
            margin-bottom: 0;

            li {
              &:last-child {
                border-bottom: 0;
              }
            }
          }
        }
      }
    }

    .groups {
      li {
        > span {
          width: 100%;
          display: flex;
          justify-content: space-between;

          .weight {
            opacity: .5;
          }
        }
      }
    }

    .users {
      img {
        width: 1em;
        height: auto;
        margin-right: .5em;
      }
    }
  }
</style>
