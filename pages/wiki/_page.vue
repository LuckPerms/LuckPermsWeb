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
  async asyncData({ $axios, params }) {
    const response = await $axios.get(`/metadata/wiki/${params.page}`);
    return { article: response.data.page };
  },
  computed: {
    route() {
      return this.$route.params.page;
    },
    title() {
      return this.route.split('-').join(' ');
    },
  },
  mounted() {
    document.querySelectorAll('.wiki a').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        let target;
        if (['STRONG', 'CODE'].includes(event.target.tagName)) {
          target = event.target.parentNode;
        } else if (event.target.tagName === 'A') {
          ({ target } = event);
        }
        $nuxt.$router.push({
          path: target.pathname,
          hash: target.hash,
        });
      });
    });
  },
  created() {
    if (process.browser) {
      if (this.$route.hash) {
        console.log(this.$route.hash);
        this.scrollTo(this.$route.hash);
      }
    }
  },
  methods: {
    async scrollTo(hash) {
      await this.$nextTick();
      const element = document.getElementById(hash.split('#')[1]);
      console.log(element);
      if (!element) return;
      element.scrollIntoView({
        behavior: 'smooth',
      });
    },
  },
  watch: {
    $route(to) {
      if (to.hash) {
        this.$nextTick().then(() => {
          this.scrollTo(to.hash);
        });
      } else {
        document.getElementById('article').scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    },
  },
}
</script>