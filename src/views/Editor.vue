<template>
  <main class="editor">
    <div v-if="!sessionId" class="tool-intro">
      <div>
        <img alt="LuckPerms logo" src="../assets/logo.svg">
        <div class="text">
          <h1>LuckPerms</h1>
          <p>Web Permissions Editor</p>
          <router-link to="/editor/demo">
            <button class="button demo-button">View Demo</button>
          </router-link>
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
      <div v-if="loading && !loaded" class="tool-intro" key="loading">
        <div>
          <img alt="LuckPerms logo" src="../assets/logo.svg">
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
              <p>
                <strong>There was an error loading the data.</strong>
                Either the URL was copied wrong or the session has expired.
              </p>
              <p>Please generate another editor session with <code>/lp editor</code>.</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="editor-wrap" :key="sessionId">
        <editor-menu
          :sessions="sessions"
          :current-session="currentSession"
          :class="{ active: menu }"
          @clear-query="clearQuery"
        />

          <div
            id="editor-menu-focus"
            class="overlay-focus"
            v-if="menu"
            @click="menu = !menu"
          ></div>

        <button
          id="editor-menu-toggle"
          @click="menu = !menu"
        >
          <font-awesome icon="bars" />
        </button>

        <div class="editor-main">
          <nav>
            <div class="logo">
              <h1>Web Permissions Editor</h1>
            </div>
            <div class="buttons">
              <div class="search">
                <input
                  v-if="search.toggle"
                  type="text"
                  v-model="search.query"
                  placeholder="Search"
                  ref="searchInput"
                />
                <button @click="toggleSearch">
                  <font-awesome v-if="search.query" icon="times" fixed-width />
                  <font-awesome v-else icon="search" fixed-width />
                </button>
              </div>
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


            <div class="editor-no-session" v-if="!currentSession && !search.debouncedQuery">
              <font-awesome icon="arrow-left" />
              <h1>Choose a group or user from the side bar</h1>
            </div>

            <div
              class="editor-session"
              v-if="currentSession && !search.debouncedQuery"
              :key="`session_${currentSession.id}`"
            >
              <div class="session-container">
                <Header :session="currentSession" :sessionData="currentSessionData" />
                <Meta :session="currentSession" :sessionData="currentSessionData" />
                <NodeList :nodes="currentNodes" />
              </div>
            </div>

            <search-nodes
              v-if="search.debouncedQuery"
              :query="search.debouncedQuery"
              @clear-query="clearQuery"
            />

            <AddNode v-if="(currentSession && !search.debouncedQuery) || selectedNodes.length" />
        </div>
      </div>
    </div>

    <transition name="fade">
      <Modal v-if="modal && modal.type" :modal="modal" />
    </transition>

  </main>
</template>

<script>
import debounce from 'lodash.debounce';
import EditorMenu from '@/components/Editor/EditorMenu.vue';
import Header from '@/components/Editor/Header.vue';
import Meta from '@/components/Editor/Meta.vue';
import NodeList from '@/components/Editor/NodeList.vue';
import AddNode from '@/components/Editor/AddNode.vue';
import SearchNodes from '@/components/Editor/SearchNodes.vue';
import Modal from '@/components/Editor/Modal.vue';
import updateSession from '@/util/session';

export default {
  name: 'Editor',
  metaInfo: {
    title: 'Editor',
  },
  components: {
    EditorMenu,
    Header,
    Meta,
    NodeList,
    AddNode,
    SearchNodes,
    Modal,
  },
  data() {
    return {
      menu: false,
      search: {
        toggle: false,
        query: '',
        debouncedQuery: '',
      },
      loading: false,
      loaded: false,
    };
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
    version() {
      return this.$store.getters.version;
    },
    userVersion() {
      return this.$store.getters.metaData.pluginVersion;
    },
    selectedNodes() {
      return this.$store.getters.selectedNodeIds;
    },
  },
  async created() {
    this.updateSession();
  },
  watch: {
    $route(route) {
      updateSession(route, 'getEditorData');
    },
    // eslint-disable-next-line func-names
    'search.query': debounce(function (value) {
      this.search.debouncedQuery = String(value).toLowerCase();
    }, 200),
  },
  methods: {
    updateSession() {
      if (this.loaded) return;

      try {
        this.loading = true;
        updateSession(this.$route, 'getEditorData');
        this.loaded = true;
      } catch (error) {
        this.loaded = false;
      } finally {
        this.loading = false;
      }
    },
    saveData() {
      this.$store.dispatch('saveData');
    },
    async toggleSearch() {
      const { search } = this;
      if (search.toggle === true) {
        search.query = '';
        search.toggle = false;
      } else {
        search.toggle = true;
        await this.$nextTick();
        this.$refs.searchInput.focus();
      }
    },
    clearQuery() {
      this.search.query = '';
      this.search.debouncedQuery = '';
      this.search.toggle = false;
    },
  },
};
</script>

<style lang="scss">
#editor-menu-toggle {
  position: absolute;
  left: 0;
  z-index: 55;
  background: transparent;
  font: inherit;
  font-size: 2rem;
  border: 0;
  height: 4rem;
  width: 4rem;
  color: $brand-color;

  @include breakpoint($sm) {
    display: none;
  }
}

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

        > nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          font-size: 1.5rem;
          position: relative;
          z-index: 52;

          .logo {
            display: flex;
            align-items: center;
            font-weight: bold;
            margin-left: 4rem;

            @include breakpoint($sm) {
              margin-left: 0;
            }

            h1 {
              font-size: 1.5rem;
            }
          }

          .buttons {
            display: flex;

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

            .search {
              display: flex;
              position: relative;

              button {
                background: white;
                margin: 0;
              }
            }

            input {
              padding: .5rem;
              width: 20rem;
              background: white;
              border: 0;
              background: rgba(255,255,255,.85);
              border-right: 1px solid rgba(0,0,0,.25);
              font-family: "Source Code Pro", monospace;
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
            overflow: hidden;
            display: flex;
            flex-direction: column;
            flex: 1;
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
