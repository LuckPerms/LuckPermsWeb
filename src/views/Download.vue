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
            :href="downloads.fabric"
            v-on:click="logDownload('fabric')"
            class="resource"
          >
            <span>
              <img src="@/assets/logos/fabric.png" alt="Fabric">
              Fabric
            </span>
            <small>{{ $t('download.fabric', { version: '1.21.11' }) }}</small>
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
            <small>{{ $t('download.neoforge', { version: '1.21.11' }) }}</small>
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
            <small>{{ $t('download.forge', { version: '1.21.11' }) }}</small>
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
            <i18n path="download.install.setup" tag="li">
              <template #wiki>
                <router-link to="wiki/Usage">{{ $t('download.install.wiki') }}</router-link>
              </template>
            </i18n>
          </ol>
          <h2>{{ $t('download.trouble.title') }}</h2>
          <ul>
            <li v-html="$t('download.trouble.console')" />
            <i18n path="download.trouble.read" tag="li">
              <template #wiki>
                <router-link to="wiki/Installation">{{ $t('download.trouble.wiki') }}</router-link>
              </template>
            </i18n>
            <i18n path="download.trouble.support" tag="li">
              <template #discord>
                  <a href="https://discord.gg/luckperms" target="_blank">Discord</a>
              </template>
            </i18n>
          </ul>
        </div>
      </section>
    </div>
    <section class="hero extensions">
      <div class="container">
        <div>
          <h1>{{ $t('download.extensions.title') }}</h1>
          <i18n path="download.extensions.description" tag="p">
            <template #wiki>
              <router-link to="/wiki/Extensions">{{ $t('download.extensions.descriptionWiki') }}</router-link>
            </template>
          </i18n>
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
            <i18n path="download.extensions.more" tag="p">
              <template #wikiSection>
                <router-link to="/wiki/Extensions#extension-legacy-api">{{ $t('download.extensions.wikiSection') }}</router-link>
              </template>
            </i18n>
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
            <i18n path="download.extensions.defaultAssignmentsInfo" tag="p">
              <template #defaultGroups>
                <router-link to="/wiki/Default-Groups">{{ $t('download.extensions.defaultGroups') }}</router-link>
              </template>
            </i18n>
            <i18n
              path="download.extensions.more"
              tag="p"
            >
              <template #wikiSection>
                <router-link to="/wiki/Extensions#extension-default-assignments">{{ $t('download.extensions.wikiSection') }}</router-link>
              </template>
            </i18n>
          </div>
        </div>
      </section>
    </div>
    <section class="hero additional-plugins">
      <div class="container">
        <div>
          <h1>{{ $t('download.additionalPlugins.title') }}</h1>
          <p>{{ $t('download.additionalPlugins.description') }}</p>
        </div>
      </div>
    </section>
    <div class="container additional-plugins">
      <section class="resources">
        <div>
          <a :href="additionalPlugins['extracontexts']" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              {{ $t('download.additionalPlugins.extraContexts') }}
            </span>
            <small>{{ $t('download.additionalPlugins.version') }}</small>
          </a>
          <div>
            <p>{{ $t('download.additionalPlugins.extraContextsInfo') }}</p>
          </div>
        </div>
      </section>
    </div>
    <section class="hero placeholder-expansions">
      <div class="container">
        <div>
          <h1>{{ $t('download.placeholderExpansions.title') }}</h1>
          <i18n
            path="download.placeholderExpansions.description"
            tag="p"
          >
            <template #placeholders>
              <router-link to="/wiki/Placeholders#placeholders">{{ $t('download.placeholderExpansions.placeholders') }}</router-link>
            </template>
          </i18n>
        </div>
      </div>
    </section>
    <div class="container placeholder-expansions">
      <section class="resources">
        <div>
          <a :href="placeholderExpansions['bukkit-placeholderapi']" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              {{ $t('download.placeholderExpansions.placeholderApi') }}
            </span>
            <small>{{ $t('download.placeholderExpansions.version') }}</small>
          </a>
          <div>
            <i18n
              path="download.placeholderExpansions.placeholderApiInfo"
              tag="p"
            >
              <template #command>
                <code>/papi ecloud download LuckPerms</code>
              </template>
              <template #installingManually>
                <router-link to="/wiki/Placeholders#placeholderapi">{{ $t('download.placeholderExpansions.placeholderApiInstallingManually') }}</router-link>
              </template>
            </i18n>
          </div>
        </div>
        <div>
          <a :href="placeholderExpansions['bukkit-mvdw']" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              {{ $t('download.placeholderExpansions.mvdwPlaceholderApi') }}
            </span>
            <small>{{ $t('download.placeholderExpansions.version') }}</small>
          </a>
          <div>
            <i18n
              path="download.placeholderExpansions.mvdwPlaceholderApiInfo"
              tag="p"
            >
              <template #plugins>
                <code>/plugins/</code>
              </template>
            </i18n>
          </div>
        </div>
        <div>
          <a :href="placeholderExpansions['fabric-placeholderapi']" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              Fabric PlaceholderAPI
            </span>
            <small>LuckPerms 5.0 and above, Fabric only</small>
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
import { relativeDate } from '@/util/date';

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

      .version {
        line-height: 1.2;
      }

      h1 {
        text-align: center;

        @include breakpoint($md) {
          text-align: left;
        }
      }

      p {
        text-align: center;
        font-size: 1.5rem;
        opacity: 1;
        color: rgba(225, 255, 255, .5);

        @include breakpoint($md) {
          text-align: right;
        }
      }

      span {
        color: $brand_color;
        font-weight: bold;
        font-size: 2.2em;
      }
    }

    .resource {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 1.25rem 1.5rem;

      @include breakpoint($md) {
        flex-direction: row;
        align-items: center;
      }

      span {
        margin: 0 1rem 0 0;
        white-space: nowrap;
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      small {
        margin-top: 1rem;

        @include breakpoint($md) {
          margin: 0;
        }
      }

      img {
        margin-right: .75rem;
        width: 1.5em;
        filter: saturate(20%);
      }

      &:hover img {
        filter: none;
      }
    }

    .button {
      color: $brand-color;
      background-color: $grey;

      &:hover {
        background: color.adjust($grey, $lightness: 10%);
      }

      svg {
        opacity: .5;
        margin-right: 1rem;
      }
    }

    .changelog {
      list-style: none;
      padding: 0;

      li {
        padding-bottom: .25rem;
        margin-bottom: .25rem;
        display: flex;
        justify-content: space-between;

        &:not(:last-child) {
          border-bottom: 1px solid rgba(255, 255, 255, .1);
        }

        > span {
          display: flex;
        }

        .title {
          margin: 0 1rem;
        }

        .time {
          flex-shrink: 0;
        }
      }
    }

    .extensions,
    .additional-plugins,
    .placeholder-expansions {
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

    .additional-plugins {
      section {
        justify-content: center;
      }
    }
  }
</style>
