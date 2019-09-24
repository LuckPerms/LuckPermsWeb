<template>
  <div class="add-node">
    <form class="row" autocomplete="off" @submit.prevent>
      <div class="form-group">
        <label for="permission">Add permission</label>
        <input
          type="text"
          id="permission"
          name="permission"
          v-model="permission"
          @focus="handlePermissionFocus"
          @blur="handlePermissionBlur"
          @keydown.down="handlePermissionKeyDown"
          @keydown.up="handlePermissionKeyUp"
          @keydown.enter.prevent="handlePermissionAddition(null)"
          @keydown.tab="handlePermissionAddition(null)"
          ref="permissionInput"
          required
        />
      </div>

      <ul
        class="known-permissions"
        v-if="list && sortedKnownPermissions.length"
      >
        <li
          v-for="(node, i) in sortedKnownPermissions"
          :key="i + '_' + node"
          :class="{ 'highlighted': i === highlightedNode }"
          @click.stop="handlePermissionAddition(node)"
        >{{node}}</li>
      </ul>

      <div class="form-group">
        <label>Value</label>
        <button type="button" @click="value = !value" :class="{ code: true, 'true': value}">
          {{value}}
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

      <div class="form-group">
        <label for="server">Server</label>
        <input type="text" id="server" name="server" v-model="server"  placeholder="global">
      </div>

      <div class="form-group">
        <label for="world">World</label>
        <input type="text" id="world" name="world" v-model="world"  placeholder="global">
      </div>

      <div class="form-group">
        <label for="contexts">Contexts</label>
        <input type="text" id="contexts" name="contexts" v-model="contexts"  placeholder="none">
      </div>

      <button type="submit" :disabled="permission === ''" @click="addNodeToSession">
        <font-awesome icon="plus" />
      </button>
    </form>
  </div>
</template>

<script>
  import Datepicker from 'vuejs-datepicker';

  export default {
    name: 'AddNode',
    components: {
      Datepicker
    },
    data() {
      return {
        permission: '',
        highlightedNode: 0,
        list: false,
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
      sortedKnownPermissions() {
        if (this.permission !== '') {
          const sortedArray = this.$store.state.editor.knownPermissions
            .filter(node => node.indexOf(this.permission) >= 0);

          return sortedArray.slice(0, 100);
        }
        return [];
      },
    },
    methods: {
      handlePermissionAddition(node) {
        if (node) {
          this.permission = node;
        } else if (this.sortedKnownPermissions.length) {
          this.permission = this.sortedKnownPermissions[this.highlightedNode];
        }

        this.highlightedNode = 0;
        this.list = false;
      },
      handlePermissionFocus() {
        this.highlightedNode = 0;
        this.list = true;
      },
      handlePermissionBlur() {
        setTimeout(() => {
          this.list = false;
        }, 500);
      },
      handlePermissionKeyUp() {
        if (this.permission === '') return;

        this.list = true;

        if (this.highlightedNode < this.sortedKnownPermissions.length - 1) {
          this.highlightedNode++;
        }
      },
      handlePermissionKeyDown() {
        if (this.permission === '') return;

        this.list = true;

        if (this.highlightedNode > 0) {
          this.highlightedNode--;
        }
      },
      addNodeToSession() {
        if (this.permission === '') return;

        const node = {
          sessionId: this.session.id,
          type: 'permission',
          key: this.permission,
          value: this.value,
          expiry: this.expiry,
          context: {
            ...this.server && { server: this.server },
            ...this.world && { world: this.world },
          },
          // TODO: contexts: this.contexts,
          isNew: true,
        };

        this.$store.dispatch('addNode', node);

        this.permission = '';
        this.highlightedNode = 0;
        this.list = false;
        this.value = true;
        this.expiry = null;
        this.server = null;
        this.world = null;
        this.contexts = null;

        this.$refs.permissionInput.focus();
      }
    }
  }
</script>

<style lang="scss">
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

        input {
          width: 100%;
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
