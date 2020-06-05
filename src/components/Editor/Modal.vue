<template>
<div class="modal" @click="closeModal">

  <div class="modal-box" @click.stop>
    <div class="close" @click="closeModal">
      <font-awesome icon="times-circle" />
    </div>

<!--    Modals -->
    <component :is="modal.type" :props="modal.object" @close="closeModal" />
  </div>
</div>
</template>

<script>
import CreateGroup from './Modals/CreateGroup.vue';
import DeleteGroup from './Modals/DeleteGroup.vue';
import CreateTrack from './Modals/CreateTrack.vue';
import SavedChanges from './Modals/SavedChanges.vue';

export default {
  name: 'Modal',
  components: {
    CreateGroup,
    DeleteGroup,
    CreateTrack,
    SavedChanges,
  },
  props: {
    modal: Object,
  },
  methods: {
    closeModal() {
      this.$store.commit('closeModal');
    },
  },
};
</script>

<style lang="scss">
.modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: rgba(0,0,0,0.9);
  display: flex;
  align-items: center;
  justify-content: center;


  .modal-box {
    background: rgba(255,255,255,.2);
    padding: 2em;
    width: 100%;
    max-width: 600px;
    border-radius: 2px;
    position: relative;

    .close {
      position: absolute;
      top: 0;
      right: 0;
      padding: 1em;
      font-size: 1.5em;
      opacity: .5;
      cursor: pointer;

      &:hover {
        opacity: 1;
      }
    }

    .row {
      display: flex;
      margin: 0 -1em;

      .col {
        width: 50%;
        padding: 0 1em;
        display: flex;
        flex-direction: column;
      }
    }

    h2 {
      margin: 0;
      margin-bottom: .5em;
      line-height: 1;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 1em;

      label {
        font-weight: bold;
        margin-bottom: .5em;
      }

      input, select {
        font: inherit;
        font-family: 'Source Code Pro', monospace;
        border: 0;
        border-radius: 2px;
        width: 16em;
        padding: .2em .5em;
        background-color: rgba(255,255,255,.75);
      }
    }

    button {
      font: inherit;
      width: 100%;
      background: $brand-color;
      font-weight: bold;
      border: 0;
      border-radius: 2px;
      padding: .2em .5em;
      margin-top: .5em;
      cursor: pointer;

      &:hover {
        opacity: .8;
      }

      &.red {
        background-color: $red;
      }
    }
  }
}
</style>
