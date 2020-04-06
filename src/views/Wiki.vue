<template>
  <div class="wiki">
    <aside>
      <sidebar />
    </aside>
    <article>
      <component :is="html"></component>
    </article>
  </div>
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
	background-color: #141422;
  }

  aside {
    flex: 0 0 16em;
    position: sticky;
    top: 0;
    background: #EEE;
    padding: 2em;
	background-color: #0f0f15;
  }

  article {
    padding: 2em;
    max-width: 100%;
  }
  
  img {
	max-width: 100%;
  }
</style>