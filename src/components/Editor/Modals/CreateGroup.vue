<template>
<div>
  <h2>Create a group</h2>
  <div class="row">
    <div class="col">
      <div class="form-group">
        <label for="groupName">Group name</label>
        <input type="text" id="groupName" :value="group.name" @input="updateGroupName($event)">
      </div>
      <div class="form-group">
        <label for="displayName">Display name</label>
        <input type="text" id="displayName" v-model="group.displayName">
        <ColorParser v-if="group.displayName" :text="group.displayName" :showRaw="false" />
      </div>
      <div class="form-group">
        <label for="parent">Parent</label>
        <select name="parent" id="parent" v-model="group.parent">
          <option value="0">None</option>
          <option v-for="groupItem in props" :value="groupItem.id" :key="groupItem.id">
            {{ groupItem.displayName }}
          </option>
        </select>
      </div>
    </div>
    <div class="col">
      <div class="form-group">
        <label for="weight">Weight</label>
        <input type="number" id="weight" v-model="group.weight">
      </div>
      <div class="form-group">
        <label for="prefix">Prefix</label>
        <input type="text" id="prefix" v-model="group.prefix">
        <ColorParser v-if="group.prefix" :text="group.prefix" :showRaw="false" />
      </div>
      <div class="form-group">
        <label for="suffix">Suffix</label>
        <input type="text" id="suffix" v-model="group.suffix">
        <ColorParser v-if="group.suffix" :text="group.suffix" :showRaw="false" />
      </div>
    </div>
  </div>
  <button type="button" @click="addGroup" class="save-button">
    <font-awesome icon="plus-circle" />
    Add group
  </button>
</div>
</template>

<script>
import ColorParser from './../Utilities/ColorParser';

export default {
  name: 'CreateGroup',
  components: {
    ColorParser,
  },
  data() {
    return {
      group: {
        name: '',
        displayName: '',
        weight: 0,
        parent: 0,
        prefix: '',
        suffix: '',
      },
    };
  },
  props: {
    props: Array,
  },
  computed: {
  },
  methods: {
    updateGroupName(event) {
      this.group.name = event.target.value.toLowerCase().replace(' ', '-');
    },

    addGroup() {
      if (this.group.name !== '') {
        const result = this.$store.dispatch('addGroup', this.group);

        if (result === 'success') this.$emit('close');
      }
    },
  },
};
</script>

<style lang="scss">

</style>
