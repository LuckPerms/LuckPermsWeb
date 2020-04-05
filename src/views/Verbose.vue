<template>
  <main class="verbose">
    <div class="verbose-viewer" v-if="!!verboseData.metadata">
      <div class="col-1">
        <h1>Verbose viewer</h1>
        <div class="meta-info">
          <table>
            <tr>
              <td>Uploaded by</td>
              <td>
                <avatar
                  v-if="verboseData.metadata.uploader.name !== 'Console'"
                  :id="verboseData.metadata.uploader.uuid"
                  :name="verboseData.metadata.uploader.name"
                  :size="16"
                />
                {{ verboseData.metadata.uploader.name }}
              </td>
            </tr>
            <tr>
              <td title="When the recording started">
                Start time
              </td>
              <td>{{ verboseData.metadata.startTime }}</td>
            </tr>
            <tr>
              <td title="When the recording ended">
                End time
              </td>
              <td>{{ verboseData.metadata.endTime }}</td>
            </tr>
            <tr>
              <td title="How long the plugin was recording for">
                Duration
              </td>
              <td>{{ verboseData.metadata.duration }}</td>
            </tr>
            <tr>
              <td title="How many values matched and how many checks were made in total">
                Count
              </td>
              <td>
                {{ verboseData.metadata.count.matched }} / {{ verboseData.metadata.count.total }}
              </td>
            </tr>
            <tr>
              <td title="The string used to filter the output">
                Filter
              </td>
              <td>
                <code>{{ verboseData.metadata.filter }}</code>
              </td>
            </tr>
            <tr>
              <td title="If the data was truncated (limited in size) when uploaded">
                Truncated
              </td>
              <td>
                <code :class="verboseData.metadata.truncated ? 'true' : 'false'">
                  {{ verboseData.metadata.truncated }}
                </code>
              </td>
            </tr>
          </table>
        </div>
        <div class="filter">
          Filter nodes by username or permission:
          <input type="text" v-model="filter" placeholder="Enter filter here">
        </div>
      </div>
      <div class="col-2">
        <ul class="data">
          <li v-for="node in filteredNodes">
            <Node :node="node" />
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>

<script>
  import Node from '../components/Verbose/Node';
  import Avatar from '../components/Avatar';

  export default {
    components: {
      Node,
      Avatar
    },
    data() {
      return {
        filter: ''
      }
    },
    computed: {
      verboseData() { return this.$store.getters.verbose },
      filteredNodes() {
        const data = this.verboseData.data;
        if (!this.filter) return data;
        return data.filter(node => {

          return node.permission?.includes(this.filter)
            || node.key?.includes(this.filter)
            || node.who.identifier.includes(this.filter);
        });
      }
    },
    created() {
      if (!this.verboseData.sessionId) {
        let sessionId;

        if (this.$route.params.id) {
          sessionId = this.$route.params.id;
        }
        if (this.$route.query.id) {
          sessionId = this.$route.query.id;
        }
        if (sessionId) {
          this.$store.dispatch('getVerboseData', sessionId);
        }
      }
    }
  }
</script>

<style lang="scss">
  main.verbose {
    display: flex;
    overflow-y: hidden;
  }

  .verbose-viewer {
    width: 100%;
    height: 100%;
    max-height: 100%;
    display: flex;

    > .col-1 {
      flex: 0 0 30%;
      background: transparent;
      padding: 1rem;

      h1 {
        margin: 0;
        padding: 1rem;
        line-height: 1;
        background: rgba(255,255,255,.05);
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
      }

      .meta-info {
        background: $grey;
        padding: 1rem;
        border-bottom-left-radius: 2px;
        border-bottom-right-radius: 2px;
      }

      td:first-child {
        width: 40%;
      }

      .filter {
        margin-top: 1rem;

        input {
          font: inherit;
          width: 100%;
          background: rgba(255, 255, 255, .05);
          color: #FFF;
          padding: .5rem 1rem;
          border: 0;
          margin-top: .5rem;
        }
      }
    }

    > .col-2 {
      flex: 0 0 70%;
      display: flex;
      flex-direction: column;

      ul.data {
        flex: 1;
        overflow: auto;
        list-style: none;
        margin: 0;
        padding: 0;

        > li {
          background: $grey;
          border-radius: 2px;
        }
      }
    }
  }
</style>
