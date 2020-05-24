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
            Not sure which version?
          </button>
        </div>
      </div>
    </section>

    <div class="container">
      <section class="resources">
        <div>
          <h2>Choose your version</h2>
          <a :href="downloads.bukkit" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              Bukkit
            </span>
            <small>Versions 1.8.8 and above</small>
          </a>
          <a :href="downloads.bungee" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              BungeeCord
            </span>
            <small>Versions 1.8.8 and above (or 1.7.10 if using Travertine)</small>
          </a>
          <a :href="downloads.sponge" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              Sponge
            </span>
            <small>SpongeAPI versions 5-8</small>
          </a>
          <a :href="downloads.nukkit" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              Nukkit
            </span>
            <small>Version NukkitX b93 and above</small>
          </a>
          <a :href="downloads.velocity" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              Velocity
            </span>
            <small>Version 1.0</small>
          </a>
          <a :href="downloads['bukkit-legacy']" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              Bukkit Legacy
            </span>
            <small>Version 1.7.10</small>
          </a>
        </div>

        <div>
          <h2>How to install:</h2>
          <ol>
            <li>Place the downloaded <code>.jar</code> file into your server's <code>plugins</code>
              or <code>mods</code> folder</li>
            <li>Start or restart your server - <strong>do not reload!</strong></li>
            <li>Check your <code>plugins</code> or <code>config</code> folder for a
              <code>LuckPerms</code> or <code>luckperms</code> folder - see the tips below if the
              folder doesn't generate</li>
            <li>Open the <code>config.yml</code> or <code>luckperms.conf</code> file in your
              favourite text editor and adjust any settings to your liking</li>
          </ol>
          <h2>Having trouble installing?</h2>
          <ul>
            <li>Make sure to check your console for any errors - especially during start up</li>
            <li>Check the <router-link to="/wiki">wiki</router-link> to see if you missed any
              important steps during setup</li>
            <li>Delete the <code>libs</code> folder and restart the server to let it regenerate,
              sometimes this may fix the problem</li>
            <li>If all else fails, join our
              <a href="https://discord.gg/luckperms" target="_blank">Discord</a>
              to get some support</li>
          </ul>
        </div>
      </section>
    </div>
    <section class="hero extensions">
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
          <div>
            <p>Allows some common API methods to be used by plugins that haven't upgraded to v5
              version of the api yet.
            </p>
            <p>Check out the
              <router-link to="/wiki/Extensions#extension-legacy-api">wiki section</router-link>
              for more information!
            </p>
          </div>
        </div>
        <div>
          <a :href="extensions['extension-default-assignments']" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              Default Assignments Extension
            </span>
            <small>LuckPerms 5.0 and above</small>
          </a>
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

        @include breakpoint($md) {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }
      }

      p {
        text-align: center;
        font-size: 1.5rem;

        @include breakpoint($md) {
          text-align: left;
        }
      }

      h1 {
        text-align: center;

        @include breakpoint($md) {
          text-align: left;
        }
      }

      button {
        margin-top: 2rem;

        @include breakpoint($md) {
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
      flex-direction: column;
      align-items: flex-start;

      @include breakpoint($md) {
        flex-direction: row;
        align-items: center;
      }

      span {
        margin: 0 1rem 0 0;
        white-space: nowrap;
      }

      small {
        margin-top: 1rem;

        @include breakpoint($md) {
          margin: 0;
        }
      }
    }

    .extensions {
      &.hero {
        .container {
          justify-content: center;
        }

        h1, p {
          text-align: center;
        }
      }

      .resources {
        > div {
          + div {
            padding-top: 0;

            @include breakpoint($md) {
              padding-top: 4rem;
            }
          }
        }
      }
    }
  }
</style>
