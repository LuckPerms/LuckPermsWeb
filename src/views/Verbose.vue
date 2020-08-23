<template>
  <main class="verbose container">
    <div class="verbose-viewer" v-if="verboseData.status === 2">
      <div class="col-1">
        <h1>Verbose viewer</h1>
        <div class="meta-info">
          <table>
            <tr>
              <td>Uploaded by</td>
              <td>
                <avatar
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
    <div v-else class="tool-intro">
      <div>
        <img alt="LuckPerms logo" src="../assets/logo.png">
        <div class="text">
          <h1>LuckPerms</h1>
          <p>Verbose Viewer</p>
          <div v-if="verboseData.status === 3" class="error">
            <p><strong>There was an error loading the data.</strong> Either the URL was copied wrong
              or the session has expired.</p>
            <p>Please generate another editor session with <code>/lp editor</code>.</p>
          </div>
          <template v-if="verboseData.status === 1">
            <p>
              <font-awesome icon="asterisk" :spin="true" />
              Loading data...
            </p>
          </template>
          <template v-if="verboseData.status === 0">
            <router-link to="/verbose/demo">
              <button class="button demo-button">View Demo</button>
            </router-link>
            <p>To generate a verbose report, do the following in game or from the console:</p>
            <ul>
              <li><code>/lp verbose record [filter]</code></li>
              <li>Perform a series of actions that require permissions</li>
              <li><code>/lp verbose paste</code></li>
              <li>Follow the URL that is generated</li>
            </ul>
          </template>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Node from '../components/Verbose/Node.vue';
import Avatar from '../components/Avatar.vue';
import updateSession from '@/util/session';
import VirtualList from 'vue-virtual-scroll-list';

export default {
  metaInfo: {
    title: 'Verbose',
  },
  components: {
    Node,
    Avatar,
    VirtualList,
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

    updateSession(this.$route, 'getVerboseData');
  },
  watch: {
    $route(route) {
      updateSession(route, 'getVerboseData');
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
