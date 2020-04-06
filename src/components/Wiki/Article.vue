<template>
  <transition name="fade">
    <component :is="article" />
  </transition>
</template>

<script>
  export default {
    data() {
      return {
        article: null,
      }
    },
    computed: {
      route() {
        return this.$route.params.page;
      }
    },
    created() {
      if (this.route) {
        this.getArticle();
      }
    },
    mounted() {
      document.querySelectorAll('.wiki a').forEach(link => {
        link.addEventListener('click', event => {
          event.preventDefault();

          let target;

          if (event.target.tagName === 'STRONG') {
            target = event.target.parentNode;
          } else if (event.target.tagName === 'A') {
            target = event.target;
          }

          if (target.href.startsWith(window.origin)) {
            this.$router.push({
              path: target.pathname,
              hash: target.hash
            }).then(test => {
              console.log('test', test);
            }).catch(() => {});
          } else {
            window.open(target.href);
          }
        });
      });

      if (this.$route.hash) {
        this.scrollTo(this.$route.hash);
      }
    },
    methods: {
      getArticle() {
        this.article = require(`@/wiki/${this.route}.md`).default;
      },
      scrollTo(hash) {
        const element = document.getElementById(hash.split('#')[1]);
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    },
    watch: {
      $route(to, from) {
        if (to.hash) {
          this.$nextTick().then(() => {
            this.scrollTo(to.hash);
          });
        } else {
          document.getElementById('article').scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
        this.getArticle();
      }
    }
  }
</script>
