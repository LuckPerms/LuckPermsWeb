<template>
  <div id="app">
    <nav id="nav">
      <div>
        <router-link to="/" class="logo">
          <img alt="LuckPerms logo" src="@/assets/logo.svg">
          <span>LuckPerms</span>
        </router-link>
        <transition name="fade">
          <div v-if="!config.selfHosted && !isSponsorRoute" class="nav-message">
            <router-link to="/sponsor">
              <hr />
              <img src="@/assets/bisect.svg" alt="Bisect Hosting">
              <span v-html="$t('sponsor')" />
            </router-link>
          </div>
        </transition>
      </div>

      <ul :class="{ active: menu, 'top-level': true }">
        <template v-if="!config.selfHosted">
          <li>
            <router-link to="/download">
              <font-awesome icon="arrow-alt-circle-down" fixed-width />
              {{ $t('links.download') }}
            </router-link>
          </li>
        </template>
        <li>
          <span :class="{ 'router-link-active': isToolsRoute, tools: true }">
            <font-awesome icon="tools" fixed-width />
            {{ $t('links.tools.name') }}
          </span>
          <ul>
            <li>
              <router-link to="/editor">
                <font-awesome icon="edit" fixed-width />
                {{ $t('links.tools.editor') }}
              </router-link>
            </li>
            <li>
              <router-link to="/verbose">
                <font-awesome icon="comment-alt" fixed-width />
                {{ $t('links.tools.verbose') }}
              </router-link>
            </li>
            <li>
              <router-link to="/treeview">
                <font-awesome icon="sitemap" fixed-width />
                {{ $t('links.tools.tree') }}
              </router-link>
            </li>
          </ul>
        </li>
        <template v-if="!config.selfHosted">
          <li class="external overlap">
            <a href="https://github.com/LuckPerms/LuckPerms" target="_blank" class="github">
              <font-awesome :icon="['fab', 'github']" fixed-width />
              <span>GitHub</span>
            </a>
          </li>
          <li class="external">
            <a href="https://discord.gg/luckperms" target="_blank" class="discord">
              <font-awesome :icon="['fab', 'discord']" fixed-width />
              <span>Discord</span>
            </a>
          </li>
        </template>
        <li v-if="locale" @click="localeMenu = !localeMenu">
          <span class="locale">
            <font-awesome icon="language" fixed-width />
            <span class="locale-label">{{ $t('links.language') }}</span>
          </span>
          <ul :class="['locale-menu', { open: !!localeMenu }]">
            <li
              v-for="l in locales"
              :key="l.code" @click="setLocale(l.code)"
              :class="[{selected: l === locale}]"
            >
              <span>
                <span :class="['fi', 'fi-' + l.countryCode]" :alt="l.name" /> {{ l.name }}
              </span>
            </li>
          </ul>
        </li>
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
      <router-view/>
    </transition>

    <footer>
      <div class="footer">
        <ul>
          <li>
            <font-awesome icon="code-branch" fixed-width />
            <a href="https://github.com/LuckPerms/LuckPermsWeb" target="_blank">LuckPermsWeb</a>
            @
            <a :href="'https://github.com/LuckPerms/LuckPermsWeb/commit/' + commitHash" target="_blank">{{ commitHash }}</a>
          </li>
          <li>
            Copyright © 2017-{{ new Date().getFullYear().toString() }} LuckPerms contributors
          </li>
        </ul>
      </div>
    </footer>
  </div>
</template>

<script>
import { useHead } from '@unhead/vue';

export default {
  setup() {
    useHead({
      titleTemplate: '%s | LuckPerms',
      meta: [
        {
          property: 'og:title',
          content: 'LuckPerms',
        },
        {
          property: 'og:description',
          content: 'Website & online apps for the LuckPerms plugin.',
        },
        {
          property: 'og:type',
          content: 'product',
        },
        {
          property: 'og:image',
          content: 'https://luckperms.net/logo.png',
        },
        {
          property: 'og:url',
          content: 'https://luckperms.net/',
        },
        {
          property: 'og:site_name',
          content: 'LuckPerms - A permissions plugin for Minecraft servers.',
        },
      ],
    });
  },

  data() {
    return {
      menu: false,
      localeMenu: false,
    };
  },

  computed: {
    commitHash() {
      return process.env.VUE_APP_GIT_HASH;
    },
    locale() {
      return this.$store.getters.userLocale;
    },
    locales() {
      return this.$store.getters.supportedLanguages;
    },
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
    isSponsorRoute() {
      return this.$route.name === 'sponsor';
    },
  },

  created() {
    this.$store.dispatch('getAppData');
  },

  methods: {
    setLocale(locale) {
      this.$store.dispatch('setUserLocale', locale);
    },
  },

  watch: {
    $route() {
      this.menu = false;
    },
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}

:focus {
  outline: var(--color-brand) 1px solid;
}

input:focus {
  outline-offset: unset;
}

::-webkit-scrollbar {
  width: 0.5rem;
}
::-webkit-scrollbar-track {
  background: rgb(10, 10, 24);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.4);
}

