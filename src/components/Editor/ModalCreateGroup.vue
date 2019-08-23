<template>
<div>
  <h2>Create a group</h2>
  <div class="row">
    <div class="col">
      <div class="form-group">
        <label for="groupName">Group name</label>
        <input type="text" id="groupName" v-model="groupName" autofocus>
      </div>
      <div class="form-group">
        <label for="displayName">Display name</label>
        <input type="text" id="displayName" v-model="displayName">
      </div>
      <div class="form-group">
        <label for="parent">Parent</label>
        <select name="parent" id="parent" v-model="parent">
          <option value="0">None</option>
          <option v-for="group in groups" :value="group.id" :key="group.id">
            {{group.who.friendly}}
          </option>
        </select>
      </div>
    </div>
    <div class="col">
      <div class="form-group">
        <label for="weight">Weight</label>
        <input type="number" id="weight" v-model="weight">
      </div>
      <div class="form-group">
        <label for="prefix">Prefix</label>
        <input type="text" id="prefix" v-model="prefix">
      </div>
      <div class="form-group">
        <label for="suffix">Suffix</label>
        <input type="text" id="suffix" v-model="suffix">
      </div>
    </div>
  </div>
  <button type="button">
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
      groupName: '',
      displayName: '',
      weight: 0,
      parent: 0,
      prefix: '',
      suffix: '',
    };
  },
  props: {
    groups: Array,
  },
  computed: {
  },
  methods: {
  },
};
</script>

<style lang="scss">

</style>
