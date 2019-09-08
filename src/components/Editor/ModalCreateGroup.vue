<template>
<div>
  <h2>Create a group</h2>
  <div class="row">
    <div class="col">
      <div class="form-group">
        <label for="groupName">Group name</label>
        <input type="text" id="groupName" v-model="group.name" autofocus>
      </div>
      <div class="form-group">
        <label for="displayName">Display name</label>
        <input type="text" id="displayName" v-model="group.displayName">
      </div>
      <div class="form-group">
        <label for="parent">Parent</label>
        <select name="parent" id="parent" v-model="group.parent">
          <option value="0">None</option>
          <option v-for="groupItem in groups" :value="groupItem.id" :key="groupItem.id">
            {{groupItem.displayName}}
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
      </div>
      <div class="form-group">
        <label for="suffix">Suffix</label>
        <input type="text" id="suffix" v-model="group.suffix">
      </div>
    </div>
  </div>
  <button type="button" @click="addGroup">
    <font-awesome icon="plus-circle" />
    Add group
  </button>
</div>
</template>

<script>

export default {
  name: 'CreateGroup',
  data() {
    return {
      group: {
        name: '',
        displayName: '',
        weight: 0,
        parent: 0,
        prefix: '',
        suffix: '',
      }
    };
  },
  props: {
    groups: Array,
  },
  computed: {
  },
  methods: {
    addGroup() {
      if (this.group.name !== '') {
        let result = this.$store.dispatch('addGroup', this.group);

        if (result === 'success') this.$store.commit('closeModal');
      }
    }
  },
};
</script>

<style lang="scss">

</style>
