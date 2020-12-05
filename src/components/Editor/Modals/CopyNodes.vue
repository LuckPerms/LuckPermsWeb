<template>
  <div class="copy-nodes-modal">
    <h2>Copy {{ selectedNodes.length }} node{{ selectedNodes.length === 1 ? '' : 's' }} to...</h2>
    <div class="col-2">
      <ul>
        <li
          v-for="session in sessions"
          :key="`copyNodeSession_${session.id}`"
          :class="{ selected: selectedSessions.includes(session.id) }"
          @click="toggleSession(session.id)"
        >
          <span class="checkbox"></span>
          {{ session.displayName }}
        </li>
      </ul>
      <div>
        <button :disabled="!selectedSessions.length" @click="copyNodes">
          <font-awesome icon="clone" />
          Copy
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedSessions: [],
    };
  },
  props: {
    props: Array,
  },
  computed: {
    selectedNodes() {
      return this.$store.getters.selectedNodeIds;
    },
    sessions() {
      return this.$store.getters.sessionSet;
    },
  },
  methods: {
    toggleSession(session) {
      if (this.selectedSessions.includes(session)) {
        this.selectedSessions.splice(this.selectedSessions.findIndex(s => s === session), 1);
      } else {
        this.selectedSessions.push(session);
      }
    },
    copyNodes() {
      this.$store.dispatch('copyNodes', this.selectedSessions);
    },
  },
};
</script>

<style lang="scss">
  .copy-nodes-modal {
    .col-2 {
      display: flex;

      > div {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: 2rem;

        button {
          font-size: 1.5rem;
          padding: 1rem 2rem;

          &[disabled] {
            opacity: .5;
            cursor: not-allowed;
          }
        }
      }
    }

    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      max-height: 14rem;
      overflow-y: auto;
      flex: 2;

      li {
        background: rgba(0,0,0,.25);
        padding: .5rem 1rem;
        margin-bottom: .2rem;
        display: flex;
        align-items: center;
        cursor: pointer;

        &:hover {
          background: rgba(0,0,0,.2);
        }

        .checkbox {
          width: 1.5rem;
          height: 1.5rem;
          border: 2px solid rgba(0,0,0,.33);
          display: block;
          margin-right: 1rem;
          position: relative;
        }
      }
    }

    .selected {
      color: $brand-color;

      .checkbox {
        &:after {
          content: '';
          display: block;
          position: absolute;
          border: 4px solid $brand-color;
          border-right: 0;
          border-top: 0;
          width: 1rem;
          height: .5rem;
          transform: rotate(-45deg);
        }
      }
    }
  }
</style>
