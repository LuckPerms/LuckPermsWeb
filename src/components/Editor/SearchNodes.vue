<template>
  <div class="search-results">
    <ul v-if="groupedResults.length">
      <li v-for="group in groupedResults" :key="`search_session_${group.session.id}`">
        <h2
          @click="setCurrentSession(group.session.id)"
        >
          <small>{{ group.session.type }}</small>
          <avatar
            v-if="group.session.type === 'user'"
            :id="group.session.id"
            :name="group.session.displayName"
          />
          {{ group.session.displayName }}
        </h2>
        <ul>
          <li v-for="node in group.nodes" :key="node.id">
            <node :source="node" />
          </li>
        </ul>
      </li>
    </ul>
    <div v-else class="no-results">
      No results found
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
  },
  methods: {
    setCurrentSession(session) {
      this.$store.commit('setCurrentSession', session);
      this.$emit('clear-query');
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

  h2 {
    padding: .75rem 1rem;
    line-height: 1;
    margin: 0;
    background: rgba(255,255,255,.1);
    text-transform: uppercase;
    cursor: pointer;

    small {
      display: inline-block;
      opacity: .5;
      padding-right: 1rem;
      font-weight: normal;
      text-transform: capitalize;
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