html {
  height: 100%;
  font-size: 12px;
  scrollbar-color: hsla(0, 0%, 100%, 0.4) rgba(0, 0, 0, 0);
}
@media screen and (min-width: 992px) {
  html {
    font-size: 14px;
  }
}
@media screen and (min-width: 1400px) {
  html {
    font-size: 16px;
  }
}

body {
  margin: 0;
  height: 100vh;
  display: flex;
  overflow-x: hidden;
}

#app {
  font-family: "Source Sans Pro", "Open Sans", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #FFF;
  line-height: 1.5;
  background-color: #141422;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
}
#app > main {
  height: 100%;
  max-height: calc(100% - 6rem);
}
#app > footer {
  background: var(--color-grey);
  padding: 0.4em 1em;
  position: relative;
  font-size: 0.9em;
  flex: 0 0 auto;
  height: 2rem;
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);
}
#app > footer svg {
  color: #95b556;
}
#app > footer a {
  text-decoration: none;
}
#app > footer ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  justify-content: space-between;
}

#nav-menu-toggle {
  background: transparent;
  color: var(--color-brand);
  height: 3rem;
  width: 3rem;
  font-size: 2rem;
  border: 0;
}
@media screen and (min-width: 768px) {
  #nav-menu-toggle {
    display: none;
  }
}

