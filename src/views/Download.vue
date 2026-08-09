<template>
  <main class="download">
    <section class="hero">
      <div class="container">
          <h1>{{ $t('download.title') }}</h1>
        <div class="version">
          <p><span>v{{ version }}</span></p>
          <p>{{ $t('download.build', { time: relativeTimestamp }) }}</p>
          <font-awesome icon="asterisk" :spin="true" v-if="!version" />
        </div>
      </div>
    </section>

    <div class="container">
      <section class="resources">
        <div>
          <h2>{{ $t('download.typeChoose') }}</h2>
          <a
            :href="downloads.bukkit"
            v-on:click="logDownload('bukkit')"
            class="resource"
          >
            <span>
              <img src="@/assets/logos/bukkit.png" alt="Bukkit">
              Bukkit
            </span>
            <small>{{ $t('download.bukkit', { version: '1.8.8 - 1.21.x' }) }}</small>
          </a>
          <a
            :href="downloads.fabric"
            v-on:click="logDownload('fabric')"
            class="resource"
          >
            <span>
              <img src="@/assets/logos/fabric.png" alt="Fabric">
              Fabric
            </span>
            <small>{{ $t('download.fabric', { version: '26.2' }) }}</small>
          </a>
          <a
            :href="downloads.neoforge"
            v-on:click="logDownload('neoforge')"
            class="resource"
          >
            <span>
              <img src="@/assets/logos/neoforge.png" alt="NeoForge">
              NeoForge
            </span>
            <small>{{ $t('download.neoforge', { version: '26.2' }) }}</small>
          </a>
          <a
            :href="downloads.forge"
            v-on:click="logDownload('forge')"
            class="resource"
          >
            <span>
              <img src="@/assets/logos/forge.png" alt="Forge">
              Forge
            </span>
            <small>{{ $t('download.forge', { version: '26.2' }) }}</small>
          </a>
          <a
            :href="downloads.hytale"
            v-on:click="logDownload('hytale')"
            class="resource"
          >
            <span>
              <img src="@/assets/logos/hytale.png" alt="Hytale">
              Hytale
            </span>
            <small>{{ $t('download.hytale', { version: 'beta' }) }}</small>
          </a>
          <a
            :href="downloads.velocity"
            v-on:click="logDownload('velocity')"
            class="resource"
          >
            <span>
              <img src="@/assets/logos/velocity.png" alt="Velocity">
              Velocity
            </span>
            <small>{{ $t('download.velocity', { version: '3.x' }) }}</small>
          </a>
          <a
            :href="downloads.sponge"
            v-on:click="logDownload('sponge')"
            class="resource"
          >
            <span>
              <img src="@/assets/logos/sponge.png" alt="Sponge">
              Sponge
            </span>
            <small>{{ $t('download.sponge', { version: 'API 12' }) }}</small>
          </a>
          <a
            :href="downloads.nukkit"
            v-on:click="logDownload('nukkit')"
            class="resource"
          >
            <span>
              <img src="@/assets/logos/nukkit.png" alt="Nukkit">
              Nukkit
            </span>
            <small>{{ $t('download.nukkit') }}</small>
          </a>
          <a
            :href="downloads.bungee"
            v-on:click="logDownload('bungee')"
            class="resource"
          >
            <span>
              <img src="@/assets/logos/bungeecord.png" alt="BungeeCord">
              BungeeCord
            </span>
            <small>{{ $t('download.bungee') }}</small>
          </a>
          <a
            :href="downloads['bukkit-legacy']"
            v-on:click="logDownload('bukkit-legacy')"
            class="resource"
          >
            <span>
              <img src="@/assets/logos/bukkit.png" alt="Bukkit">
              Bukkit Legacy
            </span>
            <small>{{ $t('download.bukkitLegacy') }}</small>
          </a>
          <button class="button" @click="openQuiz">
            <font-awesome icon="question-circle" />
            {{ $t('download.typeHelp') }}
          </button>
        </div>

        <div>
          <h2>{{ $t('download.changelog') }}</h2>
          <ul class="changelog">
            <li v-for="entry in changeLog" :key="entry.version">
              <span>
                <a
                  :href="`https://github.com/LuckPerms/LuckPerms/commit/${entry.commit}`"
                  target="_blank"
                >
                  <code>v{{ entry.version }}</code>
                </a>
                <span class="title">{{ entry.title }}</span>
              </span>
              <span class="time lighter">{{ relativeDate(entry.timestamp) }}</span>
            </li>
          </ul>
          <h2>{{ $t('download.install.title') }}</h2>
          <ol>
            <li v-html="$t('download.install.add')" />
            <li v-html="$t('download.install.restart')" />
            <li v-html="$t('download.install.config')" />
            <i18n-t keypath="download.install.setup" tag="li">
              <template #wiki>
                <a href="https://luckperms.net/wiki/Usage" target="_blank">
                  {{ $t('download.install.wiki') }}
                </a>
              </template>
            </i18n-t>
          </ol>
          <h2>{{ $t('download.trouble.title') }}</h2>
          <ul>
            <li v-html="$t('download.trouble.console')" />
            <i18n-t keypath="download.trouble.read" tag="li">
              <template #wiki>
                <a href="https://luckperms.net/wiki/Installation" target="_blank">
                  {{ $t('download.trouble.wiki') }}
                </a>
              </template>
            </i18n-t>
            <i18n-t keypath="download.trouble.support" tag="li">
              <template #discord>
                  <a href="https://discord.gg/luckperms" target="_blank">Discord</a>
              </template>
            </i18n-t>
          </ul>
        </div>
      </section>
    </div>
    <section class="hero extensions">
      <div class="container">
        <div>
          <h1>{{ $t('download.extensions.title') }}</h1>
          <i18n-t keypath="download.extensions.description" tag="p">
            <template #wiki>
              <a href="https://luckperms.net/wiki/Extensions" target="_blank">
                {{ $t('download.extensions.descriptionWiki') }}
              </a>
            </template>
          </i18n-t>
        </div>
      </div>
    </section>
    <div class="container extensions">
      <section class="resources">
        <div>
          <a
            :href="extensions['extension-legacy-api']"
            v-on:click="logDownload('extension-legacy-api')"
            class="resource"
          >
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              {{ $t('download.extensions.legacy') }}
            </span>
            <small>{{ $t('download.extensions.version') }}</small>
          </a>
          <div>
            <p>{{ $t('download.extensions.legacyInfo') }}</p>
          </div>
        </div>
        <div>
          <a
            :href="extensions['extension-default-assignments']"
            v-on:click="logDownload('extension-default-assignments')"
            class="resource"
          >
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              {{ $t('download.extensions.defaultAssignments') }}
            </span>
            <small>{{ $t('download.extensions.version') }}</small>
          </a>
          <div>
            <i18n-t keypath="download.extensions.defaultAssignmentsInfo" tag="p">
              <template #wiki>
                <a href="https://luckperms.net/wiki/Default-Groups" target="_blank">
                  {{ $t('download.extensions.groups') }}
                </a>
              </template>
            </i18n-t>
          </div>
        </div>
      </section>
    </div>
    <section class="hero additional-plugins">
      <div class="container">
        <div>
          <h1>Additional Plugins</h1>
          <p>
            Additional plugins can provide more complex features,
            but may not be available on all platforms
          .
          </p>
        </div>
      </div>
    </section>
    <div class="container additional-plugins">
      <section class="resources">
        <div>
          <a :href="additionalPlugins['extracontexts']" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              ExtraContexts Plugin
            </span>
            <small>LuckPerms 5.0 and above, Bukkit only</small>
          </a>
          <div>
            <p>Add more contexts, including some for other plugins</p>
          </div>
        </div>
      </section>
    </div>
    <section class="hero placeholder-expansions">
      <div class="container">
        <div>
          <h1>Placeholder Expansions</h1>
          <p>
            LuckPerms adds placeholders to PlaceholderAPI and MVdWPlaceholderAPI
          .
          </p>
        </div>
      </div>
    </section>
    <div class="container placeholder-expansions">
      <section class="resources">
        <div>
          <a :href="placeholderExpansions['bukkit-placeholderapi']" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              PlaceholderAPI
            </span>
            <small>Bukkit only</small>
          </a>
          <div>
            <p>
              Install using either
              <code>/papi ecloud download LuckPerms</code>.
            </p>
          </div>
        </div>
        <div>
          <a :href="placeholderExpansions['bukkit-mvdw']" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              MVdWPlaceholderAPI
            </span>
            <small>Bukkit only</small>
          </a>
          <div>
            <p>Place the JAR file in your <code>/plugins/</code> folder.</p>
          </div>
        </div>
        <div>
          <a :href="placeholderExpansions['fabric-placeholderapi']" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              Fabric PlaceholderAPI
            </span>
            <small>Fabric for MC 1.21.11, not needed on newer versions</small>
          </a>
          <div>
            <p>Place the JAR file in your <code>/mods/</code> folder.</p>
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
import { useHead } from '@unhead/vue';
import { relativeDate } from '@/util/date';

