<template>
  <main class="verbose container flex overflow-y-hidden">
    <div class="verbose-viewer flex w-full h-full max-h-full" v-if="verboseData.status === 2">
      <div class="col-1 basis-[30%] bg-transparent p-4">
        <h1 class="m-0 p-4 leading-none bg-white/5 rounded-t">{{ $t('verbose.title') }}</h1>
        <div class="meta-info bg-grey p-4 rounded-b">
          <table class="[&_td:first-child]:w-[40%]">
            <tr>
              <td>{{ $t('verbose.uploaded') }}</td>
              <td>
                <avatar
                  v-if="verboseData.metadata.uploader.uuid !==
                    '00000000-0000-0000-0000-000000000000'"
                  :id="verboseData.metadata.uploader.uuid"
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
                {{ filteredNodeCount }} / {{ verboseData.metadata.count.total }}
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
        <div class="filter mt-4">
          <label for="filter">{{ $t('verbose.filter') }}</label>
          <input
            type="text"
            id="filter"
            v-model="filter"
            :placeholder="$t('verbose.filterPlaceholder')"
            class="font-inherit w-full bg-white/5 text-white px-4 py-2 border-0 mt-2"
          >
          <div
            v-for="value in ['true', 'false', 'undefined']" :key="value"
            :class="['exclude-result pt-4 shrink-0 cursor-pointer', { selected: isExcluded(value) }]"
            @click="excludeResult(value)"
          >
            <span class="inline-block w-6 h-6 border-2 border-grey relative [&_after]:absolute [&_after]:block [&_after]:content-[''] [&_after]:w-4 [&_after]:h-2 [&_after]:border-4 [&_after]:border-brand [&_after]:border-t-0 [&_after]:border-r-0 [&_after]:-rotate-45 [&_after]:left-1 [&_after]:top-1"></span>
            <p class="inline relative top-[7px] pl-2 m-0">
              {{ $t('verbose.exclude') }} <code :class="value">{{ value }}</code>
            </p>
          </div>
        </div>
      </div>
      <div class="col-2 basis-[70%] flex flex-col p-4 pl-0 overflow-hidden">
        <virtual-list
          :data-sources="filteredNodes"
          data-key="id"
          :data-component="Node"
          :keeps="50"
          class="data flex-1 overflow-x-hidden overflow-y-auto list-none m-0 p-0 pr-4 [&_[role=listitem]]:bg-grey [&_[role=listitem]]:rounded"
          :estimate-size="38"
        />
      </div>
    </div>
    <div v-else class="tool-intro">
      <div>
        <img alt="LuckPerms logo" src="../assets/logo.svg">
        <div class="text">
          <h1>LuckPerms</h1>
          <p>{{ $t('verbose.title') }}</p>
          <div v-if="verboseData.status === 3" class="error">
            <template v-if="errors.load">
              <h3>{{ $t('editor.error.title') }}</h3>
              <p>{{ $t('editor.error.info') }}</p>
              <i18n-t keypath="editor.error.new" tag="p">
                <template #command>
                  <code>/lp editor</code>
                </template>
              </i18n-t>
            </template>

            <template v-if="errors.unsupported">
              <h3>{{ $t('editor.unsupported.title') }}</h3>
              <i18n-t keypath="editor.unsupported.info" tag="p">
                <template #download>
                  <router-link to="/download">
                    {{ $t('editor.unsupported.download') }}
                  </router-link>
                </template>
              </i18n-t>
            </template>
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
import { useHead } from '@unhead/vue';

import VirtualList from '@/components/common/VirtualList.vue';
import Node from '../components/Verbose/Node.vue';
import Avatar from '../components/Avatar.vue';
import updateSession from '@/util/session';

export default {
  setup() {
    useHead({
      title: 'Verbose',
    });
  },
  components: {
    Avatar,
    VirtualList,
  },
  data() {
    return {
      filter: '',
      excludedResults: [],
    };
  },
  computed: {
    Node() { return Node; },
    verboseData() { return this.$store.getters.verbose; },
    filteredNodes() {
      const { data } = this.verboseData;
      if (!this.filter && this.excludedResults.length === 0) return data;
      const filter = this.filter.toLowerCase();
      return data.filter(node => (
        !this.excludedResults.includes(node.result)
        && (node.permission?.toLowerCase().includes(filter)
        || node.key?.toLowerCase().includes(filter)
        || node.who?.identifier.toLowerCase().includes(filter))
      ));
    },
    errors() { return this.$store.state.verbose.errors; },
    filteredNodeCount() { return this.filteredNodes.length; },
  },
  methods: {
    isExcluded(result) {
      return this.excludedResults.includes(result);
    },
    excludeResult(result) {
      if (this.isExcluded(result)) {
        this.excludedResults = this.excludedResults.filter(r => r !== result);
      } else {
        this.excludedResults.push(result);
      }
    },
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
