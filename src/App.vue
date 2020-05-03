<template>
  <div id="app">
    <div id="nav">
      <div class="container">
        <div>
          <router-link to="/" class="logo">
            <img alt="LuckPerms logo" src="@/assets/logo.png">
            <span>LuckPerms</span>
          </router-link>
        </div>

        <ul>
          <li>
            <router-link to="/" :class="{ 'router-link-exact-active': this.$route.path === '/' }">
              <font-awesome icon="home" />
              {{ $t('nav.home') }}
            </router-link>
          </li>
          <li v-if="!config.selfHosted">
			      <router-link to="/download">
              <font-awesome icon="arrow-alt-circle-down" />
              {{ $t('nav.download') }}
            </router-link>
          </li>
          <li v-if="!config.selfHosted">
			      <router-link to="/wiki">
              <font-awesome icon="book" />
              {{ $t('nav.wiki') }}
            </router-link>
          </li>
          <li>
            <span :class="{ 'router-link-active': isToolsRoute }">
              <font-awesome icon="tools"/>
              {{ $t('nav.tools') }}
            </span>
            <ul>
              <li>
                <router-link to="/editor">
                  <font-awesome icon="edit" fixed-width />
                  {{ $t('nav.editor') }}
                </router-link>
              </li>
              <li>
                <router-link to="/verbose">
                  <font-awesome icon="comment-alt" fixed-width />
                  {{ $t('nav.verbose') }}
                </router-link>
              </li>
              <li>
                <router-link to="/tree">
                  <font-awesome icon="sitemap" fixed-width />
                  {{ $t('nav.tree') }}
                </router-link>
              </li>
            </ul>
          </li>
          <li>
            <span>
              <font-awesome icon="language" />
              {{ $t('nav.languages') }}
            </span>
            <ul>
              <li>
                <router-link :to="this.$route.path" :class="getLanguageSwitchClass('de')" @click.native="setLocale('de')">
                  <country-flag country='de' />
                  Deutsch
                </router-link>
              </li>

              <li>
                <router-link :to="this.$route.path" :class="getLanguageSwitchClass('en')" @click.native="setLocale('en')">
                  <country-flag country='us' />
                  English
                </router-link>
              </li>
            </ul>
          </li>
          <li class="external" v-if="!config.selfHosted">
            <a href="https://github.com/lucko/LuckPerms" target="_blank" class="github">
              <font-awesome  :icon="['fab', 'github']" />
            </a>
          </li>
          <li class="external" v-if="!config.selfHosted">
            <a href="https://discord.gg/luckperms" target="_blank" class="discord">
              <font-awesome  :icon="['fab', 'discord']" />
            </a>
          </li>
          <li class="external" v-if="!config.selfHosted">
            <a href="https://patreon.com/luckdev" target="_blank" class="patreon">
              <font-awesome  :icon="['fab', 'patreon']" />
            </a>
          </li>
        </ul>
      </div>
    </div>

    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>

    <footer>
      <div class="footer">
        <a href="https://github.com/lucko/LuckPermsWeb" target="_blank" class="github-corner">
          <svg width="60" height="60" viewBox="0 0 250 250">
            <path d="M0 0l115 115h15l12 27 108 108v-250z"></path>
            <path d="M128.3 109c-14.5-9.3-9.3-19.4-9.3-19.4 3-6.9 1.5-11 1.5-11-1.3-6.6 2.9-2.3 2.9-2.3 3.9 4.6 2.1 11 2.1 11-2.6 10.3 5.1 14.6 8.9 15.9" style="transform-origin:130px 106px" class="octo-arm"></path>
            <path d="M115 115c-.1.1 3.7 1.5 4.8.4l13.9-13.8c3.2-2.4 6.2-3.2 8.5-3-8.4-10.6-14.7-24.2 1.6-40.6 4.7-4.6 10.2-6.8 15.9-7 .6-1.6 3.5-7.4 11.7-10.9 0 0 4.7 2.4 7.4 16.1 4.3 2.4 8.4 5.6 12.1 9.2 3.6 3.6 6.8 7.8 9.2 12.2 13.7 2.6 16.2 7.3 16.2 7.3-3.6 8.2-9.4 11.1-10.9 11.7-.3 5.8-2.4 11.2-7.1 15.9-16.4 16.4-30 10-40.6 1.6.2 2.8-1 6.8-5 10.8l-11.7 11.6c-1.2 1.2.6 5.4.8 5.3z" class="octo-body"></path>
          </svg>
        </a>
        <ul>
          <li>
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
    computed: {
      version() {
        return this.$store.getters.version;
      },
      isToolsRoute() {
        return [
          'editor',
          'editor-home',
          'verbose',
          'verbose-home',
          'tree',
          'tree-home'
        ].includes(this.$route.name);
      },
      config() { return this.$store.getters.config; }
    },
    created() {
      this.$store.dispatch('getAppData');

      if (this.$route.path === '/' && this.$route.query.lang) this.$i18n.locale = this.$route.query.lang;
      else {
        const unwatch = this.$watch(
          () => this.$route,
          (route, prevRoute) => {
            if (route.query.lang) this.$i18n.locale = route.query.lang;
            unwatch();
          }
        );
      }
    },
    methods: {
      getLanguageSwitchClass(lang) {
        return { 'not-active-lang': this.$i18n.locale !== lang };
      },
      setLocale(locale) {
        this.$i18n.locale = locale;
      }
    }
  }
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

