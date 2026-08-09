<template>
<div class="modal" @click="closeModal">

  <div class="modal-box" @click.stop>
    <div class="close" @click="closeModal">
      <font-awesome icon="times-circle" />
    </div>

<!--    Modals -->
    <component :is="modalComponent" :props="modal.object" @close="closeModal" />
  </div>
</div>
</template>

<script>
import CreateGroup from './Modals/CreateGroup.vue';
import DeleteGroup from './Modals/DeleteGroup.vue';
import DeleteUser from './Modals/DeleteUser.vue';
import CreateTrack from './Modals/CreateTrack.vue';
import SavedChanges from './Modals/SavedChanges.vue';
import CopyNodes from './Modals/CopyNodes.vue';
import MoveNodes from './Modals/MoveNodes.vue';
import DeleteNodes from './Modals/DeleteNodes.vue';
import ReusedSessionWarning from './Modals/ReusedSessionWarning.vue';
import TrustPrompt from './Modals/TrustPrompt.vue';

const modalComponents = {
  createGroup: CreateGroup,
  deleteGroup: DeleteGroup,
  deleteUser: DeleteUser,
  createTrack: CreateTrack,
  savedChanges: SavedChanges,
  copyNodes: CopyNodes,
  moveNodes: MoveNodes,
  deleteNodes: DeleteNodes,
  reusedSessionWarning: ReusedSessionWarning,
  trustPrompt: TrustPrompt,
};

export default {
  name: 'Modal',
  props: {
    modal: Object,
  },
  computed: {
    modalComponent() {
      return modalComponents[this.modal?.type] || null;
    },
  },
  methods: {
    closeModal() {
      this.$store.commit('closeModal');
    },
  },
};
</script>

<style>
.modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal .modal-box {
  background: rgba(255, 255, 255, 0.2);
  padding: 2em;
  width: 100%;
  max-width: 600px;
  border-radius: 2px;
  position: relative;
}
.modal .modal-box .close {
  position: absolute;
  top: 0;
  right: 0;
  padding: 1em;
  font-size: 1.5em;
  opacity: 0.5;
  cursor: pointer;
}
.modal .modal-box .close:hover {
  opacity: 1;
}
.modal .modal-box .row {
  display: flex;
  margin: 0 -1em;
}
.modal .modal-box .row .col {
  width: 50%;
  padding: 0 1em;
  display: flex;
  flex-direction: column;
}
.modal .modal-box h2 {
  margin: 0;
  margin-bottom: 0.5em;
  line-height: 1;
}
.modal .modal-box .form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
}
.modal .modal-box .form-group label {
  font-weight: bold;
  margin-bottom: 0.5em;
}
.modal .modal-box .form-group input, .modal .modal-box .form-group select {
  font: inherit;
  font-family: "Source Code Pro", monospace;
  border: 0;
  border-radius: 2px;
  width: 16em;
  padding: 0.2em 0.5em;
  background-color: rgba(255, 255, 255, 0.75);
}
.modal .modal-box button {
  font: inherit;
  width: 100%;
  background: var(--color-brand);
  font-weight: bold;
  border: 0;
  border-radius: 2px;
  padding: 0.2em 0.5em;
  margin-top: 0.5em;
  cursor: pointer;
}
.modal .modal-box button:hover {
  opacity: 0.8;
}
.modal .modal-box button.red {
  background-color: var(--color-red);
}
.modal .modal-box button:not(:first-child):not(.save-button) {
  margin-left: 1em;
}
</style>
