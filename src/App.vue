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
        <li>
          <router-link to="/">
            <font-awesome icon="home" fixed-width />
            {{ $t('links.home') }}
          </router-link>
        </li>
        <template v-if="!config.selfHosted">
          <li>
            <router-link to="/download">
              <font-awesome icon="arrow-alt-circle-down" fixed-width />
              {{ $t('links.download') }}
            </router-link>
          </li>
          <li class="overlap">
            <router-link to="/wiki">
              <font-awesome icon="book" fixed-width />
              {{ $t('wiki') }}
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
            <router-link v-if="!config.selfHosted" to="/wiki/Credits" target="_blank">
              Copyright © 2017-{{ new Date().getFullYear().toString() }} LuckPerms contributors
            </router-link>
            <a v-else href="https://luckperms.net/wiki/Credits" target="_blank">
              Copyright © 2017-{{ new Date().getFullYear().toString() }} LuckPerms contributors
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
  },

  data() {
    return {
      menu: false,
    };
  },

  computed: {
    commitHash() {
      return process.env.VUE_APP_GIT_HASH;
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

  watch: {
    $route() {
      this.menu = false;
    },
  },
};
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
  width: .5rem;

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
  font-size: 12px;
  scrollbar-color: hsla(0, 0%, 100%, .4) rgba(0, 0, 0, 0%);

  @include breakpoint($md) {
    font-size: 14px;
  }

  @include breakpoint($lg) {
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
  }

  > footer {
    background: $grey;
    padding: .4em 1em;
    position: relative;
    font-size: .9em;
    flex: 0 0 auto;
    height: 2rem;
    box-shadow: 0 0 1rem rgba(0,0,0,0.2);

    svg {
      color: #95b556;
    }

    a {
      text-decoration: none;
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

#nav-menu-toggle {
  background: transparent;
  color: $brand-color;
  height: 3rem;
  width: 3rem;
  font-size: 2rem;
  border: 0;

  @include breakpoint($sm) {
    display: none;
  }
}

#nav {
  padding: .5rem;
  z-index: 100;
  box-shadow: 0 0 0.5rem rgba(0,0,0,.25);
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

  .logo {
    height: 3rem;
    padding: .5rem;
    font-size: 1.7rem;
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

  hr {
    height: 2rem;
    margin: 0 1rem 0 .5rem;
    border-color: $brand-color;
  }

  .nav-message {
    max-width: 25rem;
    font-size: .9rem;
    line-height: 1.2;
    color: rgba(255,255,255,.66);
    transition: all .2s;

    .new {
      color: $brand-color;
    }

    img {
      height: 2rem;
      margin-right: .5rem;
    }

    a {
      color: inherit;
      text-decoration: none;
      display: flex;
      align-items: center;
      font-size: .8rem;
    }

    &:hover {
      color: rgba(255,255,255,.8);
    }
  }

  ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    position: absolute;
    top: 4rem;
    transition: right .2s;
    flex-direction: column;
    background: black;
    right: -100%;
    width: 100%;
    max-width: 20rem;
    bottom: 0;
    z-index: 100;

    @include breakpoint($sm) {
      flex-direction: row;
      position: relative;
      max-width: unset;
      width: auto;
      top: unset;
      right: unset;
      background: transparent;
    }

    &.active {
      right: 0;
      display: initial;
    }

    &.top-level:not(.active) {
      @include breakpoint($xs) {
        display: none;
      }
    }

    li {
      display: flex;
      position: relative;
      flex-direction: column;

      &.overlap {
        z-index: 110;
      }

      @include breakpoint($sm) {
        flex-direction: row;
      }

      &:hover {
        background: rgba(255,255,255,.1);
      }

      a, span {
        color: $brand-color;
        display: flex;
        align-items: center;
        font-weight: bold;
        padding: .5em 1em;
        text-decoration: none;
        text-transform: uppercase;
        transition: all .2s;
        cursor: pointer;
        width: 100%;
        font-size: 1.5rem;

        @include breakpoint($sm) {
          font-size: 1rem;
        }

        &.router-link-exact-active {
          color: #FFF;
        }

        &.tools {
          display: none;

          @include breakpoint($sm) {
            display: flex;
          }
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
        }
      }

      > ul {
        position: relative;
        top: unset;
        bottom: unset;
        right: unset;

        @include breakpoint($sm) {
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
      }

      @include breakpoint($sm) {
        &:hover {
          ul {
            display: flex;
          }
        }
      }

      &.external {
        svg {
          margin-right: 0;

          @include breakpoint($sm) {
            opacity: 1;
          }
        }

        a {
          padding: 0 1rem;

          @include breakpoint($sm) {
            padding: .5rem 1rem;
            font-size: 1.5rem;
          }

          &.github {
            color: #FFF;
          }

          &.discord {
            color: #5865F2;
          }

          span {
            color: inherit;
            padding-left: .5rem;

            @include breakpoint($sm) {
              display: none;
            }
          }
        }
      }
    }
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
