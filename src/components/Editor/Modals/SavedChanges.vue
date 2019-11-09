<template>
<div>
  <h2>Data was saved!</h2>

  <p>
    Run this command on your server to apply the changes:
  </p>

  <code class="apply-edits">/lp applyedits {{ props }}</code>

  <p>
    <strong>Note:</strong> after running the <code>applyedits</code> command, you should generate another editor URL to continue editing your server's permissions.
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
    props: String,
  },
};
</script>

<style lang="scss">
  .apply-edits {
    font-size: 1.5rem;
  }
</style>
