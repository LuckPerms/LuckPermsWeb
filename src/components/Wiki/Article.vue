<template>
    <div>
      <template v-if="article">
        <h1>
          <transition name="fade" mode="out-in">
            <span :key="title">
              {{ title }}
            </span>
          </transition>
        </h1>
        <transition name="fade" mode="out-in">
          <component :is="article" />
        </transition>
      </template>
      <template v-else>
        <NotFound/>
      </template>
    </div>
</template>

<script>
import NotFound from '@/views/NotFound.vue';

export default {
  metaInfo() {
    const { title } = this;
    return {
      title,
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
      try {
        // eslint-disable-next-line global-require,import/no-dynamic-require
        this.article = require(`@/wiki/pages/${this.route}.md`).default;
      } catch (e) {
        this.article = null;
        return;
      }

      await this.$nextTick();

      document.querySelectorAll('#article a').forEach((link) => {
        link.addEventListener('click', (event) => {
          event.preventDefault();

          let target;

          if (['STRONG', 'CODE'].includes(event.target.tagName)) {
            target = event.target.parentNode;
          } else if (event.target.tagName === 'A') {
            ({ target } = event);
          }

          if (target.href.startsWith(window.origin)) {
            this.$router.push({
              path: target.pathname,
              hash: target.hash,
            }).then().catch(() => {});
          } else {
            window.open(target.href);
          }
        });
      });

      if (this.$route.hash) {
        await this.scrollTo(this.$route.hash);
      }
    },
    async scrollTo(hash) {
      await this.$nextTick();
      const element = document.getElementById(hash.split('#')[1]);
      if (!element) return;
      setTimeout(() => {
        element.scrollIntoView({
          behavior: 'smooth',
        });
      }, 500);
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
      this.getArticle();
    },
  },
};
</script>
