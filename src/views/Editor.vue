<template>
  <main class="editor">

    <div v-if="!sessionId" class="editor-intro">
      <div>
        <img alt="LuckPerms logo" src="../assets/logo.png">
        <div class="text">
          <h1>LuckPerms</h1>
          <p>Web Permissions Editor</p>
          <p>To start a new editor session, use one of the following commands:</p>
          <ul>
            <li><code>/lp editor</code></li>
            <li><code>/lp user &lt;user&gt; editor</code></li>
            <li><code>/lp group &lt;group&gt; editor</code></li>
          </ul>
        </div>
      </div>
    </div>

    <div v-else class="editor-container">

      <transition name="fade" mode="out-in">
        <div v-if="!sessions.length" class="editor-intro" key="loading">
          <div>
            <img alt="LuckPerms logo" src="../assets/logo.png">
            <div class="text">
              <h1>LuckPerms</h1>
              <p>Web Permissions Editor</p>
              <p v-if="!errors.load">
                <font-awesome icon="asterisk" :spin="true" />
                Loading data...
              </p>
              <div v-else class="error">
                <p><strong>There was an error loading the data.</strong> Either the URL was copied wrong or the session has expired.</p>
                <p>Please generate another editor session with <code>/lp editor</code>.</p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="editor-wrap" :key="sessionId">
          <nav>
            <div class="groups" v-if="groups.length">
              <h2>
                Groups
                <font-awesome icon="plus-circle" @click="createGroup" />
              </h2>
              <ul>
                <li v-for="group in groups" @click="changeCurrentSession(group.id)" :class="{'active': currentSession == group}" :key="group.id">
                  {{group.who.friendly}} <span v-if="displayGroupName(group)">{{ displayGroupName(group) }}</span>
                </li>
              </ul>
            </div>
            <div class="users" v-if="users.length">
              <h2>Users</h2>
              <ul>
                <li v-for="user in users" @click="changeCurrentSession(user.id)" :class="{'active': currentSession == user}" :key="user.id">
                  <img :src="`https://minotar.net/helm/${user.who.uuid}/100.png`"> {{user.who.friendly}}
                </li>
              </ul>
            </div>
          </nav>

          <div class="editor-main">
            <nav>
              <div class="logo">
                <img alt="LuckPerms logo" src="../assets/logo.png">
                Web Permissions Editor
              </div>
              <div class="buttons">
                <font-awesome icon="undo" />
                <font-awesome icon="redo" />
                <font-awesome icon="save" />
              </div>
            </nav>

            <transition name="fade" mode="in-out">
              <div class="editor-no-session" v-if="!currentSession">
                <h1>Choose a group or user from the side bar</h1>
              </div>
            </transition>

            <transition name="fade" mode="out-in">
              <div class="editor-session" v-if="currentSession" :key="`session_${currentSession.who.id}`">
                <Header :session="currentSession" :sessionData="currentSessionData" />
                <Meta @change-current-session="changeCurrentSession" :session="currentSession" :sessionData="currentSessionData" />
                <NodeList :nodes="currentNodes" :session="currentSession" />
              </div>
            </transition>

          </div>
        </div>
      </transition>

    </div>

    <transition name="fade">
      <Modal v-if="modal && modal.type" :modal="modal" />
    </transition>

  </main>
</template>

<script>
import Header from '@/components/Editor/Header.vue';
import Meta from '@/components/Editor/Meta.vue';
import NodeList from '@/components/Editor/NodeList.vue';
import Modal from '@/components/Editor/Modal.vue';

