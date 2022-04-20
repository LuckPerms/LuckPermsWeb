<template>
  <main class="notfound">
    <section class="hero">
      <div class="hero-content">
        <font-awesome icon="exclamation-circle" />
        <h1>{{ $t("notFound.title") }}</h1>
        <div class="error">
          <i18n path="notFound.message" tag="p">
            <template #path>
              <code>{{ $route.path }}</code>
            </template>
          </i18n>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: "NotFound",
  metaInfo: {
    title: "404",
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

    .hero-content {
      position: relative;

      svg {
        position: absolute;
        color: $red;
        top: -0.5rem;
        left: -7rem;
        font-size: 6rem;
        z-index: 1;
        opacity: 0.5;
      }

      h1 {
        position: relative;
        z-index: 2;
        margin-bottom: 0;
      }
    }

    p {
      font-size: 1.25rem;
      font-weight: bold;
    }

    .error {
      color: $red;
    }
  }
}
</style>
