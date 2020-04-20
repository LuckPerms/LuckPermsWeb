<template>
  <main class="download">
    <section class="hero">
      <h1>
        <font-awesome icon="arrow-alt-circle-down" />
        <span>Download LuckPerms</span>
      </h1>
      <p>
        Current version: {{ version }}
        <font-awesome icon="asterisk" :spin="true" v-if="!version" />
      </p>
      <button class="button" @click="openQuiz">
        <font-awesome icon="question-circle" />
        Not sure which version?
      </button>
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
            <li>Place the downloaded <code>.jar</code> file into your server's <code>plugins</code> or <code>mods</code> folder</li>
            <li>Start or restart your server - <strong>do not reload!</strong></li>
            <li>Check your <code>plugins</code> or <code>mods</code> folder for a <code>LuckPerms</code> folder - see the tips below if the folder doesn't generate</li>
            <li>Open the <code>config</code> file in your favourite text editor and adjust any settings to your liking</li>
          </ol>
          <h2>Having trouble installing?</h2>
          <ul>
            <li>Make sure to check your console for any errors - especially during start up</li>
            <li>Check the <a href="/wiki" target="_blank">wiki</a> to see if you missed any important steps during setup</li>
            <li>Delete the <code>libs</code> folder and restart the server to let it regenerate, sometimes this may fix the problem</li>
            <li>If all else fails, join our <a href="https://discord.gg/luckperms" target="_blank">Discord</a> to get some support</li>
          </ul>
        </div>
      </section>
    </div>
    <section class="hero">
      <h1>Extensions</h1>
    </section>
    <div class="container extensions-description" >
      <div class="resources">
				<div>
					<p>Extensions can modify the behaviour of LuckPerms, you can read more about them <router-link to="/wiki/Extensions">on the wiki</router-link></p>
				</div>
      </div>
    </div>
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
          <p>Allows some common API methods to be used by plugins that haven't upgraded to v5 version of the api yet.</p>
          <p>Check out the <router-link to="/wiki/Extensions#extension-legacy-api">wiki section</router-link> for more information!</p>
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
					<p>Allows for other ways to make <router-link to="/wiki/Default-Groups">Default Groups</router-link> if the workarounds are not possible.</p>
          <p>Check out the <router-link to="/wiki/Extensions#extension-default-assignments">wiki section</router-link> for more information! See also <a href="/wiki/Default-Groups#configure-default-assignments">this section</a> about configuring default assignments!</p>
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
    extensions() { return this.$store.getters.extensions },
    downloads() { return this.$store.getters.downloads },
    version() { return this.$store.getters.version }
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
      flex-direction: column;
      align-items: center;
      padding: 4rem;

      h1 {
        position: relative;

        svg {
          position: absolute;
          color: $brand-color;
          top: -1.5rem;
          left: -4rem;
          font-size: 6rem;
          z-index: 1;
          opacity: .5;
        }

        span {
          position: relative;
          z-index: 2;
        }
      }

      p {
        font-size: 1.5rem;
      }

      button {
        margin-top: 2rem;

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
		}
		
		.extensions-description {
			margin-bottom: -8rem;
		
			.resources > div {
				width: 100%;
				
				p {
					text-align: center;
					font-size: 1.5rem;
				}
			}
		}
  }
</style>
