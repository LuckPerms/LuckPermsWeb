<template>
  <main id="wiki" class="wiki container">
    <article id="article">
      <nuxt-child />
    </article>
    <aside>
      <h1>Wiki</h1>
      <div v-html="$md.render(sidebar)" />
    </aside>
  </main> 
</template>

<script>
export default {
  middleware ({route, redirect}) {
    if (route.path === '/wiki') redirect('/wiki/Home');
  },
  data() {
    return {
      sidebar: '',
    }
  },
  async fetch() {
    this.sidebar = (await this.$axios.get('/metadata/wiki/_Sidebar')).data.page;
  },
}
</script>

<style lang="scss">
</style>