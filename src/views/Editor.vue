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
      <div v-if="!data" class="editor-intro">
        <div>
          <p>Loading data...</p>
        </div>
      </div>
      <div v-else class="editor-wrap">
        <nav>
          <div class="groups">
            <h2>Groups</h2>
            <ul>
              <li v-for="group in groups" @click="currentSession = group" :class="{'active': currentSession == group}">
                {{group.who.friendly}} <span v-if="displayGroupName(group)">{{ displayGroupName(group) }}</span>
              </li>
            </ul>
          </div>
          <div class="users">
            <h2>Users</h2>
            <ul>
              <li v-for="user in users" @click="currentSession = user" :class="{'active': currentSession == user}">
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

          <div v-if="!currentSession">
            <h1>Choose a group or user from the side bar</h1>
          </div>

          <div v-else>
            <Header :session="currentSession" :sessionData="currentSessionData" :key="currentSession.who.id" />
            <Meta :session="currentSession" :sessionData="currentSessionData" />
            <NodeList :nodes="currentSession.nodes" />
          </div>
        </div>
      </div>
    </div>

  </main>
</template>

<script>
import Header from '@/components/Editor/Header.vue';
import Meta from '@/components/Editor/Meta.vue';
import NodeList from '@/components/Editor/NodeList.vue';
import axios from 'axios';

export default {
  name: 'Editor',
  components: {
    Header,
    Meta,
    NodeList,
  },
  data: function() {
    return {
      sessionId: '',
      // data: null,
      currentSession: null,
    }
  },

  computed: {
    data() {
      return this.$store.state.editor.data;
    },
    groups: function() {
      return this.data.sessions.filter(session => {
        return session.who.id.indexOf('group') == 0;
      });
    },
    users: function() {
      return this.data.sessions.filter(session => {
        return session.who.id.indexOf('user') == 0;
      });
    },
    currentSessionData: function() {
      let data = {};

      if (this.currentSession.who.id.indexOf('group') == 0) {
        data.type = 'group';
      } else if (this.currentSession.who.id.indexOf('user') == 0) {
        data.type = 'user';
      } else {
        data.type = null;
      }

      data.parents = this.currentSession.nodes.filter(node => {
        return node.permission.indexOf('group') == 0;
      });

      data.displayname = this.currentSession.nodes.filter(node => {
        return node.permission.indexOf('displayname') == 0;
      });

      data.weight = this.currentSession.nodes.filter(node => {
        return node.permission.indexOf('weight') == 0;
      });

      data.prefixes = this.currentSession.nodes.filter(node => {
        return node.permission.indexOf('prefix') == 0;
      });

      data.suffixes = this.currentSession.nodes.filter(node => {
        return node.permission.indexOf('suffix') == 0;
      });

      data.meta = this.currentSession.nodes.filter(node => {
        return node.permission.indexOf('meta') == 0;
      });

      return data;
    }
  },

  created() {
    if (this.$route.params.id) {
      this.sessionId = this.$route.params.id;

      this.$store.dispatch('getEditorData', this.sessionId);

      // axios.get(`https://bytebin.lucko.me/${this.sessionId}`)
      // .then(res => {
      //   this.data = res.data;
      // })
      // .catch(console.error);
    }
  },

  methods: {
    changeCurrentSession: function(session) {
      this.currentSession = session;
    },
    displayGroupName: function(group) {
      const friendly = group.who.friendly;
      const id = group.who.id.split('/').pop();

      if (friendly != id) {
        return id;
      } else {
        return null;
      }
    }
  }
}
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
      max-width: 500px;
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
        margin-bottom: 1em;
      }
    }

    ul {
      margin: 0;
      padding-left: 1.5em;

      li {
        margin-bottom: .25em;

        &:last-child {
          margin: 0;
        }
      }
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
        flex: 1;
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
          overflow-y: auto;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        h1 {
          margin: 0;
        }
      }
    }
  }
}
</style>
