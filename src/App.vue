<template>
  <div id="app">
    <div id="nav">
      <div class="container">
        <div>
          <router-link to="/" class="logo">
            <img alt="LuckPerms logo" src="@/assets/logo.png">
            <span>LuckPerms</span>
          </router-link>
          <div v-if="config.navMessage" class="nav-message">
            <a :href="config.navUrl" v-if="config.navUrl" target="_blank">
              {{ config.navMessage }}
            </a>
            <span v-else>
               {{ config.navMessage }}
            </span>
          </div>
        </div>

        <ul :class="{ active: menu, 'top-level': true }">
          <li>
            <router-link to="/">
              <font-awesome icon="home" fixed-width />
              Home
            </router-link>
          </li>
          <template v-if="!config.selfHosted">
            <li>
              <router-link to="/download">
                <font-awesome icon="arrow-alt-circle-down" fixed-width />
                Download
              </router-link>
            </li>
            <li>
              <router-link to="/wiki">
                <font-awesome icon="book" fixed-width />
                Wiki
              </router-link>
            </li>
          </template>
          <li>
            <span :class="{ 'router-link-active': isToolsRoute, tools: true }">
              <font-awesome icon="tools" fixed-width />
              Tools
            </span>
            <ul>
              <li>
                <router-link to="/editor">
                  <font-awesome icon="edit" fixed-width />
                  Editor
                </router-link>
              </li>
              <li>
                <router-link to="/verbose">
                  <font-awesome icon="comment-alt" fixed-width />
                  Verbose
                </router-link>
              </li>
              <li>
                <router-link to="/tree">
                  <font-awesome icon="sitemap" fixed-width />
                  Tree
                </router-link>
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
            <path
              d="M128.3 109c-14.5-9.3-9.3-19.4-9.3-19.4 3-6.9 1.5-11 1.5-11-1.3-6.6 2.9-2.3
             2.9-2.3 3.9 4.6 2.1 11 2.1 11-2.6 10.3 5.1 14.6 8.9 15.9"
              style="transform-origin:130px 106px"
              class="octo-arm"
            ></path>
            <path
              d="M115 115c-.1.1 3.7 1.5 4.8.4l13.9-13.8c3.2-2.4 6.2-3.2 8.5-3-8.4-10.6-14.7-24.2
               1.6-40.6 4.7-4.6 10.2-6.8 15.9-7 .6-1.6 3.5-7.4 11.7-10.9 0 0 4.7 2.4 7.4 16.1
                4.3 2.4 8.4 5.6 12.1 9.2 3.6 3.6 6.8 7.8 9.2 12.2 13.7 2.6 16.2 7.3 16.2 7.3-3.6
                 8.2-9.4 11.1-10.9 11.7-.3 5.8-2.4 11.2-7.1 15.9-16.4 16.4-30 10-40.6 1.6.2 2.8-1
                  6.8-5 10.8l-11.7 11.6c-1.2 1.2.6 5.4.8 5.3z"
              class="octo-body"
            ></path>
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

  created() {
    this.$store.dispatch('getAppData');
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

  .nav-message {
    margin-left: 1rem;
    opacity: .5;
    max-width: 25rem;

    a {
      color: inherit;
      text-decoration: none;
    }

    &:hover {
      opacity: .75;
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
      color: gold;
      
      @include breakpoint($xs) {
        display: none;
      }
    }

    li {
      display: flex;
      position: relative;
      flex-direction: column;

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
        padding: .5rem 1rem;
        text-decoration: none;
        text-transform: uppercase;
        transition: all .2s;
        cursor: pointer;
        width: 100%;
        font-size: 1.25rem;

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
            color: #7289DA;
          }

          &.patreon {
            color: #f96854;
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
