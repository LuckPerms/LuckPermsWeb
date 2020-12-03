<template>
  <main class="tree container">
    <client-only>
      <div class="tree-viewer" v-if="metaData">
        <div class="col-1">
          <h1>Permission Tree Viewer</h1>
          <div class="meta-info">
            <table>
              <tr>
                <td>Uploaded by</td>
                <td>
                  <avatar
                    v-if="metaData.uploader.name !== 'Console'"
                    :id="metaData.uploader.uuid"
                    :name="metaData.uploader.name"
                    :size="16"
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
                  <Avatar
                    :id="metaData.referenceUser.uuid"
                    :name="metaData.referenceUser.name"
                    :size="16"
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
            <Branch
              v-for="(branch, node) in treeData"
              :branch-data="branch"
              :node="node"
              :key="node"
            />
          </div>
        </div>
      </div>
      <ToolIntro v-else type="treeview" :error="errors.load" loading="true" />
    </client-only>
  </main>
</template>

<script>
import Avatar from '@/components/Avatar.vue';
import Branch from '@/components/Tree/Branch.vue';
import ToolIntro from '@/components/ToolIntro.vue';

export default {
  head: {
    title: 'Tree',
    meta: [
      { hid: 'description', name: 'description', content: 'Easily view your permission nodes.' },
      { hid: 'twitter:description', name: 'twitter:description', content: 'Easily view your permission nodes.' },
      { hid: 'og:description', name: 'og:description', content: 'Easily view permission nodes.' },
    ],
  },
  components: {
    Avatar,
    Branch,
    ToolIntro,
  },
  computed: {
    treeData() {
      const { tree } = this.$store.getters;
      if (tree.data?.tree) {
        return tree.data.tree;
      } else if (tree.data) {
        return tree.data;
      }
    },
    metaData() {
      return this.$store.state.tree?.metadata;
    },
    errors() { return this.$store.state.tree.errors; },
  },
  created() {
    if (this.treeData?.sessionId) return;
    this.updateSession(this.$route, 'getTreeData');
  },
  methods: {
    expandTree() {
      this.$root.$emit('expandTree');
    },
    collapseTree() {
      this.$root.$emit('collapseTree');
    },
    // added from '@/util/session.js'
    updateSession(route, type) {
      let sessionId;

      if (route.params.id) {
        sessionId = route.params.id;
      } else if (route.query.id) {
        sessionId = route.query.id;
      } else if (route.hash) {
        // eslint-disable-next-line prefer-destructuring
        sessionId = route.hash.split('#')[1];
      }
      if (sessionId && process.browser) {
        this.$store.dispatch(type, sessionId);
      }
    },
  },
  watch: {
    $route(route) {
      this.updateSession(route, 'getTreeData');
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
        > .branch {
          padding-left: 0;
        }
      }
    }
  }
</style>
