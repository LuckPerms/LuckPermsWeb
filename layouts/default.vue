<template>
  <div id="app">
    <nav id="nav">
      <div>
        <nuxt-link to="/" class="logo">
          <img alt="LuckPerms logo" src="@/assets/logo.png">
          <span>LuckPerms</span>
        </nuxt-link>
        <div v-if="!config.selfHosted" class="nav-message">
          <a href="https://bisecthosting.com/luck" target="_blank">
            <img src="@/assets/bisect.svg" alt="Bisect Hosting">
            <span>
              Proudly sponsored by
              <strong>BisectHosting</strong><br/>
              Use code <code>luck</code> for 25% off!
            </span>
          </a>
        </div>
      </div>

      <ul :class="{ active: menu, 'top-level': true }">
        <li>
          <nuxt-link to="/">
            <font-awesome icon="home" fixed-width />
            Home
          </nuxt-link>
        </li>
        <template v-if="!config.selfHosted">
          <li>
            <nuxt-link to="/download">
              <font-awesome icon="arrow-alt-circle-down" fixed-width />
              Download
            </nuxt-link>
          </li>
          <li>
            <nuxt-link to="/wiki">
              <font-awesome icon="book" fixed-width />
              Wiki
            </nuxt-link>
          </li>
        </template>
        <li>
          <span :class="{ 'nuxt-link-active': isToolsRoute, tools: true }">
            <font-awesome icon="tools" fixed-width />
            Tools
          </span>
          <ul>
            <li>
              <nuxt-link to="/editor">
                <font-awesome icon="edit" fixed-width />
                Editor
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/verbose">
                <font-awesome icon="comment-alt" fixed-width />
                Verbose
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/treeview">
                <font-awesome icon="sitemap" fixed-width />
                Tree
              </nuxt-link>
            </li>
          </ul>
        </li>
        <template v-if="!config.selfHosted">
          <li class="external">
            <a href="https://github.com/lucko/LuckPerms" target="_blank" class="github">
              <font-awesome :icon="['fab', 'github']" fixed-width />
              <span>Github</span>
            </a>
          </li>
          <li class="external">
            <a href="https://discord.gg/luckperms" target="_blank" class="discord">
              <font-awesome :icon="['fab', 'discord']" fixed-width />
              <span>Discord</span>
            </a>
          </li>
          <li class="external">
            <a href="https://patreon.com/luckdev" target="_blank" class="patreon">
              <font-awesome :icon="['fab', 'patreon']" fixed-width />
              <span>Patreon</span>
            </a>
          </li>
        </template>
      </ul>

      <button
        id="nav-menu-toggle"
        @click="menu = !menu"
      >
        <font-awesome icon="bars" />
      </button>

      <transition name="fade">
        <div
          id="nav-focus"
          class="overlay-focus"
          v-if="menu"
          @click="menu = !menu"
        ></div>
      </transition>
    </nav>

    <transition name="fade" mode="out-in">
      <nuxt />
    </transition>

    <footer>
      <div class="footer">
        <ul>
          <li>
            <font-awesome icon="code-branch" fixed-width />
            <a href="https://github.com/lucko" target="_blank">lucko</a>
            /
            <a href="https://github.com/lucko/LuckPermsWeb" target="_blank">LuckPermsWeb</a>
          </li>
          <li>
            <a href="https://github.com/lucko/LuckPermsWeb/blob/master/LICENSE.txt" target="_blank">
              Copyright © 2017-{{new Date().getFullYear().toString()}} LuckPerms contributors
            </a>
          </li>
        </ul>
      </div>
    </footer>
  </div>
</template>

<script>
  export default {
    metaInfo: {
      titleTemplate: '%s | LuckPerms',
      meta: [
        {
          property: 'og:title',
          content: 'LuckPerms',
        },
        {
          property: 'og:description',
          content: 'Resources, useful links and the latest downloads for LuckPerms',
        },
        {
          property: 'og:type',
          content: 'product',
        },
        {
          property: 'og:image',
          content: 'https://luckperms.github.io/assets/logo/720px.png',
        },
        {
          property: 'og:url',
          content: 'https://luckperms.net',
        },
        {
          property: 'og:site_name',
          content: 'LuckPerms',
        },
      ],
    },

    data() {
      return {
        menu: false,
      };
    },

    computed: {
      version() {
        return this.$store.getters.version;
      },
      config() {
        return this.$store.getters.config;
      },
      isToolsRoute() {
        return [
          'editor',
          'editor-home',
          'verbose',
          'verbose-home',
          'tree',
          'tree-home',
        ].includes(this.$route.name);
      },
    },

    methods: {
      fetchData() {
        return this.$store.dispatch('getAppData');
      }
    },

    serverPrefetch() {
      return this.fetchData();
    },

    watch: {
      $route() {
        this.menu = false;
      },
    },
  };
</script>

<style lang="scss">
  @import '../assets/scss/common';
</style>
