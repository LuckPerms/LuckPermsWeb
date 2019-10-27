<template>
  <div class="add-node">
    <form class="row" autocomplete="off" @submit.prevent>
      <div class="form-group">
        <label for="permissions">Add permissions</label>
        <multiselect
          v-model="permissions"
          :options="knownPermissions"
          :multiple="true"
          :taggable="true"
          @tag="addPermission"
          tag-placeholder="Press enter to select"
        ></multiselect>
      </div>

      <div>
        <div class="form-group">
          <label>Value</label>
          <button type="button" @click="value = !value" :class="{ code: true, 'true': value}">
            {{ value }}
          </button>
        </div>

        <div class="form-group">
          <label for="expiry">Expiry</label>
          <datepicker
            id="expiry"
            name="expiry"
            v-model="expiry"
            placeholder="never"
            :disabled-dates="{ to: new Date() }"
          />
        </div>
      </div>

      <div class="form-group contexts">
        <label>Contexts</label>
        <button type="button" class="code">Add Contexts</button>
      </div>

<!--      <div class="form-group">-->
<!--        <label for="server">Server</label>-->
<!--        <input type="text" id="server" name="server" v-model="server"  placeholder="global">-->
<!--      </div>-->

<!--      <div class="form-group">-->
<!--        <label for="world">World</label>-->
<!--        <input type="text" id="world" name="world" v-model="world"  placeholder="global">-->
<!--      </div>-->

<!--      <div class="form-group">-->
<!--        <label for="contexts">Contexts</label>-->
<!--        <input type="text" id="contexts" name="contexts" v-model="contexts"  placeholder="none">-->
<!--      </div>-->

      <button type="submit" :disabled="permissions.length === 0" @click="addNodesToSession">
        <font-awesome icon="plus" />
      </button>
    </form>
  </div>
</template>

<script>
  import Datepicker from 'vuejs-datepicker';
  import Multiselect from 'vue-multiselect';

  export default {
    name: 'AddNode',
    components: {
      Datepicker,
      Multiselect
    },
    data() {
      return {
        permissions: [],
        value: true,
        expiry: null,
        server: null,
        world: null,
        contexts: null,
      }
    },
    props: {
      session: Object,
    },
    computed: {
      knownPermissions() {
        return this.$store.state.editor.knownPermissions;
      },
      // sortedKnownPermissions() {
      //   if (this.permission !== '') {
      //     const sortedArray = this.$store.state.editor.knownPermissions
      //       .filter(node => node.indexOf(this.permission) >= 0);
      //
      //     return sortedArray.slice(0, 100);
      //   }
      //   return [];
      // },
    },
    methods: {
      addPermission(permisison) {
        this.$store.dispatch('addKnownPermission', permission);
      },
      addNodesToSession() {
        if (this.permissions.length === 0) return;

        let nodes = [];

        this.permissions.forEach(key => {
          nodes.push({
            sessionId: this.session.id,
            type: 'permission',
            key,
            value: this.value,
            expiry: this.expiry,
            // TODO: context,
            context: {},
            isNew: true,
          })
        });

        this.$store.dispatch('addNodes', nodes);

        this.permissions = [];
        this.value = true;
        this.expiry = null;
      }
    }
  }
</script>

<style lang="scss">
  @import '~vue-multiselect/dist/vue-multiselect.min.css';

  .add-node {
    background-color: #666670;
    position: fixed;
    bottom: 3em;
    left: 20.5em;
    right: 1em;
    box-shadow: 0 0 1em rgba(0,0,0,.2);

    > .row {
      position: relative;

      > button {
        margin: 0 .5rem;
        background: $grey;
        color: $brand-color;
        border: 0;
        border-radius: 2px;
        width: 4em;
        cursor: not-allowed;
        opacity: .5;

        &:not([disabled]) {
          opacity: 1;
          cursor: pointer;

          &:hover {
            opacity: .8;
          }
        }
      }
    }

    .known-permissions {
      position: absolute;
      bottom: 100%;
      left: 0;
      background: #565660;
      z-index: 15;
      display: flex;
      flex-direction: column-reverse;
      width: 40%;
      max-height: 50vh;
      overflow-y: auto;
      padding: .5em 0;
      box-shadow: 0 0 1em rgba(0,0,0,.2);

      li {
        padding: .2em 1em;
        border-bottom: 1px solid rgba(0,0,0,0.2);
        cursor: pointer;
        word-break: break-all;
        font-family: 'Source Code Pro', monospace;

        &:hover {
          background: rgba(255,255,255,.2);
        }

        &.highlighted {
          background: rgba(255,255,255,.2);
        }
      }
    }

    .row {
      display: flex;
      padding: 1em .5em;

      .form-group {
        display: flex;
        flex-direction: column;
        flex: 1 1 12%;
        padding: 0 .5em;
        align-items: flex-start;
        position: relative;

        &:first-child {
          flex: 2 2 40%;
        }

        label {
          line-height: 1;
          margin-bottom: .5em;
        }

        input, textarea {
          width: 100%;
          height: 100%;
          border: 0;
          background: rgba(0,0,0,0.2);
          border-radius: 2px;
          padding: .2em .5em;
          color: #FFF;
          font-family: 'Source Code Pro', monospace;
          line-height: 1.5;
        }

        .code {
          color: $red;
          cursor: pointer;
          width: 100%;
          text-align: center;

          &.true {
            color: $brand-color;
          }

          &:hover {
            opacity: .8;
          }
        }
      }
    }

    .vdp-datepicker__calendar {
      bottom: 100%;
      top: unset;
    }
  }
</style>
