<template>
  <div class="search-results flex flex-1 flex-col w-full overflow-y-scroll p-4">
    <div class="select-all mb-4">
      <div
        :class="{ 'node-select-all': true, 'selected': allResultsSelected }"
        class="mr-4 shrink-0 flex items-center text-xl cursor-pointer [&_span]:block [&_span]:w-6 [&_span]:h-6 [&_span]:border-2 [&_span]:border-white/50 [&_span]:relative [&.selected_span::after]:absolute [&.selected_span::after]:block [&.selected_span::after]:w-4 [&.selected_span::after]:h-2 [&.selected_span::after]:border-4 [&.selected_span::after]:border-brand [&.selected_span::after]:border-t-0 [&.selected_span::after]:border-r-0 [&.selected_span::after]:-rotate-45 [&.selected_span::after]:content-['']"
        @click="selectAllResults()"
        :title="$t('editor.nodes.selectAll')"
      >
        <span></span>
        Select all
      </div>
    </div>
    <ul v-if="groupedResults.length" class="list-none p-0 m-0">
      <li v-for="group in groupedResults" :key="`search_session_${group.session.id}`">
        <h2 class="flex items-center px-4 py-3 leading-none m-0 bg-white/10">
          <div
            :class="{ 'node-select-all': true, 'selected': allGroupSelected(group) }"
            class="mr-4 shrink-0 [&_span]:block [&_span]:w-6 [&_span]:h-6 [&_span]:border-2 [&_span]:border-white/50 [&_span]:relative [&.selected_span::after]:absolute [&.selected_span::after]:block [&.selected_span::after]:w-4 [&.selected_span::after]:h-2 [&.selected_span::after]:border-4 [&.selected_span::after]:border-brand [&.selected_span::after]:border-t-0 [&.selected_span::after]:border-r-0 [&.selected_span::after]:-rotate-45 [&.selected_span::after]:content-['']"
            @click="selectAllGroup(group)"
            :title="$t('editor.nodes.selectAll')"
          >
            <span></span>
          </div>
          <small class="inline-block opacity-50 pr-4 font-normal capitalize">{{ group.session.type }}</small>
          <avatar
            v-if="group.session.type === 'user'"
            class="h-4 mr-2"
            :id="group.session.id"
            :name="group.session.displayName"
          />
          <span class="cursor-pointer flex items-center [&_span]:opacity-50 [&_span]:text-base [&_span]:ml-2" @click="setCurrentSession(group.session.id)">
            {{ group.session.displayName }}
            <span>({{ group.session.id }})</span>
          </span>
        </h2>
        <ul class="list-none p-0 m-0 mb-4 bg-white/20">
          <li v-for="node in group.nodes" :key="`search_node_${node.id}`">
            <node :source="node" />
          </li>
        </ul>
      </li>
    </ul>
    <div v-else class="no-results text-center p-16 text-[2.5rem] opacity-50">
      {{ $t('editor.noResults') }}
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import Node from '@/components/Editor/Node.vue';
import Avatar from '@/components/Avatar.vue';

export default {
  name: 'SearchNodes',
  components: {
    Node,
    Avatar,
  },
  props: {
    query: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      debouncedQuery: this.query,
    };
  },
  computed: {
    results() {
      const { allNodes } = this.$store.getters;

      return allNodes.filter((node) => {
        const query = this.debouncedQuery;

        const keyMatch = String(node.key).toLowerCase().includes(query);
        if (keyMatch) {
          return true;
        }

        const contextKeys = Object.keys(node.context);
        if (!contextKeys.length) {
          return false;
        }

        const lowerCaseKeys = contextKeys.map(k => String(k).toLowerCase());
        const contextKey = lowerCaseKeys.includes(query);
        const contextValue = contextKeys.some((key) => {
          if (typeof node.context[key] === 'string') {
            return String(node.context[key]).toLowerCase().includes(query);
          } if (Array.isArray(node.context[key])) {
            return node.context[key].some(value => String(value).toLowerCase().includes(query));
          }
          return false;
        });
        return (contextKey || contextValue);
      });
    },
    groupedResults() {
      const { results } = this;
      const { sessionSet } = this.$store.getters;
      const filteredSessionSet = new Set();

      results.forEach(({ sessionId }) => {
        filteredSessionSet.add(sessionId);
      });

      const sessionArray = Array.from(filteredSessionSet);

      return sessionArray.map(sessionId => ({
        session: sessionSet.find(({ id }) => sessionId === id),
        nodes: results.filter(node => node.sessionId === sessionId),
      }));
    },
    allSelectedNodes() {
      return this.$store.getters.selectedNodeIds;
    },
    allResultsSelected() {
      const map = this.results.map(node => node.id);
      const selectedNodes = this.allSelectedNodes.filter(nodeId => map.includes(nodeId));

      return selectedNodes.length === this.results.length;
    },
    allGroupSelected() {
      return (group) => {
        const map = group.nodes.map(node => node.id);
        const selectedNodes = this.allSelectedNodes.filter(nodeId => map.includes(nodeId));

        return selectedNodes.length === group.nodes.length;
      };
    },
  },
  methods: {
    setCurrentSession(session) {
      this.$store.commit('setCurrentSession', session);
      this.$emit('clear-query');
    },
    selectAllResults() {
      if (this.allResultsSelected) {
        this.$store.commit('deselectAllSessionNodes', this.results);
      } else {
        this.$store.commit('selectAllSessionNodes', this.results);
      }
    },
    selectAllGroup(group) {
      if (this.allGroupSelected(group)) {
        this.$store.commit('deselectAllSessionNodes', group.nodes);
      } else {
        this.$store.commit('selectAllSessionNodes', group.nodes);
      }
    },
  },
  watch: {
    // eslint-disable-next-line func-names
    query: debounce(function (value) {
      this.debouncedQuery = String(value).toLowerCase();
    }, 200),
  },
};
</script>
