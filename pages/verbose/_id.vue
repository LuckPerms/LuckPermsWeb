<template>
  <main class="verbose container">
    <client-only>
      <div class="verbose-viewer" v-if="verboseData.status === 2">
        <div class="col-1">
          <h1>Verbose viewer</h1>
          <div class="meta-info">
            <table>
              <tr>
                <td>Uploaded by</td>
                <td>
                  <Avatar
                    v-if="verboseData.metadata.uploader.name !== 'Console'"
                    :id="verboseData.metadata.uploader.uuid"
                    :name="verboseData.metadata.uploader.name"
                    :size="16"
                    :title="false"
                  />
                  {{ verboseData.metadata.uploader.name }}
                </td>
              </tr>
              <tr>
                <td title="When the recording started">
                  Start time
                </td>
                <td>{{ verboseData.metadata.startTime }}</td>
              </tr>
              <tr>
                <td title="When the recording ended">
                  End time
                </td>
                <td>{{ verboseData.metadata.endTime }}</td>
              </tr>
              <tr>
                <td title="How long the plugin was recording for">
                  Duration
                </td>
                <td>{{ verboseData.metadata.duration }}</td>
              </tr>
              <tr>
                <td title="How many values matched and how many checks were made in total">
                  Count
                </td>
                <td>
                  {{ verboseData.metadata.count.matched }} / {{ verboseData.metadata.count.total }}
                </td>
              </tr>
              <tr>
                <td title="The string used to filter the output">
                  Filter
                </td>
                <td>
                  <code>{{ verboseData.metadata.filter }}</code>
                </td>
              </tr>
              <tr>
                <td title="If the data was truncated (limited in size) when uploaded">
                  Truncated
                </td>
                <td>
                  <code :class="verboseData.metadata.truncated ? 'true' : 'false'">
                    {{ verboseData.metadata.truncated }}
                  </code>
                </td>
              </tr>
            </table>
          </div>
          <div class="filter">
            Filter nodes by username or permission:
            <input type="text" v-model="filter" placeholder="Enter filter here">
          </div>
        </div>
        <div class="col-2">
          <virtual-list
            :data-sources="filteredNodes"
            data-key="id"
            :data-component="Node"
            :keeps="50"
            class="data"
            :estimate-size="38"
          />
        </div>
      </div>
      <ToolIntro v-else type="treeview" :error="errors.load" loading="true" />
    </client-only>
  </main>
</template>

<script>
import VirtualList from 'vue-virtual-scroll-list';
import Node from '@/components/Verbose/Node.vue';
import Avatar from '@/components/Avatar.vue';
import ToolIntro from '@/components/ToolIntro.vue';

export default {
  head: {
    title: 'Verbose',
    meta: [
      { hid: 'description', name: 'description', content: 'Find out what permissions have been checked.' },
      { hid: 'twitter:description', name: 'twitter:description', content: 'Find out what permissions have been checked.' },
      { hid: 'og:description', name: 'og:description', content: 'Find out what permissions have been checked.' },
    ],
  },
  components: {
    Avatar,
    'virtual-list': VirtualList,
    ToolIntro,
  },
  data() {
    return {
      filter: '',
    };
  },
  computed: {
    Node() { return Node; },
    verboseData() { return this.$store.getters.verbose; },
    filteredNodes() {
      const { data } = this.verboseData;
      console.log(data);
      if (!this.filter) return data;
      return data.filter(node => (node.permission?.includes(this.filter)
        || node.key?.includes(this.filter)
        || node.who?.identifier.includes(this.filter)));
    },
    errors() { return this.$store.state.verbose.errors; },
    filteredNodeCount() { return this.filteredNodes.length; },
  },
  created() {
    if (this.verboseData?.sessionId) return;

    this.updateSession(this.$route, 'getVerboseData');
  },
  methods: {
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
      this.updateSession(route, 'getVerboseData');
    },
  },
};
</script>

<style lang="scss">
  main.verbose {
    display: flex;
    overflow-y: hidden;
  }

  .verbose-viewer {
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

      .filter {
        margin-top: 1rem;

        input {
          font: inherit;
          width: 100%;
          background: rgba(255, 255, 255, .05);
          color: #FFF;
          padding: .5rem 1rem;
          border: 0;
          margin-top: .5rem;
        }
      }
    }

    > .col-2 {
      flex: 0 0 70%;
      display: flex;
      flex-direction: column;
      padding: 1rem 1rem 1rem 0;

      .data {
        flex: 1;
        overflow: auto;
        list-style: none;
        margin: 0;
        padding: 0 1rem 0 0;

        [role="listitem"] {
          background: $grey;
          border-radius: 2px;
        }
      }
    }
  }
</style>
