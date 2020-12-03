<template>
  <div class="tool-intro">
    <div>
      <img alt="LuckPerms logo" src="@/assets/logo.svg">
      <div class="text">
        <h1>LuckPerms</h1>
        <p v-if="type === 'editor'">Web Permissions Editor</p>
        <p v-if="type === 'verbose'">Verbose Viewer</p>
        <p v-if="type === 'treeview'">Permission Tree Viewer</p>
        <div v-if="loading && !error">
          <p>
            <font-awesome icon="asterisk" :spin="true" />
            Loading data...
          </p>
        </div>
        <template v-else-if="!error">
          <a :href="`/${type}/demo`">
            <button class="button demo-button">
              View Demo
            </button>
          </a>
          <p v-if="type === 'editor'">To start a new editor session, use one of the following commands:</p>
          <p v-if="type === 'verbose'">To generate a verbose report, do the following in game or from console:</p>
          <p v-if="type === 'treeview'">To generate a permission tree, do the following in game or from the console:</p>
          <ul v-if="type === 'editor'">
            <li><code>/lp editor</code></li>
            <li><code>/lp user &lt;user&gt; editor</code></li>
            <li><code>/lp group &lt;group&gt; editor</code></li>
          </ul>
          <ul v-if="type === 'verbose'">
            <li><code>/lp verbose record [filter]</code></li>
            <li>Perform a series of actions that require permissions</li>
            <li><code>/lp verbose paste</code></li>
            <li>Follow the URL that is generated</li>
          </ul>
          <ul v-if="type === 'treeview'">
            <li><code>/lp tree [scope] [player]</code></li>
            <li>Follow the URL that is generated</li>
          </ul>
        </template>
        <div v-else class="error">
          <p>
            <strong>There was an error loading the data.</strong>
            Either the URL was copied wrong or the session has expired.
          </p>
          <p>Please generate another editor session with <code>{{ smallCommand }}</code></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['type', 'error', 'loading'],
  computed: {
    smallCommand() {
      if (this.type === 'editor')   return '/lp editor';
      if (this.type === 'verbose')  return '/lp verbose';
      if (this.type === 'treeview') return '/lp tree';
    },
  },
}
</script>
