<template>
  <div class="add-node">
    <form class="row" autocomplete="off" @submit.prevent>
      <div class="form-group">
        <label for="permissions">Add permissions</label>
        <multiselect
          id="permissions"
          v-model="permissions"
          :options="knownPermissions"
          :multiple="true"
          :taggable="true"
          @tag="onTag"
          tag-placeholder="Press enter to select"
          placeholder="Enter permissions or paste many"
        ></multiselect>
      </div>

      <div>
        <div class="form-group">
          <label>
            Value
            <button type="button" @click="value = !value" :class="{ code: true, 'true': value}">
              {{ value }}
            </button>
          </label>
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
        <label>
          Contexts
          <button type="button" class="code" @click="context.ui = true">Add Contexts</button>
        </label>
        <div>
          <code v-for="(value, key) in context.contexts">
            <span>{{ key }}:</span>
            {{ value }}
          </code>
        </div>
      </div>

      <button
        type="submit"
        :disabled="permissions.length === 0"
        @click="addNodesToSession"
        title="Add node"
      >
        <font-awesome icon="plus" />
      </button>
    </form>

    <transition name="fade">
      <div v-if="context.ui" class="context-ui" v-click-outside="closeContextUi">
        <h4>Contexts <span>({{ Object.keys(context.contexts).length }})</span></h4>
        <div class="close" @click="closeContextUi">
          <font-awesome icon="times" />
        </div>
        <ul>
          <li v-for="(value, key) in context.contexts">
            <span v-html="key"></span>
            <span v-html="value"></span>
          </li>
          <li>
          <span class="edit">
            <input type="text" v-model="context.key" placeholder="key">
          </span>
            <span class="edit">
            <input type="text" v-model="context.value" placeholder="value" @keydown.enter="addContext">
          </span>
          </li>
        </ul>
        <button @click="addContext">
          <font-awesome icon="plus" />
          Add context
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
import Datepicker from '@turbotailz/vuejs-datepicker';
import Multiselect from 'vue-multiselect';
import vClickOutside from 'v-click-outside';

export default {
  name: 'AddNode',
  components: {
    Datepicker,
    Multiselect,
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
  data() {
    return {
      permissions: [],
      value: true,
      expiry: null,
      server: null,
      world: null,
      context: {
        contexts: {},
        ui: null,
        key: '',
        value: '',
      },
    };
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
    onTag(tag) {
      const permissions = tag.split(/,\s*|,|\s+|\s*-{1}\s+/);

      permissions.forEach((permission) => {
        if (permission === '') return;

        this.permissions.push(permission);

        if (!this.knownPermissions.find(knownPermission => knownPermission === permission)) {
          this.addKnownPermission(permission);
        }
      });
    },
    addKnownPermission(permission) {
      this.$store.dispatch('addKnownPermission', permission);
    },
    addNodesToSession() {
      if (this.permissions.length === 0) return;

      const nodes = [];

      this.permissions.forEach((key) => {
        nodes.push({
          sessionId: this.session.id,
          type: 'permission',
          key,
          value: this.value,
          expiry: this.expiry,
          context: this.context.contexts,
          isNew: true,
        });
      });

      this.$store.dispatch('addNodes', nodes);

      this.permissions = [];
      this.value = true;
      this.expiry = null;
      this.context.contexts = {};
    },
    closeContextUi() {
      this.context.ui = false;
      this.context.key = '';
      this.context.value = '';
    },
    addContext() {
      if (this.context.key === '' || this.context.value === '') return;

      this.context.contexts[this.context.key] = this.context.value;

      this.context.key = '';
      this.context.value = '';
    },
  },
};
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
      display: flex;

      > div {
        border-right: 1px solid rgba(0,0,0,.2);
        padding: .5rem 0;
      }

      > button {
        margin: .5rem;
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

      .form-group {
        display: flex;
        flex-direction: column;
        flex: 1 1 12%;
        padding-left: .5em;
        padding-right: .5em;
        align-items: flex-start;
        position: relative;

        &:first-child {
          flex: 2 2 40%;
        }

        + .form-group {
          padding-top: .5rem;
          border-top: 1px solid rgba(0,0,0,.2);
        }

        label {
          line-height: 1;
          margin-bottom: .5em;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          cursor: pointer;

          button.code {
            width: auto;
          }
        }

        .multiselect__input {
          background: transparent;
          font: inherit;
          color: #FFF;

          &::placeholder {
            color: rgba(255,255,255,.2);
          }
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

      .contexts {
        button.code {
          color: $brand-color;
        }

        code {
          display: inline-block;
          margin-right: .2rem;
          margin-top: .2rem;

          span {
            font-size: smaller;
            opacity: .5;
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

    .multiselect {
      color: white;
    }

    .multiselect__tags {
      background: rgba(0,0,0,.1);
      border: 0;
      border-radius: 2px;
      font: inherit;
    }

    .multiselect__tag {
      background: rgba(0,0,0,.25);
      color: white;
      font-family: "Source Code Pro", monospace;
      font-size: .8rem;
      border-radius: 2px;
      padding: .25rem 1.5rem .25rem .5rem;

      &-icon {
        border-radius: 0;

        &:after {
          color: #000;
          opacity: .25;
        }

        &:hover {
          background: transparent;

          &:after {
            opacity: .5;
          }
        }
      }
    }

    .multiselect__content {
      font-family: "Source Code Pro", monospace;

      &-wrapper {
        background: $grey;
        border: 0;
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
        box-shadow: 0 -1rem 2rem rgba(0,0,0,.1);
      }
    }

    .multiselect__element {
      &:not(:first-child) {
        border-top: 1px solid rgba(0,0,0,.2);
      }
    }

    .multiselect__option {
      &--highlight {
        background: rgba(255,255,255,.2);

        &:after {
          background: rgba(0,0,0,.2);
        }
      }

      &--selected {
        background: $brand-color;
        color: $navy;

        &:after {
          color: rgba(0,0,0,.5);
        }

        &.multiselect__option--highlight {
          background: lighten($brand-color, 10%);
        }
      }
    }

    .vdp-datepicker__calendar {
      bottom: 100%;
      top: unset;
    }

    .context-ui {
      bottom: 5rem;
      top: unset;
      right: 2rem;

      input {
        border: 0;
        background: rgba(0,0,0,.2);
        color: #FFF;
        font-family: "Source Code Pro", monospace;
      }
    }
  }
</style>
