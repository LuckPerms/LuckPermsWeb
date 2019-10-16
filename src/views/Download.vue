<template>
  <main class="download">
    <section class="hero">
      <h1>Download LuckPerms</h1>
      <p>
        Current version: {{ version }}
        <font-awesome icon="asterisk" :spin="true" v-if="!version" />
      </p>
      <button class="button">Not sure which version?</button>
    </section>
    <section class="resources">
      <div>
        <a :href="downloads.bukkit" class="resource">
          <span>
            <font-awesome icon="arrow-alt-circle-down" />
            CraftBukkit / Spigot / Paper
          </span>
          <small>Supporting versions 1.8.8 +</small>
        </a>
        <a :href="downloads.bungee" class="resource">
          <span>
            <font-awesome icon="arrow-alt-circle-down" />
            BungeeCord
          </span>
          <small>Supporting versions 1.8.8</small>
        </a>
        <a :href="downloads.sponge" class="resource">
          <span>
            <font-awesome icon="arrow-alt-circle-down" />
            Sponge
          </span>
          <small>Supporting SpongeAPI versions 5-8</small>
        </a>
        <a :href="downloads.nukkit" class="resource">
          <span>
            <font-awesome icon="arrow-alt-circle-down" />
            Nukkit
          </span>
          <small>Supporting NukkitX b93 +</small>
        </a>
        <a :href="downloads.velocity" class="resource">
          <span>
            <font-awesome icon="arrow-alt-circle-down" />
            Velocity
          </span>
          <small>Supporting version 1.0</small>
        </a>
        <a :href="downloads['bukkit-legacy']" class="resource">
          <span>
            <font-awesome icon="arrow-alt-circle-down" />
            Bukkit Legacy
          </span>
          <small>Supporting version 1.7.10</small>
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
          <li>Check the wiki to see if you missed any important steps during setup</li>
          <li>Delete the <code>libs</code> folder and restart the server to let it regenerate, sometimes this may fix the problem</li>
          <li>If all else fails, join our <a href="https://discord.gg/luckperms">Discord</a> to get some support</li>
        </ul>
      </div>
    </section>
  </main>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Download',
  data() {
    return {
      version: null,
      downloads: {
        bukkit: null,
        'bukkit-legacy': null,
        bungee: null,
        nukkit: null,
        sponge: null,
        velocity: null,
      }
    }
  },
  created() {
    this.getBuildData();
  },
  methods: {
    getBuildData() {
      axios.get('https://ci.lucko.me/job/LuckPerms/lastSuccessfulBuild/api/json?tree=url,artifacts[fileName,relativePath]')
        .then(response => {
          console.log(response.data);
          const filename = response.data.artifacts[0].fileName;
          this.version = filename.split('-').pop().slice(0, -4);

          response.data.artifacts.forEach(artifact => {
            const download = artifact.relativePath.split('/')[0];
            this.downloads[download] = response.data.url + 'artifact/' + artifact.relativePath;
          });
        })
        .catch(console.error);
    },
  }
};
</script>

<style lang="scss">
  main.download {
    overflow-y: auto;

    .hero {
      flex-direction: column;
      align-items: center;
      padding: 4rem;

      p {
        font-size: 1.5rem;
      }

      button {
        margin-top: 2rem;
      }
    }
  }
</style>
