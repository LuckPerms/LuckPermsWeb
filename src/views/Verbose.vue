<template>
  <main class="verbose container">
    <div class="verbose-viewer" v-if="verboseData.status === 2">
      <div class="col-1">
        <h1>{{ $t('verbose.title') }}</h1>
        <div class="meta-info">
          <table>
            <tr>
              <td>{{ $t('verbose.uploaded') }}</td>
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
              <td :title="$t('verbose.started')">
                {{ $t('verbose.start') }}
              </td>
              <td>{{ verboseData.metadata.startTime }}</td>
            </tr>
            <tr>
              <td :title="$t('verbose.ended')">
                {{ $t('verbose.end') }}
              </td>
              <td>{{ verboseData.metadata.endTime }}</td>
            </tr>
            <tr>
              <td :title="$t('verbose.recording')">
                {{ $t('verbose.duration') }}
              </td>
              <td>{{ verboseData.metadata.duration }}</td>
            </tr>
            <tr>
              <td :title="$t('verbose.values')">
                {{ $t('verbose.count') }}
              </td>
              <td>
                {{ verboseData.metadata.count.matched }} / {{ verboseData.metadata.count.total }}
              </td>
            </tr>
            <tr>
              <td :title="$t('verbose.filterDesc')">
                {{ $t('verbose.filter') }}
              </td>
              <td>
                <code>{{ verboseData.metadata.filter }}</code>
              </td>
            </tr>
            <tr>
              <td :title="$t('verbose.truncatedDesc')">
                {{ $t('verbose.truncated') }}
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
          <label for="filter">{{ $t('verbose.filter') }}</label>
          <input type="text" id="filter" v-model="filter" :placeholder="$t('verbose.filterPlaceholder')">
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
          <p>{{ $t('verbose.title') }}</p>
          <div v-if="verboseData.status === 3" class="error">
            <p>
              <strong>{{ $t('editor.error.new') }}</strong>
              {{ $t('editor.error.info') }}
            </p>
            <i18n path="editor.error.new" tag="p">
              <template #path>
                <code>/lp editor</code>
              </template>
            </i18n>
          </div>
          <template v-if="verboseData.status === 1">
            <p>
              <font-awesome icon="asterisk" :spin="true" />
              {{ $t('editor.loading') }}
            </p>
          </template>
          <template v-if="verboseData.status === 0">
            <router-link to="/verbose/demo">
              <button class="button demo-button">
                {{ $t('tools.demo') }}
              </button>
            </router-link>
            <p>{{ $t('verbose.home.generate') }}</p>
            <ul>
              <li><code>/lp verbose record [{{ $t('verbose.home.filter') }}]</code></li>
              <li>{{ $t('verbose.home.performActions') }}</li>
              <li><code>/lp verbose paste</code></li>
              <li>{{ $t('verbose.home.url') }}</li>
            </ul>
          </template>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import VirtualList from 'vue-virtual-scroll-list';
import Node from '../components/Verbose/Node.vue';
import Avatar from '../components/Avatar.vue';
import updateSession from '@/util/session';

export default {
  metaInfo: {
    title: 'Verbose',
  },
  components: {
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
