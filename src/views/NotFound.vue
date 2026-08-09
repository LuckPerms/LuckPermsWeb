<template>
  <main class="notfound overflow-y-auto">
    <section class="hero flex-col items-center p-16">
      <div class="hero-content relative">
        <font-awesome icon="exclamation-circle" class="absolute -top-2 -left-28 z-[1] text-[6rem] opacity-50 text-red" />
        <h1 class="relative z-[2] mb-0">{{ $t('notFound.title') }}</h1>
        <div class="error text-red">
          <i18n-t keypath="notFound.message" tag="p" class="text-xl font-bold">
            <template #path>
              <code>{{ $route.path }}</code>
            </template>
          </i18n-t>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { useHead } from '@unhead/vue';

export default {
  name: 'NotFound',
  setup() {
    useHead({
      title: '404',
    });
  },
};
</script>
