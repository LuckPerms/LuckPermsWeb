<template>
<div class="node-list flex flex-1 flex-col relative overflow-y-auto bg-white/20">
  <h2 v-html="$t('editor.nodes.permissionsCount', nodes.length)" class="text-xl m-0 mb-2 pt-2 px-4 [&_span]:ml-2.5 [&_span]:opacity-50" />

  <div class="node-list-header sticky top-0 z-10 bg-[rgb(67,67,78)] border-b border-black/20">
    <div class="sorting-tabs flex">
      <div
        :class="{ 'node-select-all': true, 'selected': allSelected }"
        class="px-4 py-2 cursor-pointer flex items-center justify-between font-bold shrink-0 [&_span]:block [&_span]:w-6 [&_span]:h-6 [&_span]:border-2 [&_span]:border-grey [&_span]:relative [&.selected_span::after]:absolute [&.selected_span::after]:block [&.selected_span::after]:w-4 [&.selected_span::after]:h-2 [&.selected_span::after]:border-4 [&.selected_span::after]:border-brand [&.selected_span::after]:border-t-0 [&.selected_span::after]:border-r-0 [&.selected_span::after]:-rotate-45 [&.selected_span::after]:content-['']"
        @click="selectAll"
        :title="$t('editor.nodes.selectAll')"
      >
        <span></span>
      </div>

      <div
        class="permission flex-[2_2_30%] px-4 py-2 cursor-pointer flex items-center justify-between font-bold hover:bg-white/20 [&.active]:bg-white/10"
        :class="{'active': sort.method === 'key'}"
        @click="changeSort('key')"
        :title="$t('editor.nodes.sort.permission')"
      >
        {{ $t('editor.permissions') }}
        <font-awesome
          v-if="sort.method === 'key'"
          class="opacity-50 transition-transform duration-300 [&.reverse]:rotate-180"
          :class="{'reverse': !sort.desc}"
          icon="chevron-circle-down"
        />
      </div>

      <div
        class="value flex-[1_1_10%] px-4 py-2 cursor-pointer flex items-center justify-between font-bold hover:bg-white/20 [&.active]:bg-white/10"
        :class="{'active': sort.method === 'value'}"
        @click="changeSort('value')"
        :title="$t('editor.nodes.sort.value')"
      >
        {{ $t('editor.value') }}
        <font-awesome
          v-if="sort.method === 'value'"
          class="opacity-50 transition-transform duration-300 [&.reverse]:rotate-180"
          :class="{'reverse': !sort.desc}"
          icon="chevron-circle-down"
        />
      </div>

      <div
        class="expiry flex-[1_1_15%] px-4 py-2 cursor-pointer flex items-center justify-between font-bold hover:bg-white/20 [&.active]:bg-white/10"
        :class="{'active': sort.method === 'expiry'}"
        @click="changeSort('expiry')"
        :title="$t('editor.nodes.sort.expiry')"
      >
        {{ $t('editor.expiry') }}
        <font-awesome
          v-if="sort.method === 'expiry'"
          class="opacity-50 transition-transform duration-300 [&.reverse]:rotate-180"
          :class="{'reverse': !sort.desc}"
          icon="chevron-circle-down" />
      </div>

      <div
        class="context flex-[1_1_20%] px-4 py-2 cursor-pointer flex items-center justify-between font-bold hover:bg-white/20 [&.active]:bg-white/10"
        :class="{'active': sort.method === 'contexts'}"
        @click="changeSort('contexts')"
        :title="$t('editor.nodes.sort.contexts')"
      >
        {{ $t('editor.contexts') }}
        <font-awesome
          v-if="sort.method === 'contexts'"
          class="opacity-50 transition-transform duration-300 [&.reverse]:rotate-180"
          :class="{'reverse': !sort.desc}"
          icon="chevron-circle-down"
        />
      </div>

      <div class="delete-column pointer-events-none w-12 shrink-0 mr-2 px-4 py-2 flex items-center justify-between font-bold"></div>
    </div>
  </div>

  <virtual-list
    :data-sources="sortedNodes"
    data-key="id"
    :data-component="Node"
    :keeps="50"
    class="node-list-scroll flex-1 overflow-y-scroll overflow-x-hidden"
    :estimate-size="42"
  />
</div>
</template>

<script>
import sortBy from 'lodash.sortby';
import VirtualList from '@/components/common/VirtualList.vue';
import Node from './Node.vue';

export default {
  name: 'NodeList',
  components: {
    VirtualList,
  },
  props: {
    nodes: Array,
  },
  data() {
    return {
      sort: {
        method: null,
        desc: true,
      },
    };
  },
  computed: {
    Node() { return Node; },
    sortedNodes() {
      let sorted;
      if (['key', 'value', 'expiry'].indexOf(this.sort.method) >= 0) {
        sorted = sortBy(this.nodes, [this.sort.method]);
      } else {
        sorted = sortBy(this.nodes, node => node.context[this.sort.method]);
      }

      if (this.sort.desc) {
        return sorted;
      }
      return sorted.reverse();
    },
    selectedNodes() {
      return this.$store.getters.selectedNodeIds;
    },
    currentSelectedNodes() {
      const map = this.nodes.map(node => node.id);

      return this.selectedNodes.filter(nodeId => map.indexOf(nodeId) !== -1);
    },
    allSelected() {
      return this.nodes.length && this.nodes.length === this.currentSelectedNodes.length;
    },
  },
  methods: {
    changeSort(method) {
      if (this.sort.method === method) {
        this.sort.desc = !this.sort.desc;
      } else {
        this.sort.desc = true;
      }

      this.sort.method = method;
    },
    selectAll() {
      if (this.allSelected) {
        this.$store.commit('deselectAllSessionNodes', this.nodes);
      } else {
        this.$store.commit('selectAllSessionNodes', this.nodes);
      }
    },
  },
};
</script>
