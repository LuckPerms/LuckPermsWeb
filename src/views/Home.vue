<template>
  <main class="home">
    <section class="hero">
      <div class="logo">
        <img alt="LuckPerms logo" src="../assets/logo.png">
        <div>
          <h1>LuckPerms</h1>
          <p>An advanced permissions plugin for Minecraft servers</p>
        </div>
      </div>

      <div class="download">
        <router-link to="/download">
          <span>
            <font-awesome icon="arrow-alt-circle-down" />
            Download
          </span>
          <small>
            Version: {{ version }}
            <font-awesome icon="asterisk" :spin="true" v-if="!version" />
          </small>
        </router-link>
        <small>
          Supports CraftBukkit, Spigot, Paper, BungeeCord, Sponge, Nukkit and Velocity servers
        </small>
      </div>
    </section>

    <section class="resources">
      <div>
        <h2>Why LuckPerms?</h2>
        <p>LuckPerms is an advanced permissions implementation aiming to be a fast, reliable and flexible alternative to existing permission plugins. The project's main goals are centered around high performance and a wide feature set, filling the gaps of functionality and building upon existing features found in other plugins. LuckPerms also includes an extensive API for developers, and support for a variety of Minecraft server software & data storage options.</p>
      </div>
      <div>
        <a href="https://github.com/lucko/LuckPerms/wiki" class="resource">
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
          <small>Join {{ discordUserCount }} others to discuss the project and ask/answer questions</small>
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
  </main>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Home',
  data() {
    return {

    };
  },
  computed: {
    version() {
      return this.$store.getters.version;
    },
    discordUserCount () {
      return this.$store.getters.discordUserCount;
    },
    patreonCount() {
      return this.$store.getters.patreonCount;
    }
  },
};
</script>

<style lang="scss">
  main.home {
    overflow-y: auto;

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

        div {
          max-width: 35rem;
        }
      }

      img {
        margin-bottom: 2rem;

        @include breakpoint($md) {
          margin-bottom: 0;
          margin-right: 2rem;
        }
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
        padding: 4rem 0;
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
      }
    }
  }
</style>
