<template>
  <main class="tree container flex overflow-y-hidden">
    <div class="tree-viewer flex w-full h-full max-h-full" v-if="metaData">
      <div class="col-1 basis-[30%] bg-transparent p-4">
        <h1 class="m-0 p-4 leading-none bg-white/5 rounded-t">{{ $t('tree.title') }}</h1>
        <div class="meta-info bg-grey p-4 rounded-b">
          <table>
            <tr>
              <td>{{ $t('tree.uploaded') }}</td>
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
              <td :title="$t('tree.started')">
                {{ $t('tree.time') }}
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
              <td :title="$t('tree.user')">
                {{ $t('tree.user') }}
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
        <button class="bg-black/20 font-inherit text-brand px-4 py-2 border-0 mt-4 mr-4 cursor-pointer [&_svg]:opacity-50 [&_svg]:mr-2 [&_svg]:text-white" @click="expandTree">
          <font-awesome icon="plus-square" />
          {{ $t('tree.expand') }}
        </button>
        <button class="bg-black/20 font-inherit text-brand px-4 py-2 border-0 mt-4 mr-4 cursor-pointer [&_svg]:opacity-50 [&_svg]:mr-2 [&_svg]:text-white" @click="collapseTree">
          <font-awesome icon="minus-square" />
          {{ $t('tree.collapse') }}
        </button>
      </div>
      <div class="col-2 basis-[70%] flex p-4 pl-0">
        <div class="w-full overflow-auto pr-4">
          <branch
            v-for="(branch, node) in treeData"
            :branch-data="branch"
            :node="node"
            :key="node"
            class="pl-0"
          />
        </div>
      </div>
    </div>
    <div v-else class="tool-intro">
      <div>
        <img alt="LuckPerms logo" src="../assets/logo.svg">
        <div class="text">
          <h1>LuckPerms</h1>
          <p>{{ $t('tree.title') }}</p>
          <template v-if="!errors.load && !errors.unsupported">
            <router-link to="/treeview/demo">
              <button class="button demo-button">
                {{ $t('tools.demo') }}
              </button>
            </router-link>
            <p>{{ $t('tree.home.generate') }}</p>
            <ul>
              <li>
                <code>/lp tree [{{ $t('tree.home.scope') }}] [{{ $t('tree.home.player') }}]</code>
              </li>
              <li>{{ $t('tree.home.url') }}</li>
            </ul>
          </template>
          <div v-else class="error">
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
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { useHead } from '@unhead/vue';

import Avatar from '../components/Avatar.vue';
import Branch from '../components/Tree/Branch.vue';
import eventBus from '@/util/eventBus';
import updateSession from '@/util/session';

export default {
  setup() {
    useHead({
      title: 'Tree',
    });
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
      eventBus.emit('expandTree');
    },
    collapseTree() {
      eventBus.emit('collapseTree');
    },
  },
  watch: {
    $route(route) {
      updateSession(route, 'getTreeData');
    },
  },
};
</script>