:focus {
  outline: $brand-color 1px solid;
}

input:focus {
  outline-offset: unset;
}

::-webkit-scrollbar {
  width: .5em;

  &-track {
    background: rgb(10, 10, 24);
    border-left: 1px solid rgba(255,255,255,.1);
  }

  &-thumb {
    background: rgba(255, 255, 255, .4);
  }
}

html {
  height: 100%;
}

body {
  margin: 0;
  height: 100vh;
  display: flex;
}

#app {
  font-family: 'Source Sans Pro', 'Open Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #FFF;
  line-height: 1.5;
  background-color: #141422;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;

  > main {
    height: 100%;
    max-height: calc(100% - 6rem);

    @include breakpoint($md) {
      max-height: calc(100% - 6.5rem);
    }
  }

  > footer {
    background: $grey;
    padding: .75em 1em;
    position: relative;
    font-size: .66em;
    flex: 0 0 auto;
    height: 2rem;
    box-shadow: 0 0 1rem rgba(0,0,0,0.2);

    @include breakpoint($md) {
      height: 2.5rem;
      font-size: .8rem;
    }

    .github-corner {
      position: absolute;
      border: 0;
      bottom: 100%;
      left: 0;
      transform: scale(-1, -1);

      svg {
        path {
          color: #141422;
          fill: $grey;
          transition: color 140ms ease-out, fill 140ms ease-out;

          &.octo-arm, &.octo-body {
            fill: #141422;
          }
        }
      }

      &:hover {
        svg {
          path {
            color: #8B8;

            &.octo-arm, &.octo-body {
              fill: #8B8;
            }
          }
        }

        .octo-arm {
          animation: octocat-wave 560ms ease-in-out;
        }
      }
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
      justify-content: space-between;
    }
  }
}

#nav {
  padding: .5rem;
  z-index: 50;
  box-shadow: 0 0 0.5rem rgba(0,0,0,.25);

  .container {
    display: flex;
    justify-content: space-between;

    > div {
      display: flex;
      align-items: center;

      > span {
        opacity: .5;
        margin-left: .5rem;
      }
    }
  }

  .logo {
    height: 3rem;
    padding: .5rem;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    color: #FFF;
    text-decoration: none;
    transition: all .2s;
    font-weight: bold;

    &:hover {
      background: rgba(255,255,255,.1);
    }

    img {
      height: 100%;
      width: auto;
      margin-right: .5rem;
    }
  }

  ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      display: flex;
      position: relative;

      &:hover {
        background: rgba(255,255,255,.1);
      }

      a, span {
        color: $brand-color;
        display: flex;
        align-items: center;
        font-weight: bold;
        padding: .5em 1rem;
        text-decoration: none;
        text-transform: uppercase;
        transition: all .2s;
        cursor: pointer;

        &.router-link-exact-active {
          color: #FFF;
        }

        svg {
          margin-right: .5rem;
          opacity: .5;
        }
      }

      &:not(:first-child) {
        a, span {
          &.router-link-active {
            color: #FFF;
          }

          &.not-active-lang {
            color: $brand-color;
          }
        }
      }

      > ul {
        display: none;
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        flex-direction: column;
        min-width: 100%;
        background: $grey;
        z-index: 100;
        box-shadow: 0 .5rem 1rem rgba(0,0,0,.2);

        li {
          &:hover {
            background: rgba(255,255,255,.1);
          }
        }

        a {
          width: 100%;
        }
      }

      &:hover {
        ul {
          display: flex;
        }
      }

      &.external {
        svg {
          margin-right: 0;
          opacity: 1;
        }

        a {
          padding: 0 1rem;
          font-size: 1.5rem;

          &.github {
            color: #FFF;
          }

          &.discord {
            color: #7289DA;
          }

          &.patreon {
            color: #f96854;
          }
        }
      }
    }
  }
}

@keyframes octocat-wave {
  0%, 100%{
    transform: rotate(0);
  }

  20%, 60% {
    transform: rotate(-25deg);
  }

  40%, 80% {
    transform: rotate(10deg);
  }
}

.vdp-datepicker {
  .vdp-datepicker__calendar {
    background: $grey;
    border: 0;
    box-shadow: 0 0 1em rgba(0,0,0,.2);

    header {
      span {
        &.prev {
          &:after {
            border-right-color: white;
          }
        }

        &.next {
          &:after {
            border-left-color: white;
          }
        }

        &:not(.disabled):hover {
          background: rgba(255,255,255,.2);
        }
      }
    }

    .cell {
      &:not(.blank):not(.day-header) {
        &:not(.disabled) {
          &:hover {
            border-color: $brand-color;
          }
        }
      }

      &.selected {
        background: $brand-color;
      }
    }

    .disabled {
      opacity: .3;
    }
  }
}
</style>
