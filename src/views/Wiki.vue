<template>
  <main class="wiki container">
    <aside>
      <h1>Wiki</h1>
      <sidebar />
    </aside>
    <article>
      <component :is="html"></component>
    </article>
  </main>
</template>

<script>
  import Sidebar from '../wiki/_Sidebar.md';

  export default {
    components: {
      Sidebar
    },
    data() {
      return {
        html: null,
      }
    },
    created() {
      const page = this.$route.params.page;
      if (page) {
        this.html = require('@/wiki/'+page+'.md').default;
      } else {
        this.$router.push('/wiki/Home');
      }
    },
    mounted() {

    }
  }
</script>

<style lang="scss">
  .wiki {
    display: flex;
    align-items: flex-start;
	  background-color: $grey;
    height: 100%;
  }

  aside {
    flex: 0 0 16em;
    padding: 2em;
	  background-color: rgba(0,0,0,.25);
    overflow: auto;
    height: 100%;

    @include breakpoint($lg) {
      flex: 0 0 24em;
    }

    h1 {
      font-size: 2rem;
      margin-top: 0;
    }

    a {
      text-decoration: none;
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;

      ul {
        padding-left: 1rem;
      }
    }
  }

  article {
    padding: 2em;
    max-width: 100%;
    height: 100%;
    overflow: auto;
  }

  img {
	max-width: 100%;
  }
</style>
