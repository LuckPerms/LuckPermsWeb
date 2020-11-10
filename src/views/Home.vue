<template>
  <main class="home">
    <section class="hero">
      <div class="container">
        <div :class="{'logo': true, 'selfhosted': config.selfHosted }">
          <img alt="LuckPerms logo" src="../assets/logo.svg">
          <div>
            <h1>LuckPerms</h1>
            <p>A permissions plugin for Minecraft servers.</p>
          </div>
        </div>

        <div class="download" v-if="!config.selfHosted">
          <router-link to="/download">
          <span>
            <font-awesome icon="arrow-alt-circle-down" />
            Download
          </span>
            <small>
              v{{ version }}
              <font-awesome icon="asterisk" :spin="true" v-if="!version" />
            </small>
          </router-link>
          <small>
            Supports Bukkit/Spigot/Paper, BungeeCord, Sponge, Nukkit and Velocity servers
          </small>
        </div>
      </div>
    </section>

    <div class="container" v-if="!config.selfHosted">
      <section class="resources">
        <div>
          <h2>Why LuckPerms?</h2>
          <p>LuckPerms is a permissions plugin for Minecraft servers. It allows server admins to
            control what features players can use by creating groups and assigning permissions.</p>
          <p>It is:</p>
          <ul>
            <li><b>fast</b> - written with performance and scalability in mind.</li>
            <li><b>reliable</b> - trusted by thousands of server admins, and the largest of server
              networks.</li>
            <li><b>easy to use</b> - setup permissions using commands, directly in config files, or
              using the web editor.</li>
            <li><b>flexible</b> - supports a variety of data storage options, and works on lots of
              different server types.</li>
            <li><b>extensive</b> - a plethora of customization options and settings which can be
              changed to suit your server.</li>
            <li><b>free</b> - available for download and usage at no cost, and permissively licensed
              so it can remain free forever.</li>
          </ul>
          <p>For more information, see the wiki article on
            <router-link to="/wiki/Why-LuckPerms">Why LuckPerms?</router-link></p>

          <h2>Web Apps</h2>
          <p>This site hosts a number of extra web applications which work with the plugin.</p>
          <p>These applications are designed to work for all users, even those without the ability
            to install/host an application on their own web server.</p>
          <div class="tools">
            <router-link to="/editor" alt="Web Editor">
              <font-awesome icon="edit" />
              Web Editor
            </router-link>
            <router-link to="/verbose" alt="Verbose Viewer">
              <font-awesome icon="comment-alt" />
              Verbose Viewer
            </router-link>
            <router-link to="/treeview" alt="Tree Viewer">
              <font-awesome icon="sitemap" />
              Tree Viewer
            </router-link>
          </div>
        </div>
        <div>
          <a href="/wiki" class="resource">
            <span>
              <font-awesome icon="book" />
              Wiki
            </span>
            <small>Learn how to install, setup, configure and effectively use LuckPerms</small>
          </a>
          <a href="https://github.com/lucko/LuckPerms" class="resource">
            <span>
              <font-awesome :icon="['fab', 'github']" />
              GitHub
            </span>
            <small>Browse the source code, report issues and contribute to the project</small>
          </a>
          <a href="https://discord.gg/luckperms" class="resource">
            <span>
              <font-awesome :icon="['fab', 'discord']" />
              Discord
            </span>
            <small>Join {{ discordUserCount }} others to discuss the project and ask/answer
              questions</small>
          </a>
          <a href="https://patreon.com/luckdev" class="resource">
            <span>
              <font-awesome :icon="['fab', 'patreon']" />
              Patreon
            </span>
            <small>Join {{ patreonCount }} others supporting the project on Patreon</small>
          </a>
        </div>
      </section>
    </div>

    <div class="container selfhosted" v-else>
      <section class="resources">
        <div>
          <div class="tools">
            <router-link to="/editor" alt="Web Editor">
              <font-awesome icon="edit" />
              Web Editor
            </router-link>
            <router-link to="/verbose" alt="Verbose Viewer">
              <font-awesome icon="comment-alt" />
              Verbose Viewer
            </router-link>
            <router-link to="/treeview" alt="Tree Viewer">
              <font-awesome icon="sitemap" />
              Tree Viewer
            </router-link>
          </div>
        </div>
      </section>
    </div>

  </main>
</template>

<script>
export default {
  name: 'Home',

  metaInfo: {
    title: 'LuckPerms',
    titleTemplate: null,
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
    patreonCount() {
      return this.$store.getters.patreonCount;
    },
  },
};
</script>

<style lang="scss">
  main.home {
    overflow-y: auto;

    .container {
      display: flex;

      &.selfhosted {
        justify-content: center;

        .resources {
          width: 50%;

          div {
            width: 100%;
          }
        }
      }
    }

    .logo {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      font-size: 1.5em;
      width: 100%;
      text-align: center;

      @include breakpoint($md) {
        padding: 4rem;
        width: 66%;
        flex-direction: row;
        text-align: left;
        justify-content: flex-start;

        div {
          max-width: 35rem;
        }
      }

      img {
        height: 13rem;
        width: auto;
        margin-bottom: 2rem;

        @include breakpoint($md) {
          margin-bottom: 0;
          margin-right: 2rem;
        }
      }

      &.selfhosted {
        justify-content: center;
        width: 100%;
      }
    }

    .download {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding-bottom: 4rem;

      @include breakpoint($md) {
        padding: 4rem;
        align-items: flex-end;
        width: 34%;
      }

      a {
        background: $brand-color;
        color: $navy;
        font-size: 1.5em;
        padding: 1rem 2rem;
        text-align: center;
        line-height: 1;
        text-decoration: none;
        border-radius: 2px;
        transition: background .2s;

        @include breakpoint($md) {
          font-size: 2em;
          margin-top: 2.5rem;
        }

        &:hover {
          background: lighten($brand-color, 10%);
        }

        span {
          display: block;
          font-weight: bold;

          svg {
            margin-right: .5rem;
            opacity: .5;
          }
        }

        small {
          font-size: 1rem;
          opacity: .75;

          @include breakpoint($md) {
            font-size: 1.25rem;
          }
        }
      }

      > small {
        max-width: 18rem;
        text-align: center;
        opacity: .5;
        margin-top: 1rem;

        @include breakpoint($md) {
          text-align: right;
        }
      }
    }
  }

  .tools {
    display: flex;

    a {
      background: $grey;
      color: $brand-color;
      font: inherit;
      font-weight: bold;
      flex: 1;
      margin: 1rem;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: 2px;
      text-decoration: none;
      text-align: center;

      @include breakpoint($sm) {
        font-size: 1.25rem;
      }

      svg {
        font-size: 3rem;
        display: block;
        opacity: .5;
        color: #FFF;
        margin-bottom: 1rem;

        @include breakpoint($sm) {
          font-size: 4rem;
        }
      }

      &:first-child {
        margin-left: 0;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
</style>
