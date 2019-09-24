<template>
  <nav id="editor-menu">
    <div class="tracks" v-if="tracks.length">
      <h2 @click="toggle.tracks = !toggle.tracks">
        Tracks
        <font-awesome icon="plus-circle" @click="createTrack" />
      </h2>
      <transition name="slide">
        <ul v-if="toggle.tracks">
          <li
            v-for="track in tracks"
            :class="{ 'new': track.new }"
            :key="`track_${track.id}`"
          >
            <h3>{{ track.id }}</h3>
            <ul v-if="track.groups.length">
              <li
                v-for="group in track.groups"
                @click="changeCurrentSession(group)"
                :class="{ 'active': currentSession && currentSession.id === group, 'modified': modifiedSessions.has(group) }"
                :key="`${track.id}_${group}`"
              >
                {{ group }}
              </li>
            </ul>
          </li>
        </ul>
      </transition>
    </div>

    <div class="groups" v-if="groups.length">
      <h2 @click="toggle.groups = !toggle.groups">
        Groups
        <font-awesome icon="plus-circle" @click="createGroup" />
      </h2>
      <transition name="slide">
        <ul v-if="toggle.groups">
          <li
            v-for="group in groups"
            @click="changeCurrentSession(group.id)"
            :class="{ 'active': currentSession && currentSession === group, 'modified': modifiedSessions.has(group.id), 'new': group.new }"
            :key="group.id"
          >
            {{group.displayName}} <span v-if="group.displayName !== group.id">{{ group.id }}</span>
          </li>
        </ul>
      </transition>
    </div>

    <div class="users" v-if="users.length">
      <h2 @click="toggle.tracks = !toggle.tracks">
        Users
      </h2>
      <transition name="slide">
        <ul v-if="toggle.users">
          <li v-for="user in users" @click="changeCurrentSession(user.id)" :class="{'active': currentSession && currentSession === user}" :key="user.id">
            <img :src="`https://minotar.net/helm/${user.id}/100.png`"> {{user.displayName}}
          </li>
        </ul>
      </transition>
    </div>
  </nav>
</template>

<script>
  // import draggable from 'vuedraggable';

  export default {
    name: 'editor-menu',

    // components: {
    //   draggable
    // },

    data() {
      return {
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
      tracks: {
        get() {
          return this.$store.getters.tracks || null;
        },
        set(value) {
          this.$store.commit('updateTrackOrder', value);
        }
      },
      groups() {
        return this.sessions.filter(session => session.type === 'group');
      },
      users() {
        return this.sessions.filter(session => session.type === 'user');
      },
      modifiedSessions() {
        return this.$store.getters.modifiedSessions || null;
      }
    },

    methods: {
      changeCurrentSession(sessionId) {
        this.$store.commit('setCurrentSession', sessionId);
      },
      createTrack() {

      },
      createGroup() {
        this.$store.commit('setModal', { type: 'createGroup', object: this.groups });
      },
    }
  }
</script>

<style lang="scss">
  nav#editor-menu {
    flex: 0 0 20em;
    overflow-y: auto;
    max-height: 100%;
    text-align: center;
    border-right: 1px solid rgba(255,255,255,.2);

    h2 {
      margin: 0;
      padding: .5em 0;
      border-bottom: 1px solid rgba(255,255,255,.1);
      text-transform: uppercase;
      position: sticky;
      top: 0;
      z-index: 5;
      background-color: $navy;

      svg {
        position: absolute;
        right: 1em;
        top: 50%;
        transform: translateY(-50%);
        opacity: .5;
        cursor: pointer;

        &:hover {
          opacity: 1;
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
        position: relative;

        &.active {
          background-color: rgba(255,255,255,.1);
        }

        &.modified {
          background-color: rgba(252, 252, 0, .1);
        }

        &.new {
          background-color: rgba(124, 252, 0, .1);
        }

        &:hover {
          background-color: rgba(255,255,255,.15);
        }

        span {
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

      h3 {
        margin: 0;
        padding: .5rem 0;
        color: $brand-color;
        border-bottom: $grey 1px solid;
        text-transform: uppercase;
      }
    }

    .users {
      img {
        width: 1em;
        height: auto;
        position: absolute;
        left: 1em;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
</style>
