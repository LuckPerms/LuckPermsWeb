<template>
  <div class="search-results">
    <div class="select-all">
      <div
        :class="{ 'node-select-all': true, 'selected': allResultsSelected }"
        @click="selectAllResults()"
        :title="$t('editor.nodes.selectAll')"
      >
        <span></span>
        Select all
      </div>
    </div>
    <ul v-if="groupedResults.length">
      <li v-for="group in groupedResults" :key="`search_session_${group.session.id}`">
        <h2>
          <div
            :class="{ 'node-select-all': true, 'selected': allGroupSelected(group) }"
            @click="selectAllGroup(group)"
            :title="$t('editor.nodes.selectAll')"
          >
            <span></span>
          </div>
          <small>{{ group.session.type }}</small>
          <avatar
            v-if="group.session.type === 'user'"
            :id="group.session.id"
            :name="group.session.displayName"
          />
          <span @click="setCurrentSession(group.session.id)">
            {{ group.session.displayName }}
            <span>({{ group.session.id }})</span>
          </span>
        </h2>
        <ul>
          <li v-for="node in group.nodes" :key="`search_node_${node.id}`">
            <node :source="node" />
          </li>
        </ul>
      </li>
    </ul>
    <div v-else class="no-results">
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

<style lang="scss">
.search-results {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  width: 100%;
  flex: 1;

  .node-select-all {
    margin-right: 1rem;
    flex: 0 0 auto;

    span {
      display: block;
      width: 1.5rem;
      height: 1.5rem;
      border: 2px solid rgba(255,255,255,.5);
      position: relative;
    }

    &.selected {
      span {
        &:after {
          position: absolute;
          display: block;
          content: '';
          width: 1rem;
          height: .5rem;
          border: 4px solid $brand-color;
          border-top: 0;
          border-right: 0;
          transform: rotate(-45deg);
        }
      }
    }
  }

  .select-all {
    margin-bottom: 1rem;

    .node-select-all {
      display: flex;
      align-items: center;
      font-size: 1.25rem;
      cursor: pointer;

      span {
        margin-right: 1rem;
      }
    }
  }

  h2 {
    display: flex;
    align-items: center;
    padding: .75rem 1rem;
    line-height: 1;
    margin: 0;
    background: rgba(255,255,255,.1);

    small {
      display: inline-block;
      opacity: .5;
      padding-right: 1rem;
      font-weight: normal;
      text-transform: capitalize;
    }

    > span {
      cursor: pointer;
      display: flex;
      align-items: center;

      > span {
        opacity: .5;
        font-size: 1rem;
        margin-left: .5rem;
      }
    }

    img {
      height: 1rem;
      margin-right: .5rem;
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    ul {
      background-color: rgba(255,255,255,.2);
      margin: 0 0 1rem;
    }
  }

  .no-results {
    text-align: center;
    padding: 4rem;
    font-size: 2.5rem;
    opacity: .5;
  }
}
</style>
