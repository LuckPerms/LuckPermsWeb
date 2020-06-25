<template>
  <div>
    <h1>
      <transition name="fade" mode="out-in">
        <span :key="title">
          {{ title }}
        </span>
      </transition>
    </h1>
    <transition name="fade" mode="out-in">
      <section v-html="$md.render(article)" />
    </transition>
  </div>
</template>

<script>
export default {
  middleware ({route, redirect}) {
    if (route.path === '/wiki') redirect('/wiki/Home');
  },
  data() {
    return {
      article: '',
    }
  },
  computed: {
    route() {
      return this.$route.params.page;
    },
    title() {
      return this.route.split('-').join(' ');
    },
  },
  async fetch() {
    this.article = (await this.$axios.get(`/metadata/wiki/${this.route}`)).data.page;
  },
}
</script>