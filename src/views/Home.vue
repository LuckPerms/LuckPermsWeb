<template>
  <main class="home overflow-y-auto">
    <section class="hero">
      <div class="container flex flex-wrap md:flex-nowrap">
        <div :class="['logo', { selfhosted: config.selfHosted }]" class="flex w-full flex-col items-center justify-center px-8 py-16 text-center text-[1.5em] [&.selfhosted]:w-full [&.selfhosted]:justify-center md:w-[66%] md:flex-row md:justify-start md:p-16 md:text-left">
          <img alt="LuckPerms logo" src="../assets/logo.svg" class="mb-8 h-52 w-auto md:mb-0 md:mr-8">
          <div class="md:max-w-[35rem]">
            <h1>LuckPerms</h1>
            <p>{{ $t('description') }}</p>
          </div>
        </div>

        <div v-if="!config.selfHosted" class="flex w-full flex-col items-center justify-center pb-16 md:w-[34%] md:items-end md:p-16">
          <router-link to="/download" class="button md:mt-10">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              {{ $t('links.download') }}
            </span>
            <small>
              v{{ version }}
              <font-awesome icon="asterisk" :spin="true" v-if="!version" />
            </small>
          </router-link>
          <small class="mt-4 max-w-[18rem] text-center opacity-50 md:text-right">
            {{ $t('home.supported') }}
          </small>
        </div>
      </div>
    </section>

    <div class="container flex" v-if="!config.selfHosted">
      <section class="resources">
        <div>
          <h2>{{ $t('home.why.title') }}</h2>
          <p>{{ $t('home.why.description') }}</p>
          <p>{{ $t('home.why.its') }}</p>
          <ul>
            <li v-html="$t('home.why.fast')"/>
            <li v-html="$t('home.why.reliable')"/>
            <li v-html="$t('home.why.easy')"/>
            <li v-html="$t('home.why.flexible')"/>
            <li v-html="$t('home.why.extensive')"/>
            <li v-html="$t('home.why.free')"/>
          </ul>

          <h2>{{ $t('home.apps.title') }}</h2>
          <p>{{ $t('home.apps.description1') }}</p>
          <p>{{ $t('home.apps.description2') }}</p>
          <div class="tools flex">
            <router-link to="/editor" alt="Web Editor" class="m-4 flex flex-1 flex-col items-center rounded-sm bg-grey p-8 text-center font-bold text-brand no-underline first:ml-0 last:mr-0 sm:text-xl">
              <font-awesome icon="edit" class="mb-4 text-[3rem] text-white opacity-50 sm:text-[4rem]" />
              {{ $t('links.editor') }}
            </router-link>
            <router-link to="/verbose" alt="Verbose Viewer" class="m-4 flex flex-1 flex-col items-center rounded-sm bg-grey p-8 text-center font-bold text-brand no-underline first:ml-0 last:mr-0 sm:text-xl">
              <font-awesome icon="comment-alt" class="mb-4 text-[3rem] text-white opacity-50 sm:text-[4rem]" />
              {{ $t('links.verbose') }}
            </router-link>
            <router-link to="/treeview" alt="Tree Viewer" class="m-4 flex flex-1 flex-col items-center rounded-sm bg-grey p-8 text-center font-bold text-brand no-underline first:ml-0 last:mr-0 sm:text-xl">
              <font-awesome icon="sitemap" class="mb-4 text-[3rem] text-white opacity-50 sm:text-[4rem]" />
              {{ $t('links.tree') }}
            </router-link>
          </div>
        </div>
        <div>
          <a href="https://github.com/LuckPerms/LuckPerms" class="resource">
            <span>
              <font-awesome :icon="['fab', 'github']" />
              GitHub
            </span>
            <small>{{ $t('home.github') }}</small>
          </a>
          <a href="https://discord.gg/luckperms" class="resource">
            <span>
              <font-awesome :icon="['fab', 'discord']" />
              Discord
            </span>
            <small>{{ $t('home.discord', { count: discordUserCount }) }}</small>
          </a>
          <router-link to="/sponsor" class="resource">
            <span>
              <font-awesome icon="server" />
              {{ $t('home.partner.title') }}
            </span>
            <small>{{ $t('home.partner.description') }}</small>
          </router-link>
        </div>
      </section>
    </div>

    <div class="container selfhosted flex justify-center" v-else>
      <section class="resources w-1/2 [&>div]:w-full">
        <div>
          <div class="tools flex">
            <router-link to="/editor" alt="Web Editor" class="m-4 flex flex-1 flex-col items-center rounded-sm bg-grey p-8 text-center font-bold text-brand no-underline first:ml-0 last:mr-0 sm:text-xl">
              <font-awesome icon="edit" class="mb-4 text-[3rem] text-white opacity-50 sm:text-[4rem]" />
              {{ $t('links.editor') }}
            </router-link>
            <router-link to="/verbose" alt="Verbose Viewer" class="m-4 flex flex-1 flex-col items-center rounded-sm bg-grey p-8 text-center font-bold text-brand no-underline first:ml-0 last:mr-0 sm:text-xl">
              <font-awesome icon="comment-alt" class="mb-4 text-[3rem] text-white opacity-50 sm:text-[4rem]" />
              {{ $t('links.verbose') }}
            </router-link>
            <router-link to="/treeview" alt="Tree Viewer" class="m-4 flex flex-1 flex-col items-center rounded-sm bg-grey p-8 text-center font-bold text-brand no-underline first:ml-0 last:mr-0 sm:text-xl">
              <font-awesome icon="sitemap" class="mb-4 text-[3rem] text-white opacity-50 sm:text-[4rem]" />
              {{ $t('links.tree') }}
            </router-link>
          </div>
        </div>
      </section>
    </div>

  </main>
</template>

<script>
import { useHead } from '@unhead/vue';

export default {
  name: 'Home',

  setup() {
    useHead({
      title: 'LuckPerms',
      titleTemplate: null,
    });
  },

  data() {
    return {

    };
  },
  computed: {
    version() {
      return this.$store.getters.version;
    },
    config() {
      return this.$store.getters.config;
    },
    discordUserCount() {
      return this.$store.getters.discordUserCount;
    },
  },
};
</script>
