<template>
  <main class="errorpage">
    <section class="hero">
      <h1>
        <font-awesome icon="exclamation-circle" />
        <span v-if="error.statusCode === 404">Not found!</span>
        <span v-else>Error!</span>
        <div class="error">
          <p v-if="error.statusCode === 404">The page <code>{{ this.$route.path }}</code> couldn't be found</p>
          <p v-else>An error occured</p>
        </div>
      </h1>
    </section>
  </main>
</template>

<script>
export default {
  name: 'Error',
  props: ['error'],
  metaInfo: {
    title: '404',
  },
};
</script>

<style lang="scss">
  main.errorpage {
    overflow-y: auto;
    .hero {
      flex-direction: column;
      align-items: center;
      padding: 4rem;
      h1 {
        position: relative;
        svg {
          position: absolute;
          color: $red;
          top: -.5rem;
          left: -7rem;
          font-size: 6rem;
          z-index: 1;
          opacity: .5;
        }
        span {
          position: relative;
          z-index: 2;
        }
      }
      p {
        font-size: 1.25rem;
      }
      .error {
        color: $red;
      }
    }
  }
</style>
