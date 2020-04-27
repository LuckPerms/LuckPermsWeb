<template>
  <main class="notfound">
    <section class="hero">
      <h1>
        <font-awesome icon="exclamation-circle" />
        <span>Not found!</span>
      </h1>
      <div class="error">
        <p>The page <code>{{ pageName }}</code> couldn't be found</p>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: 'NotFound',
  computed: {
    pageName() { return this.$route.path; }
  }
}
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
          top: -1.5rem;
          left: -4rem;
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
        font-size: 1.5rem;
      }

      .error {
        margin-top: 1em;
        color: $red;
      }
    }
  }
</style>
