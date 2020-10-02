<template>
  <div class="search-results">
    <ul>
      <li v-for="group in groupedResults" :key="`search_session_${group.session.id}`">
        <h2>
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
  </div>
</template>

<script>
import Node from '@/components/Editor/Node';
import Avatar from '@/components/Avatar';

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
  computed: {
    results() {
      const { allNodes } = this.$store.getters;

      return allNodes.filter(({ key }) => key.includes(this.query));
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
}
</style>
