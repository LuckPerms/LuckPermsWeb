<template>
    <div>
      <client-only>
      <template v-if="article">
        <h1>
          <transition name="fade" mode="out-in">
            <span :key="title">
              {{ title }}
            </span>
          </transition>
        </h1>
        <transition name="fade" mode="out-in">
          <div v-html="article" />
        </transition>
      </template>
      <template v-else>
        <NotFound />
      </template>
      </client-only>
    </div>
</template>

<script>
import 'highlight.js/styles/atom-one-dark.css';

import NotFound from '@/layouts/error.vue';

export default {
  middleware ({route, redirect}) {
    if (route.path === '/wiki') redirect('/wiki/Home');
  },
  head() {
    const { title } = this;
    return {
      title,
      meta: [
             { hid: 'description', name: 'description', content: `Learn more about ${title}.` },
      { hid: 'twitter:description', name: 'twitter:description', content: `Learn more about ${title}.` },
      { hid: 'og:description', name: 'og:description', content: `Learn more about ${title}.` },
      ],
    };
  },
  components: {
    NotFound,
  },
  data() {
    return {
      article: null,
    };
  },
  computed: {
    route() {
      return this.$route.params.page;
    },
    title() {
      return this.route.split('-').join(' ');
    },
  },
  created() {
    if (this.route) {
      this.getArticle();
    }
  },
  methods: {
    async getArticle() {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      try {
        this.article = require(`@/assets/wiki/${this.route}.md`).default;
      } catch(e) {
        this.article = null;
        return;
      }
      await this.$nextTick();
      if (process.browser) {
        document.querySelectorAll('.wiki a').forEach((link) => {
          link.addEventListener('click', (event) => {
            event.preventDefault();
            let target;
            if (['STRONG', 'CODE'].includes(event.target.tagName)) {
              target = event.target.parentNode;
            } else if (event.target.tagName === 'A') {
              ({ target } = event);
            }
            if (target.href.startsWith(window.origin)) {
              $nuxt.$router.push({
                path: target.pathname,
                hash: target.hash,
              });
              this.getArticle();
            } else {
              window.open(target.href);
            }
          });
        });
        if (this.$route.hash) {
          await this.scrollTo(this.$route.hash);
        }
      }
    },
    async scrollTo(hash) {
      if (!process.browser) return;
      await this.$nextTick();
      const element = document.getElementById(hash.split('#')[1]);
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
};
</script>