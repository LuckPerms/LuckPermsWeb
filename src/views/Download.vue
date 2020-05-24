<template>
  <main class="download">
    <section class="hero">
      <div class="container">
        <div>
          <h1>Download LuckPerms</h1>
          <p>
            Current version: {{ version }}
            <font-awesome icon="asterisk" :spin="true" v-if="!version" />
          </p>
        </div>
        <div>
          <button class="button" @click="openQuiz">
            <font-awesome icon="question-circle" />
            Not sure which type?
          </button>
        </div>
      </div>
    </section>

    <div class="container">
      <section class="resources">
        <div>
          <h2>Choose your server type</h2>
          <a :href="downloads.bukkit" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              Bukkit
            </span>
            <small>For CraftBukkit/Spigot/Paper etc, 1.8.8 or newer</small>
          </a>
          <a :href="downloads.bungee" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              BungeeCord
            </span>
            <small>For BungeeCord/Waterfall etc, use latest</small>
          </a>
          <a :href="downloads.sponge" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              Sponge
            </span>
            <small>For SpongeForge/SpongeVanilla, releases 5-8</small>
          </a>
          <a :href="downloads.nukkit" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              Nukkit
            </span>
            <small>For NukkitX, b93 or newer</small>
          </a>
          <a :href="downloads.velocity" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              Velocity
            </span>
            <small>For Velocity, 1.0 or newer</small>
          </a>
          <a :href="downloads['bukkit-legacy']" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              Bukkit Legacy
            </span>
            <small>For CraftBukkit/Spigot/Paper etc, 1.7.10</small>
          </a>
        </div>

        <div>
          <h2>How to install</h2>
          <ol>
            <li>Add the downloaded plugin <code>.jar</code> file into your server's
              <code>plugins</code> or <code>mods</code> folder.</li>
            <li>Start or restart your server - <strong>do not reload!</strong></li>
            <li>Locate the plugin's configuration file (usually found within
              <code>/plugins/LuckPerms/</code>) and adjust any settings to your liking.</li>
            <li>Start setting up your permissions! Check out the
              <router-link to="wiki/Usage">Getting Started</router-link> guide for more info.</li>
          </ol>
          <h2>Having trouble installing?</h2>
          <ul>
            <li>Make sure to check your console for any error messages - especially during start
              up</li>
            <li>Check the more detailed
              <router-link to="wiki/Installation">Installation</router-link> wiki page to see if you
              need to perform any additional steps.</li>
            <li>If all else fails, get in touch with us on
              <a href="https://discord.gg/luckperms" target="_blank">Discord</a>
              and we'll be happy to help.</li>
          </ul>
        </div>
      </section>
    </div>
    <section class="hero">
      <div class="container">
        <div>
          <h1>Extensions</h1>
          <p>Extensions can modify the behaviour of LuckPerms, you can read more about them
            <router-link to="/wiki/Extensions">on the wiki</router-link>
          </p>
        </div>
      </div>
    </section>
    <div class="container extensions">
      <section class="resources">
        <div>
          <a :href="extensions['extension-legacy-api']" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              Legacy API Extension
            </span>
            <small>LuckPerms 5.0 and above</small>
          </a>
        </div>

        <div>
          <p>Allows some common API methods to be used by plugins that haven't upgraded to v5
            version of the api yet.
          </p>
          <p>Check out the
            <router-link to="/wiki/Extensions#extension-legacy-api">wiki section</router-link>
            for more information!
          </p>
        </div>
      </section>
      <section class="resources">
        <div>
          <a :href="extensions['extension-default-assignments']" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              Default Assignments Extension
            </span>
            <small>LuckPerms 5.0 and above</small>
          </a>
        </div>

        <div>
          <p>Allows for other ways to make
            <router-link to="/wiki/Default-Groups">Default Groups</router-link>
            if the workarounds are not possible.
          </p>
          <p>Check out the <router-link to="/wiki/Extensions#extension-default-assignments">wiki
            section</router-link> for more information! See also
            <a href="/wiki/Default-Groups#configure-default-assignments">this section</a> about
            configuring default assignments!
          </p>
        </div>
      </section>
    </div>

    <transition name="fade">
      <Quiz v-if="quiz.open" :downloads="downloads" @close="quiz.open = false" />
    </transition>
  </main>
</template>

<script>
export default {
  name: 'Download',
  metaInfo: {
    title: 'Download',
  },
  components: {
    Quiz: () => import('../components/Download/Quiz'),
  },
  data() {
    return {
      quiz: {
        open: false,
      },
    };
  },
  computed: {
    extensions() { return this.$store.getters.extensions; },
    downloads() { return this.$store.getters.downloads; },
    version() { return this.$store.getters.version; },
  },
  methods: {
    openQuiz() {
      this.quiz.open = true;
    },

    closeQuiz() {
      this.quiz.open = false;
    },
  },
};
</script>

<style lang="scss">
  main.download {
    overflow-y: auto;

    .hero {
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 4rem;

        div {
          width: 100%;
        }

        @include breakpoint($sm) {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }
      }

      p {
        text-align: left;
        font-size: 1.5rem;

        @include breakpoint($md) {
          text-align: center;
        }
      }

      h1 {
        text-align: left;

        @include breakpoint($md) {
          text-align: center;
        }
      }

      button {
        margin-top: 2rem;

        @include breakpoint($sm) {
          margin: 0;
        }

        svg {
          opacity: .5;
          margin-right: 1rem;
        }
      }
    }

    .resource {
      display: flex;
      align-items: center;

      span {
        margin: 0 1rem 0 0;
        white-space: nowrap;
      }
    }

    .extensions section {
      margin-bottom: -8rem;

      @include breakpoint($xs) {
        &:first-child > div:not(:first-child) {
          margin-bottom: 4rem;
        }

        > div:not(:first-child) {
          padding-top: 0;
        }
      }
    }
  }
</style>
