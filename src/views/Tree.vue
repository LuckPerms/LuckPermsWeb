<template>
  <main class="tree container">
    <div class="tree-viewer" v-if="metaData">
      <div class="col-1">
        <h1>Permission Tree Viewer</h1>
        <div class="meta-info">
          <table>
            <tr>
              <td>Uploaded by</td>
              <td>
                <avatar
                  v-if="metaData.uploader.uuid !== '00000000-0000-0000-0000-000000000000'"
                  :id="metaData.uploader.uuid"
                  :title="false"
                />
                {{ metaData.uploader.name }}
              </td>
            </tr>
            <tr>
              <td title="When the recording started">
                Time
              </td>
              <td>{{ metaData.time }}</td>
            </tr>
            <tr v-if="metaData.root">
              <td title="Root">
                Root
              </td>
              <td>
                <code>{{ metaData.root }}</code>
              </td>
            </tr>
            <tr v-if="metaData.referenceUser">
              <td title="Reference user">
                Reference user
              </td>
              <td>
                <avatar
                  :id="metaData.referenceUser.uuid"
                  :name="metaData.referenceUser.name"
                />
                {{ metaData.referenceUser.name }}
              </td>
            </tr>
          </table>
        </div>
        <button @click="expandTree">
          <font-awesome icon="plus-square" />
          Expand
        </button>
        <button @click="collapseTree">
          <font-awesome icon="minus-square" />
          Collapse
        </button>
      </div>
      <div class="col-2">
        <div>
          <branch
            v-for="(branch, node) in treeData"
            :branch-data="branch"
            :node="node"
            :key="node"
          />
        </div>
      </div>
    </div>
    <div v-else class="tool-intro">
      <div>
        <img alt="LuckPerms logo" src="../assets/logo.svg">
        <div class="text">
          <h1>LuckPerms</h1>
          <p>Permission Tree Viewer</p>
          <template v-if="!errors.load">
            <router-link to="/treeview/demo">
              <button class="button demo-button">View Demo</button>
            </router-link>
            <p>To generate a permission tree, do the following in game or from the console:</p>
            <ul>
              <li><code>/lp tree [scope] [player]</code></li>
              <li>Follow the URL that is generated</li>
            </ul>
          </template>
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
  </main>
</template>

<script>
import Avatar from '../components/Avatar.vue';
import Branch from '../components/Tree/Branch.vue';
import updateSession from '@/util/session';

export default {
  metaInfo: {
    title: 'Tree',
  },
  components: {
    Avatar,
    Branch,
  },
  computed: {
    treeData() {
      const { tree } = this.$store.getters;

      if (tree.data?.tree) {
        return tree.data.tree;
      }
      return tree.data;
    },
    metaData() {
      return this.$store.state.tree?.metadata;
    },
    errors() { return this.$store.state.tree.errors; },
  },
  created() {
    if (this.treeData?.sessionId) return;
    updateSession(this.$route, 'getTreeData');
  },
  methods: {
    expandTree() {
      this.$root.$emit('expandTree');
    },
    collapseTree() {
      this.$root.$emit('collapseTree');
    },
  },
  watch: {
    $route(route) {
      updateSession(route, 'getTreeData');
    },
  },
};
</script>

<style lang="scss">
  main.tree {
    display: flex;
    overflow-y: hidden;
  }

  .tree-viewer {
    width: 100%;
    height: 100%;
    max-height: 100%;
    display: flex;

    > .col-1 {
      flex: 0 0 30%;
      background: transparent;
      padding: 1rem;

      h1 {
        margin: 0;
        padding: 1rem;
        line-height: 1;
        background: rgba(255,255,255,.05);
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
      }

      .meta-info {
        background: $grey;
        padding: 1rem;
        border-bottom-left-radius: 2px;
        border-bottom-right-radius: 2px;

        img {
          image-rendering: pixelated;
          image-rendering: -webkit-optimize-contrast;
        }
      }

      td:first-child {
        width: 40%;
      }

      button {
        background: rgba(0,0,0,.2);
        font: inherit;
        color: $brand-color;
        padding: .5rem 1rem;
        border: 0;
        margin-top: 1rem;
        margin-right: 1rem;
        cursor: pointer;

        svg {
          opacity: .5;
          margin-right: .5rem;
          color: #FFF;
        }
      }
    }

    > .col-2 {
      flex: 0 0 70%;
      display: flex;
      padding: 1rem 1rem 1rem 0;

      > div {
        width: 100%;
        overflow: auto;
        padding-right: 1rem;

        > .branch {
          padding-left: 0;
        }
      }
    }
  }
</style>