export default {
  name: 'Download',
  setup() {
    useHead({
      title: 'Download',
    });
  },
  components: {
    Quiz: () => import('../components/Download/Quiz.vue'),
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
    additionalPlugins() { return this.$store.getters.additionalPlugins; },
    placeholderExpansions() { return this.$store.getters.placeholderExpansions; },
    downloads() { return this.$store.getters.downloads; },
    version() { return this.$store.getters.version; },
    versionTimestamp() { return this.$store.getters.versionTimestamp; },
    relativeTimestamp() {
      if (this.versionTimestamp) {
        return relativeDate(this.versionTimestamp, this.$i18n.locale, new Date().getTime(), true);
      }
      return null;
    },
    changeLog() { return this.$store.getters.changeLog; },
  },
  methods: {
    logDownload(platform) {
      // eslint-disable-next-line no-undef
      plausible('Download', { props: { type: platform } });
    },
    openQuiz() {
      this.quiz.open = true;
    },
    closeQuiz() {
      this.quiz.open = false;
    },
    relativeDate(value) {
      return relativeDate(value, this.$i18n.locale);
    },
  },
};
</script>

<style>
main.download {
  overflow-y: auto;
}
main.download .hero .container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem;
}
@media screen and (min-width: 992px) {
  main.download .hero .container {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
main.download .hero .version {
  line-height: 1.2;
}
main.download .hero h1 {
  text-align: center;
}
@media screen and (min-width: 992px) {
  main.download .hero h1 {
    text-align: left;
  }
}
main.download .hero p {
  text-align: center;
  font-size: 1.5rem;
  opacity: 1;
  color: rgba(225, 255, 255, 0.5);
}
@media screen and (min-width: 992px) {
  main.download .hero p {
    text-align: right;
  }
}
main.download .hero span {
  color: var(--color-brand);
  font-weight: bold;
  font-size: 2.2em;
}
main.download .resource {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.25rem 1.5rem;
}
@media screen and (min-width: 992px) {
  main.download .resource {
    flex-direction: row;
    align-items: center;
  }
}
main.download .resource span {
  margin: 0 1rem 0 0;
  white-space: nowrap;
  display: flex;
  flex-direction: row;
  align-items: center;
}
main.download .resource small {
  margin-top: 1rem;
}
@media screen and (min-width: 992px) {
  main.download .resource small {
    margin: 0;
  }
}
main.download .resource img {
  margin-right: 0.75rem;
  width: 1.5em;
  filter: saturate(20%);
}
main.download .resource:hover img {
  filter: none;
}
main.download .button {
  color: var(--color-brand);
  background-color: var(--color-grey);
}
main.download .button:hover {
  background: rgb(26.5579499126%, 26.5579499126%, 33.0498932246%);
}
main.download .button svg {
  opacity: 0.5;
  margin-right: 1rem;
}
main.download .changelog {
  list-style: none;
  padding: 0;
}
main.download .changelog li {
  padding-bottom: 0.25rem;
  margin-bottom: 0.25rem;
  display: flex;
  justify-content: space-between;
}
main.download .changelog li:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
main.download .changelog li > span {
  display: flex;
}
main.download .changelog li .title {
  margin: 0 1rem;
}
main.download .changelog li .time {
  flex-shrink: 0;
}
main.download .extensions.hero .container,
main.download .additional-plugins.hero .container,
main.download .placeholder-expansions.hero .container {
  justify-content: center;
}
main.download .extensions.hero h1, main.download .extensions.hero p,
main.download .additional-plugins.hero h1,
main.download .additional-plugins.hero p,
main.download .placeholder-expansions.hero h1,
main.download .placeholder-expansions.hero p {
  text-align: center;
}
main.download .extensions .resources > div + div,
main.download .additional-plugins .resources > div + div,
main.download .placeholder-expansions .resources > div + div {
  padding-top: 0;
}
@media screen and (min-width: 992px) {
  main.download .extensions .resources > div + div,
  main.download .additional-plugins .resources > div + div,
  main.download .placeholder-expansions .resources > div + div {
    padding-top: 4rem;
  }
}
main.download .additional-plugins section {
  justify-content: center;
}
</style>
