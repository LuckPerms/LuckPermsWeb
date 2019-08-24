<template>
<div>
  <h2>Data was saved!</h2>

  <p>
    Run this command on your server to apply the changes: <br>
    <code>/lp applyedits {{ saveKey }}</code>
  </p>
</div>
</template>

<script>
export default {
  name: 'CreateGroup',
  data() {
    return {};
  },
  props: {
    saveKey: String,
  },
};
</script>

<style lang="scss">

</style>
