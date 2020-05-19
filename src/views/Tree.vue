<template>
  <main class="tree container">
    <div class="tree-viewer" v-if="treeData.metadata">
      <div class="col-1">
        <h1>Permission Tree viewer</h1>
        <div class="meta-info">
          <table>
            <tr>
              <td>Uploaded by</td>
              <td>
                <avatar
                  v-if="treeData.metadata.uploader.name !== 'Console'"
                  :id="treeData.metadata.uploader.uuid"
                  :name="treeData.metadata.uploader.name"
                  :size="16"
                />
                {{ treeData.metadata.uploader.name }}
              </td>
            </tr>
            <tr>
              <td title="When the recording started">
                Time
              </td>
              <td>{{ treeData.metadata.time }}</td>
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
          <branch v-for="branch in treeData.data" :branch-data="branch" />
        </div>
      </div>
    </div>
    <div v-else class="tool-intro">
      <div>
        <img alt="LuckPerms logo" src="../assets/logo.png">
        <div class="text">
          <h1>LuckPerms</h1>
          <p>Permission Tree Viewer</p>
          <template v-if="!errors.load">
            <a href="/tree/demo"><button class="button demo-button">View Demo</button></a>
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

export default {
  metaInfo: {
    title: 'Tree',
  },
  components: {
    Avatar,
    Branch,
  },
  computed: {
    treeData() { return this.$store.getters.tree; },
    errors() { return this.$store.state.tree.errors; },
  },
  created() {
    if (!this.treeData.sessionId) {
      let sessionId;

      if (this.$route.params.id) {
        sessionId = this.$route.params.id;
      } else if (this.$route.query.id) {
        sessionId = this.$route.query.id;
      } else if (this.$route.hash) {
        sessionId = this.$route.hash.split('#')[1];
      }
      if (sessionId) {
        this.$store.dispatch('getTreeData', sessionId);
      }
    }
  },
  methods: {
    expandTree() {
      this.$root.$emit('expandTree');
    },
    collapseTree() {
      this.$root.$emit('collapseTree');
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
      }
    }
  }
</style>
