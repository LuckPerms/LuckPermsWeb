<template>
  <main class="notfound">
    <section class="hero">
      <h1>
        <font-awesome icon="exclamation-circle" />
        <span>Not found!</span>
        <div class="error">
          <p>The page <code>{{ this.$route.path }}</code> doesn't exist</p>
        </div>
      </h1>
    </section>
  </main>
</template>

<script>
export default {
  name: 'NotFound',
  metaInfo: {
    title: '404',
  },
};
</script>

<style lang="scss">
  main.notfound {
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
