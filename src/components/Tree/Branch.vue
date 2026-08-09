<template>
  <div class="branch pl-8" :class="node ? '' : 'no-node pl-0 [&>.branch]:pl-0'">
    <div class="node flex justify-between bg-grey rounded-sm mb-0.5 cursor-pointer hover:brightness-110 [&_code]:bg-transparent" @click="open = !open" v-if="node">
      <div>
        <button class="bg-transparent text-white border-0 px-3 cursor-pointer ml-0.5" v-if="hasChildren && node">
          <font-awesome icon="caret-right" :rotation="open ? 90 : null" />
        </button>
        <code>{{ node }}</code>
      </div>
      <code v-if="result" :class="result">
        {{ result }}
      </code>
    </div>
    <template v-if="open && hasChildren">
      <branch
        v-for="(branch, node) in branchData"
        :node="node"
        :branch-data="branch"
        :key="node"
      />
    </template>
  </div>
</template>

<script>
import Branch from './Branch.vue';
import eventBus from '@/util/eventBus';

export default {
  name: 'branch',
  components: {
    Branch,
  },
  props: {
    node: String,
    branchData: Object,
  },
  data() {
    return {
      open: true,
    };
  },
  computed: {
    hasChildren() {
      return Object.keys(this.branchData).length;
    },
    checkResults() {
      return this.$store.getters.tree.data?.checkResults;
    },
    result() {
      if (!this.checkResults) return null;

      if (Object.keys(this.checkResults).includes(this.node)) {
        return this.checkResults[this.node];
      }

      return null;
    },
  },
  created() {
    this.collapseHandler = () => {
      if (this.node) this.open = false;
    };
    this.expandHandler = () => {
      this.open = true;
    };

    eventBus.on('collapseTree', this.collapseHandler);
    eventBus.on('expandTree', this.expandHandler);
  },
  beforeUnmount() {
    eventBus.off('collapseTree', this.collapseHandler);
    eventBus.off('expandTree', this.expandHandler);
  },
};
</script>
