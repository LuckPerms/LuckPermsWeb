<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/editor">Editor</router-link>
    </div> -->

    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>

    <footer>
      <div class="footer">
        <a href="https://github.com/lucko/LuckPermsWeb" class="github-corner">
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

<style lang="scss">
* {
  box-sizing: border-box;
}

:focus {
  outline: lawngreen 1px solid;
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
    max-height: calc(100% - 2.5rem);
  }

  > footer {
    background: #2d2d38;
    padding: .75em 1em;
    position: relative;
    font-size: .8em;
    flex: 0 0 auto;
    height: 2.5rem;

    .github-corner {
      position: absolute;
      border: 0;
      bottom: 100%;
      left: 0;
      transform: scale(-1, -1);

      svg {
        path {
          color: #141422;
          fill: #2d2d38;
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

    a {
      color: #8B8;

      &:hover {
        color: #4B4;
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
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
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

code, .code {
  border: 0;
  display: inline-block;
  font-family: 'Source Code Pro', monospace;
  padding: .2em .5em;
  background: rgba(0,0,0,.2);
  font-size: .8em;
  border-radius: 2px;
  line-height: 1.5;
}

.vdp-datepicker {
  .vdp-datepicker__calendar {
    background: #2d2d38;
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
            border-color: lawngreen;
          }
        }
      }

      &.selected {
        background: lawngreen;
      }
    }

    .disabled {
      opacity: .3;
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