#nav {
  padding: 0.5rem;
  z-index: 100;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: space-between;
  position: relative;
}
#nav > div {
  display: flex;
  align-items: center;
}
#nav > div > span {
  opacity: 0.5;
  margin-left: 0.5rem;
}
#nav .logo {
  height: 3rem;
  padding: 0.5rem;
  font-size: 1.7rem;
  display: flex;
  align-items: center;
  color: #FFF;
  text-decoration: none;
  transition: all 0.2s;
  font-weight: bold;
}
#nav .logo:hover {
  background: rgba(255, 255, 255, 0.1);
}
#nav .logo img {
  height: 100%;
  width: auto;
  margin-right: 0.5rem;
}
#nav hr {
  height: 2rem;
  margin: 0 1rem 0 0.5rem;
  border-color: var(--color-brand);
}
#nav .nav-message {
  max-width: 25rem;
  font-size: 0.9rem;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.66);
  transition: all 0.2s;
}
#nav .nav-message .new {
  color: var(--color-brand);
}
#nav .nav-message img {
  height: 2rem;
  margin-right: 0.5rem;
}
#nav .nav-message a {
  color: inherit;
  text-decoration: none;
  display: flex;
  align-items: center;
  font-size: 0.75rem;
}
#nav .nav-message:hover {
  color: rgba(255, 255, 255, 0.8);
}
#nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 4rem;
  transition: right 0.2s;
  flex-direction: column;
  background: black;
  right: -100%;
  width: 100%;
  max-width: 24rem;
  z-index: 100;
  overflow: hidden;
  overflow-y: scroll;
}
@media screen and (min-width: 768px) {
  #nav ul {
    flex-direction: row;
    position: relative;
    max-width: unset;
    width: auto;
    top: unset;
    right: unset;
    background: transparent;
    overflow: initial;
    overflow-y: initial;
  }
}
#nav ul.active {
  right: 0;
  display: initial;
  max-height: calc(100vh - 8rem);
}
@media screen and (max-width: 767px) {
  #nav ul.top-level:not(.active) {
    display: none;
  }
}
#nav ul li {
  display: flex;
  position: relative;
  flex-direction: column;
}
#nav ul li img {
  width: 1.5rem;
}
#nav ul li.overlap {
  z-index: 110;
}
@media screen and (min-width: 768px) {
  #nav ul li {
    flex-direction: row;
  }
}
#nav ul li:hover {
  background: rgba(255, 255, 255, 0.1);
}
#nav ul li a, #nav ul li span {
  color: var(--color-brand);
  display: flex;
  align-items: center;
  font-weight: bold;
  padding: 0.5em;
  text-decoration: none;
  text-transform: uppercase;
  transition: all 0.2s;
  cursor: pointer;
  width: 100%;
  font-size: 1.5rem;
}
@media screen and (min-width: 768px) {
  #nav ul li a, #nav ul li span {
    font-size: 1rem;
  }
}
@media screen and (min-width: 1400px) {
  #nav ul li a, #nav ul li span {
    padding: 0.5em 1rem;
  }
}
#nav ul li a.router-link-exact-active, #nav ul li span.router-link-exact-active {
  color: #FFF;
}
#nav ul li a.tools, #nav ul li span.tools {
  display: none;
}
@media screen and (min-width: 768px) {
  #nav ul li a.tools, #nav ul li span.tools {
    display: flex;
  }
}
#nav ul li a > svg, #nav ul li span > svg {
  margin-right: 0.5rem;
  opacity: 0.5;
}
#nav ul li .locale svg {
  margin-right: 0;
}
#nav ul li .locale + ul {
  display: none;
}
#nav ul li .locale + ul.open {
  display: flex;
}
#nav ul li .locale + ul .fi {
  width: 1.5rem;
  margin-right: 0.5rem;
  padding: 0;
}
#nav ul li .locale + ul li span {
  padding: 0.75rem 2rem;
  line-height: 1;
}
#nav ul li .locale + ul li.selected {
  background: rgba(255, 255, 255, 0.1);
}
@media screen and (min-width: 768px) {
  #nav ul li .locale + ul {
    width: 28rem;
    max-height: 50vh;
    overflow-y: scroll;
  }
  #nav ul li .locale + ul.open {
    display: none;
  }
  #nav ul li .locale + ul li span {
    padding: 0.5rem 1rem;
    line-height: 1;
  }
}
#nav ul li .locale .locale-label {
  padding: 0rem 0.75rem;
}
@media screen and (min-width: 768px) {
  #nav ul li .locale .locale-label {
    display: none;
  }
}
#nav ul li:not(:first-child) a.router-link-active, #nav ul li:not(:first-child) span.router-link-active {
  color: #FFF;
}
#nav ul li > ul {
  position: relative;
  top: unset;
  bottom: unset;
  right: unset;
}
@media screen and (min-width: 768px) {
  #nav ul li > ul {
    display: none;
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    flex-direction: column;
    min-width: 100%;
    background: var(--color-grey);
    z-index: 100;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
  }
  #nav ul li > ul li:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  #nav ul li > ul a {
    width: 100%;
  }
}
@media screen and (min-width: 768px) {
  #nav ul li:hover ul {
    display: flex;
  }
}
#nav ul li.external svg {
  margin-right: 0;
}
@media screen and (min-width: 768px) {
  #nav ul li.external svg {
    opacity: 1;
  }
}
#nav ul li.external a {
  padding: 0 0.5rem;
}
@media screen and (min-width: 768px) {
  #nav ul li.external a {
    font-size: 1.5rem;
  }
}
@media screen and (min-width: 1400px) {
  #nav ul li.external a {
    padding: 0.5rem 1rem;
  }
}
#nav ul li.external a.github {
  color: #FFF;
}
#nav ul li.external a.discord {
  color: #5865F2;
}
#nav ul li.external a span {
  color: inherit;
  padding-left: 0.5rem;
}
@media screen and (min-width: 768px) {
  #nav ul li.external a span {
    display: none;
  }
}

.vdp-datepicker .vdp-datepicker__calendar {
  background: var(--color-grey);
  border: 0;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.2);
}
.vdp-datepicker .vdp-datepicker__calendar header span.prev:after {
  border-right-color: white;
}
.vdp-datepicker .vdp-datepicker__calendar header span.next:after {
  border-left-color: white;
}
.vdp-datepicker .vdp-datepicker__calendar header span:not(.disabled):hover {
  background: rgba(255, 255, 255, 0.2);
}
.vdp-datepicker .vdp-datepicker__calendar .cell:not(.blank):not(.day-header):not(.disabled):hover {
  border-color: var(--color-brand);
}
.vdp-datepicker .vdp-datepicker__calendar .cell.selected {
  background: var(--color-brand);
}
.vdp-datepicker .vdp-datepicker__calendar .disabled {
  opacity: 0.3;
}
</style>
