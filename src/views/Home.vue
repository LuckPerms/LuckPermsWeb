<template>
  <main class="home">
    <section class="hero">
      <div class="logo">
        <img alt="Vue logo" src="../assets/logo.png">
        <div>
          <h1>LuckPerms</h1>
          <p>An advanced permissions plugin for Minecraft servers</p>
        </div>
      </div>

      <div class="download">
        <a href="">
          <span>
            <font-awesome icon="arrow-alt-circle-down" />
            Download
          </span>
          <small>
            Version: {{ version }}
            <font-awesome icon="asterisk" :spin="true" v-if="!version" />
          </small>
        </a>
        <small>
          Supports CraftBukkit, Spigot, Paper, BungeeCord, Sponge, Nukkit and Velocity servers
        </small>
      </div>
    </section>

    <section class="resources">
        <a href="https://github.com/lucko/LuckPerms/wiki">
          <span>
            <font-awesome icon="book" />
            Wiki
          </span>
          <small>Learn how to install, setup, configure and effectively use LuckPerms</small>
        </a>
        <a href="https://github.com/lucko/LuckPerms">
          <span>
            <font-awesome :icon="['fab', 'github']" />
            GitHub
          </span>
          <small>Browse the source code, report issues and contribute code</small>
        </a>
        <a href="https://discord.gg/luckperms">
          <span>
            <font-awesome :icon="['fab', 'discord']" />
            Discord
          </span>
          <small>Join {{ discordUserCount }} others to discuss the project and ask/answer questions</small>
        </a>
        <a href="https://patreon.com/luckdev">
          <span>
            <font-awesome :icon="['fab', 'patreon']" />
            Patreon
          </span>
          <small>Join {{ patreonCount }} others supporting the project on Patreon</small>
        </a>
    </section>
  </main>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Home',
  data() {
    return {
      version: null,
      discordUserCount: null,
      patreonCount: null,
    }
  },
  created() {
    this.getVersion();
    this.getDiscordUserCount();
    this.getPatreonCount();
  },
  methods: {
    getVersion() {
      axios.get('https://ci.lucko.me/job/LuckPerms/lastSuccessfulBuild/api/json?tree=url,artifacts[fileName,relativePath]')
        .then(response => {
          const filename = response.data.artifacts[0].fileName;
          this.version = filename.split('-').pop().slice(0, -4);
        })
        .catch(console.error);
    },
    getDiscordUserCount() {
      axios.get('https://discordapp.com/api/invites/luckperms?with_counts=true')
        .then(response => {
          this.discordUserCount = response.data.approximate_member_count;
        })
        .catch(console.error);
    },
    getPatreonCount() {
      axios.get('https://cors-anywhere.herokuapp.com/https://www.patreon.com/api/campaigns/2298876?include=patron_count&fields[campaign]=patron_count')
        .then(response => {
          this.patreonCount = response.data.data.attributes.patron_count;
        })
        .catch(console.error);
    },
  }
};
</script>

<style lang="scss">
  main.home {
    overflow-y: auto;

    .hero {
      background: black;
      display: flex;
      flex-wrap: wrap;

      @include breakpoint($md) {
        flex-wrap: nowrap;
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

      h1 {
        margin: 0 0 1rem;
        line-height: 1;
        font-size: 2em;

        @include breakpoint($md) {
          font-size: 3em;
        }
      }

      p {
        margin: 0;
        opacity: .5;
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

    .resources {
      display: flex;
      flex-direction: column;
      width: 100%;
      padding: 2rem;

      @include breakpoint($md) {
        width: 50%;
        padding: 4rem;
      }

      a {
        display: block;
        background: $grey;
        color: $brand-color;
        padding: 1.5rem;
        line-height: 1;
        text-decoration: none;
        border-radius: 2px;
        font-size: 1.5em;
        transition: background .2s;

        &:not(:last-child) {
          margin-bottom: 2rem;
        }

        &:hover {
          background: lighten($grey, 10%);
        }

        span {
          display: block;
          font-weight: bold;
          margin-bottom: .5rem;
        }

        svg {
          margin-right: .5rem;
          opacity: .5;
        }

        small {
          color: white;
          opacity: .4;
          font-size: 1rem;
        }
      }
    }
  }
</style>
