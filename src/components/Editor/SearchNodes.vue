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
import Node from '@/components/Editor/Node';
import Avatar from '@/components/Avatar';
import debounce from 'lodash.debounce';

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
    }
  },
  data() {
    return {
      debouncedQuery: this.query,
    };
  },
  computed: {
    results() {
      const { allNodes } = this.$store.getters;

      return allNodes.filter(node => {
        const query = this.debouncedQuery;

        const key = String(node.key).toLowerCase().includes(query);

        let contextKey = false;
        let contextValue = false;
        const contextKeys = Object.keys(node.context);
        if (contextKeys.length) {
          const lowerCaseKeys = contextKeys.map(key => String(key).toLowerCase());
          contextKey = lowerCaseKeys.includes(query);
          contextValue = contextKeys.some(key => node.context[key].some(value => String(value).toLowerCase().includes(query)));
        }
        return (key || contextKey || contextValue);
      });
    },
    groupedResults() {
      const { results } = this;
      const { sessionSet } = this.$store.getters;
      const filteredSessionSet = new Set;

      results.forEach(({ sessionId }) => {
        filteredSessionSet.add(sessionId);
      });

      const sessionArray = Array.from(filteredSessionSet);

      return sessionArray.map(sessionId => ({
        session: sessionSet.find(({ id }) => sessionId === id),
        nodes: results.filter(node => node.sessionId === sessionId),
      }));
    }
  },
  methods: {
    setCurrentSession(session) {
      console.log('hi');
      this.$store.commit('setCurrentSession', session);
      this.$emit('clear-query');
    },
  },
  watch: {
    query: debounce(function(value) {
      this.debouncedQuery = String(value).toLowerCase();
    }, 200),
  }
}
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