export default {
  name: 'Editor',
  components: {
    Header,
    Meta,
    NodeList,
    Modal,
  },
  data() {
    return {
      sessionId: '',
    };
  },

  computed: {
    sessions() {
      return this.$store.getters.sessionSet;
    },
    groups() {
      return this.sessions.filter(session => session.who.id.indexOf('group') == 0);
    },
    users() {
      return this.sessions.filter(session => session.who.id.indexOf('user') == 0);
    },
    currentSession() {
      return this.$store.getters.currentSession || null;
    },
    currentNodes() {
      return this.$store.getters.currentNodes || null;
    },
    currentSessionData() {
      if (this.currentNodes.length) {
        let data = {};

        if (this.currentSession.who.id.indexOf('group') == 0) {
          data.type = 'group';
        } else if (this.currentSession.who.id.indexOf('user') == 0) {
          data.type = 'user';
        } else {
          data.type = null;
        }

        data.parents = this.currentNodes.filter(node => node.permission.indexOf('group') == 0);

        data.displayname = this.currentNodes.filter(node => node.permission.indexOf('displayname') == 0);

        data.weight = this.currentNodes.filter(node => node.permission.indexOf('weight') == 0);

        data.prefixes = this.currentNodes.filter(node => node.permission.indexOf('prefix') == 0);

        data.suffixes = this.currentNodes.filter(node => node.permission.indexOf('suffix') == 0);

        data.meta = this.currentNodes.filter(node => node.permission.indexOf('meta') == 0);

        return data;
      }
      return null;
    },
    modal() {
      return this.$store.state.editor.modal || null;
    },
    errors() {
      return this.$store.state.editor.errors;
    },
  },

  created() {
    if (this.$route.params.id) {
      this.sessionId = this.$route.params.id;

      this.$store.dispatch('getEditorData', this.sessionId);
    }
  },

  methods: {
    changeCurrentSession(sessionId) {
      this.$store.commit('setCurrentSession', sessionId);
    },
    displayGroupName(group) {
      const { friendly } = group.who;
      const id = group.who.id.split('/').pop();

      if (friendly != id) {
        return id;
      }
      return null;
    },
    createGroup() {
      this.$store.commit('setModal', { type: 'createGroup', object: this.groups });
    },
  },
};
</script>

<style lang="scss">
main.editor {
  display: flex;
  flex-direction: column;

  .editor-intro {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    > div {
      display: flex;
      align-items: center;
      background: rgba(255,255,255,.2);
      padding: 2em;
      max-width: 550px;
      border-radius: 2px;
    }

    img {
      margin-right: 2em;
    }

    h1 {
      font-size: 3em;
      line-height: 1;
      margin: 0;

      + p {
        font-size: 1.5em;
        margin-top: 0;
        margin-bottom: 1rem;
      }
    }

    p {
      &:first-of-type {
        margin-top: 0;
      }

      &:last-of-type {
        margin-bottom: 0;
      }
    }

    ul {
      margin: 0;
      margin-top: 1em;
      padding-left: 1.5em;

      li {
        margin-bottom: .25em;

        &:last-child {
          margin: 0;
        }
      }
    }

    svg {
      margin-right: .5em;
      opacity: .5;
    }

    .error {
      margin-top: 1em;
      color: tomato;
    }
  }

  .editor-container {
    width: 100%;
    height: 100%;
    max-height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .editor-wrap {
      display: flex;
      width: 100%;
      height: 100%;
      max-height: 100%;

      > nav {
        flex: 0 0 20em;
        overflow-y: auto;
        max-height: 100%;
        text-align: center;
        border-right: 1px solid rgba(255,255,255,.2);
        padding-bottom: 3em;

        h2 {
          margin: 0;
          padding: .5em 0;
          border-bottom: 1px solid rgba(255,255,255,.1);
          text-transform: uppercase;
          position: sticky;
          top: 0;
          z-index: 5;
          background-color: #101022;

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

          li {
            padding: .5em 2em;
            border-bottom: 1px solid rgba(255,255,255,.1);
            cursor: pointer;
            position: relative;

            &.active {
              background-color: rgba(255,255,255,.1);
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

      .editor-main {
        max-height: 100%;
        overflow-y: hidden;
        flex: 4;
        display: flex;
        flex-direction: column;
        position: relative;

        > nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: .5em 1rem;
          font-size: 1.5em;

          .logo {
            display: flex;
            align-items: center;
            font-weight: bold;

            img {
              height: 1.5em;
              width: auto;
              margin-right: .5em;
            }
          }

          .buttons {
            svg {
              margin-left: 1em;
            }
          }
        }

        > div {
          max-height: 100%;
          width: 100%;
          overflow-y: auto;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .editor-no-session {
          position: absolute;
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        h1 {
          margin: 0;
        }
      }
    }
  }
}
</style>
