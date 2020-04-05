<template>
  <div class="node">
    <div class="main" @click="open = !open">
      <span class="name">
        <avatar
          v-if="node.who.identifier !== 'internal/console'"
          :id="node.who.identifier"
          :name="node.who.identifier"
          :size="16"
        />
        {{ node.who.identifier }}
      </span>
      <span class="permission">
        <code>{{ node.permission || `meta: ${node.key}` }}</code>
      </span>
      <span class="value" :class="node.result">
        <code :class="node.result">{{ node.result }}</code>
        <font-awesome :icon="valueIcon" fixed-width />
      </span>
    </div>
    <transition name="slide">
      <div class="data" v-if="open">
        <div class="col-1">
          <table>
            <tr v-if="node.context.length">
              <td>Context</td>
              <td>
                <code v-for="context in node.context">{{ context.key }}: {{ context.value }}</code>
              </td>
            </tr>
            <tr>
              <td>Origin</td>
              <td>
                <code>{{ node.origin }}</code>
              </td>
            </tr>
            <tr v-if="node.resultInfo">
              <td>Processor</td>
              <td>
                <code>{{ node.resultInfo.processorClass }}</code>
              </td>
            </tr>
            <tr v-if="node.resultInfo">
              <td>Cause</td>
              <td>
                <code>{{ node.resultInfo.cause }}</code>
              </td>
            </tr>
            <tr>
              <td>Thread</td>
              <td>
                <code>{{ node.thread }}</code>
              </td>
            </tr>
          </table>
        </div>
        <div class="col-2">
          Trace
          <ul>
            <li v-for="trace in node.trace">
              <code>{{ trace }}</code>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import Avatar from '../Avatar';

  export default {
    components: {
      Avatar
    },
    props: {
      node: Object,
    },
    data() {
      return {
        open: false
      }
    },
    computed: {
      valueIcon() {
        switch (this.node.result) {
          case 'true':
            return 'check';
          case 'false':
            return 'times';
          default:
            return 'minus';
        }
      }
    }
  }
</script>

<style lang="scss">
  .verbose-viewer {
    .node {
      margin: .25rem 0;

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

        img {
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

      .data {
        background: rgba(0,0,0,.2);
        padding: .5rem 1rem;
        display: flex;
        white-space: normal;

        .col-1 {
          flex: 1;
        }

        .col-2 {
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
