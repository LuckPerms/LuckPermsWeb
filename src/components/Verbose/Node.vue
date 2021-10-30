<template>
  <div class="node">
    <div class="main" @click="open = !open">
      <span class="name">
        <avatar
          v-if="source.who.uuid && source.who.uuid !== '00000000-0000-0000-0000-000000000000'"
          :id="source.who.uuid"
          :name="source.who.identifier"
          :title="false"
        />
        {{ source.who.identifier }}
      </span>
      <span class="permission">
        <code>{{ source.permission || `meta: ${source.key}` }}</code>
      </span>
      <span class="value" :class="source.result">
        <code :class="source.result">{{ source.result }}</code>
        <font-awesome :icon="valueIcon" fixed-width />
      </span>
    </div>
    <transition name="slide">
      <div class="stack" v-if="open">
        <div class="col-1">
          <table>
            <tr v-if="source.context.length">
              <td>{{ $t('verbose.context') }}</td>
              <td>
                <code v-for="context in source.context" v-bind:key="context">
                  {{ context.key }}: {{ context.value }}
                </code>
              </td>
            </tr>
            <tr>
              <td>{{ $t('verbose.origin') }}</td>
              <td>
                <code>{{ source.origin }}</code>
              </td>
            </tr>
            <tr v-if="source.resultInfo">
              <td>{{ $t('verbose.processor') }}</td>
              <td>
                <code>{{ source.resultInfo.processorClass }}</code>
              </td>
            </tr>
            <tr v-if="source.resultInfo">
              <td>{{ $t('verbose.cause') }}</td>
              <td>
                <code>{{ source.resultInfo.cause }}</code>
              </td>
            </tr>
            <tr>
              <td>{{ $t('verbose.thread') }}</td>
              <td>
                <code>{{ source.thread }}</code>
              </td>
            </tr>
          </table>
        </div>
        <div class="col-2">
          {{ $t('verbose.trace') }}
          <pre class="code">{{ source.trace.join("\n") }}</pre>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Avatar from '../Avatar.vue';

export default {
  components: {
    Avatar,
  },
  props: {
    source: Object,
  },
  data() {
    return {
      open: false,
    };
  },
  computed: {
    valueIcon() {
      switch (this.source.result) {
        case 'true':
          return 'check';
        case 'false':
          return 'times';
        default:
          return 'minus';
      }
    },
  },
};
</script>

<style lang="scss">
  .verbose-viewer {
    .node {
      margin-bottom: .25rem;

      &:focus {
        outline: 1px $brand-color solid;
      }

      .main {
        padding: .25rem 1rem;
        display: flex;
        cursor: pointer;

        &:hover {
          background: rgba(255,255,255,.1);
        }
      }

      .name {
        margin-right: 1rem;
        display: flex;
        align-items: center;
        min-width: 10rem;

        img {
          width: 1rem;
          margin-right: .5rem;
        }
      }

      .permission {
        flex: 1;
      }

      .value {
        &.true {
          color: $brand-color;
        }

        &.false {
          color: tomato;
        }

        &.undefined,
        &.null {
          color: grey;
        }

        svg {
          margin-left: 1rem;
        }

        &.null {
          svg {
            opacity: 0;
          }
        }
      }

      .stack {
        background: rgba(0,0,0,.2);
        padding: .5rem 1rem;
        display: flex;
        white-space: normal;

        .col-1 {
          flex: 1;
        }

        .col-2 {
          display: flex;
          flex-direction: column;
          flex: 2;
        }

        table {
          td:first-child {
            width: 25%;
          }
        }

        code {
          word-break: break-all;
        }

        ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
      }
    }
  }
</style>
