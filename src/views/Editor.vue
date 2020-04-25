<template>
  <main class="editor">
    <div v-if="!sessionId" class="tool-intro">
      <div>
        <img alt="LuckPerms logo" src="../assets/logo.png">
        <div class="text">
          <h1>LuckPerms</h1>
          <p>Web Permissions Editor</p>
          <a href="/editor/demo"><button class="button demo-button">View Demo</button></a>
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
        <div v-if="!sessions.length" class="tool-intro" key="loading">
          <div>
            <img alt="LuckPerms logo" src="../assets/logo.png">
            <div class="text">
              <h1>LuckPerms</h1>
              <p>Web Permissions Editor</p>
              <div v-if="!errors.load">
                <p>
                  <font-awesome icon="asterisk" :spin="true" />
                  Loading data...
                </p>
              </div>

              <div v-else class="error">
                <p><strong>There was an error loading the data.</strong> Either the URL was copied wrong or the session has expired.</p>
                <p>Please generate another editor session with <code>/lp editor</code>.</p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="editor-wrap container" :key="sessionId">
          <editor-menu :sessions="sessions" :current-session="currentSession" />

          <div class="editor-main">
            <nav>
              <div class="logo">
                Web Permissions Editor
                <span>BETA</span>
                <small>Please send any bugs, suggestions or feedback to <a href="https://github.com/lucko/LuckPermsWeb/issues" target="_blank">GitHub</a>.</small>
              </div>
              <div class="buttons">
<!--                <button>-->
<!--                  <font-awesome icon="undo" />-->
<!--                </button>-->
<!--                <button>-->
<!--                  <font-awesome icon="redo" />-->
<!--                </button>-->
                <button @click="saveData" title="Save and generate code">
                  <span v-if="saveStatus !== 'saving'">
                    <font-awesome icon="save" fixed-width />
                    Save
                  </span>
                  <span v-else>
                    <font-awesome icon="sync-alt" fixed-width :spin="true" />
                    Saving...
                  </span>
                </button>
              </div>
            </nav>

            <transition name="fade" mode="in-out">
              <div class="editor-no-session" v-if="!currentSession">
                <font-awesome icon="arrow-left" />
                <h1>Choose a group or user from the side bar</h1>
              </div>
            </transition>

            <transition name="fade" mode="out-in">
              <div class="editor-session" v-if="currentSession" :key="`session_${currentSession.id}`">
                <div class="session-container">
                  <Header :session="currentSession" :sessionData="currentSessionData" />
                  <Meta :session="currentSession" :sessionData="currentSessionData" />
                  <NodeList :nodes="currentNodes" />
                </div>
                <AddNode />
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
import EditorMenu from '@/components/Editor/EditorMenu';
import Header from '@/components/Editor/Header';
import Meta from '@/components/Editor/Meta';
import NodeList from '@/components/Editor/NodeList';
import AddNode from '@/components/Editor/AddNode';
import Modal from '@/components/Editor/Modal';

export default {
  name: 'Editor',

  components: {
    EditorMenu,
    Header,
    Meta,
    NodeList,
    AddNode,
    Modal,
  },

  computed: {
    sessionId() {
      return this.$store.getters.editorSessionId;
    },
    sessions() {
      return this.$store.getters.sessionSet;
    },
    currentSession() {
      return this.$store.getters.currentSession || null;
    },
    currentNodes() {
      return this.$store.getters.currentNodes || null;
    },
    currentSessionData() {
      if (this.currentSession) {
        const data = {};

        if (this.currentSession.type === 'group') {
          data.type = 'group';
        } else if (this.currentSession.type === 'user') {
          data.type = 'user';
        } else {
          data.type = null;
        }

        data.parents = this.currentNodes.filter(node => node.key.startsWith('group.'));
        data.displayname = this.currentNodes.filter(node => node.key.startsWith('displayname.'));
        data.weight = this.currentNodes.filter(node => node.key.startsWith('weight.'));
        data.prefixes = this.currentNodes.filter(node => node.key.startsWith('prefix.'));
        data.suffixes = this.currentNodes.filter(node => node.key.startsWith('suffix.'));
        data.meta = this.currentNodes.filter(node => node.key.startsWith('meta.'));

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
    saveStatus() {
      return this.$store.getters.saveStatus;
    },
  },

  created() {
    if (this.sessions?.length) return;

    let sessionId;

    if (this.$route.params.id) {
      sessionId = this.$route.params.id;
    } else if (this.$route.query.id) {
      sessionId = this.$route.query.id;
    } else if (this.$route.hash) {
      sessionId = this.$route.hash.split('#')[1];
    }
    if (sessionId) {
      this.$store.dispatch('getEditorData', sessionId);
    }
  },

  methods: {
    saveData() {
      this.$store.dispatch('saveData');
    },
  },
};
</script>

<style lang="scss">
main.editor {
  display: flex;
  flex-direction: column;

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

      .editor-main {
        max-height: 100%;
        overflow-y: hidden;
        flex: 4;
        display: flex;
        flex-direction: column;
        position: relative;
        border-right: 1px solid rgba(255, 255, 255, 0.2);

        > nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: .5em 1rem;
          font-size: 1.5em;
          position: relative;
          z-index: 2;

          .logo {
            display: flex;
            align-items: center;
            font-weight: bold;

            img {
              height: 1.5em;
              width: auto;
              margin-right: .5em;
            }

            span {
              background: tomato;
              display: inline-block;
              padding: .1rem .5rem;
              margin-left: 1rem;
              border-radius: 2px;
            }

            small {
              font-weight: normal;
              opacity: .6;
              font-size: 1rem;
              max-width: 15em;
              line-height: 1;
              margin-left: 1rem;
            }
          }

          .buttons {
            button {
              background: $brand-color;
              color: $navy;
              font: inherit;
              font-size: 1rem;
              font-weight: bold;
              padding: .25rem .5rem;
              border:0;
              margin-left: .5rem;
              cursor: pointer;

              &:hover {
                opacity: .8;
              }
            }
          }
        }

        .editor-session {
          max-height: 100%;
          width: 100%;
          overflow: hidden;
          flex: 1;
          display: flex;
          flex-direction: column;

          .session-container {
            overflow: auto;
          }
        }

        .editor-no-session {
          position: absolute;
          z-index: 1;
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;

          svg {
            font-size: 2rem;
            opacity: .33;
            margin-right: 1rem;
          }
        }

        h1 {
          margin: 0;
        }
      }
    }
  }
}
</style>
