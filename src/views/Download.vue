<template>
  <main class="download">
    <section class="hero">
      <div class="container">
        <div>
          <h1>{{ $t('download.title') }}</h1>
        </div>
        <div class="version">
          <p><span>v{{ version }}</span></p>
          <p>Latest, built {{ relativeTimestamp }}</p>
          <font-awesome icon="asterisk" :spin="true" v-if="!version" />
        </div>
      </div>
    </section>

    <div class="container">
      <section class="resources">
        <div>
          <h2>{{ $t('download.typeChoose') }}</h2>
          <a :href="downloads.bukkit" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              Bukkit
            </span>
            <small>{{ $t('download.bukkit') }}</small>
          </a>
          <a :href="downloads.bungee" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              BungeeCord
            </span>
            <small>{{ $t('download.bungee') }}</small>
          </a>
          <a :href="downloads.sponge" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              Sponge
            </span>
            <small>{{ $t('download.sponge') }}</small>
          </a>
          <a :href="downloads.nukkit" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              Nukkit
            </span>
            <small>{{ $t('download.nukkit') }}</small>
          </a>
          <a :href="downloads.velocity" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              Velocity
            </span>
            <small>{{ $t('download.velocity') }}</small>
          </a>
          <a :href="downloads['bukkit-legacy']" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
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
                <a :href="`https://github.com/lucko/LuckPerms/commit/${entry.commit}`" target="_blank">
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
              <template v-slot:wiki>
                <router-link to="wiki/Usage">
                  {{ $t('download.install.wiki') }}
                </router-link>
              </template>
            </i18n>
          </ol>
          <h2>{{ $t('download.trouble.title') }}</h2>
          <ul>
            <li v-html="$t('download.trouble.console')" />
            <i18n path="download.trouble.read" tag="li">
              <template v-slot:wiki>
                <router-link to="wiki/Installation">
                  {{ $t('download.trouble.wiki') }}
                </router-link>
              </template>
            </i18n>
            <i18n path="download.trouble.support" tag="li">
              <template v-slot:discord>
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
            <template v-slot:wiki>
              <router-link to="/wiki/Extensions">
                {{ $t('download.extensions.descriptionWiki') }}
              </router-link>
            </template>
          </i18n>
        </div>
      </div>
    </section>
    <div class="container extensions">
      <section class="resources">
        <div>
          <a :href="extensions['extension-legacy-api']" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              {{ $t('download.extensions.legacy') }}
            </span>
            <small>{{ $t('download.extensions.version') }}</small>
          </a>
          <div>
            <p>{{ $t('download.extensions.legacyInfo') }}</p>
            <i18n path="download.extensions.more" tag="p">
              <template v-slot:wiki>
                <router-link to="/wiki/Extensions#extension-legacy-api">
                  {{ $t('download.extensions.wiki') }}
                </router-link>
              </template>
            </i18n>
          </div>
        </div>
        <div>
          <a :href="extensions['extension-default-assignments']" class="resource">
            <span>
              <font-awesome icon="arrow-alt-circle-down" />
              {{ $t('download.extensions.defaultAssignments') }}
            </span>
            <small>{{ $t('download.extensions.version') }}</small>
          </a>
          <div>
            <i18n path="download.extensions.defaultAssignmentsInfo" tag="p">
              <template v-slot:wiki>
                <router-link to="/wiki/Default-Groups">
                  {{ $t('download.extensions.groups') }}
                </router-link>
              </template>
            </i18n>
            <p>Check out the <router-link to="/wiki/Extensions#extension-default-assignments">wiki
              section</router-link> for more information. See also
              <a href="/wiki/Default-Groups#configure-default-assignments">this section</a> about
              configuring default assignments.
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
    downloads() { return this.$store.getters.downloads; },
    version() { return this.$store.getters.version; },
    versionTimestamp() { return this.$store.getters.versionTimestamp; },
    relativeTimestamp() {
      if (this.versionTimestamp) return relativeDate(this.versionTimestamp, new Date().getTime(), true);
      return null;
    },
    changeLog() { return this.$store.getters.changeLog; },
  },
  methods: {
    openQuiz() {
      this.quiz.open = true;
    },
    closeQuiz() {
      this.quiz.open = false;
    },
    relativeDate(value) {
      return relativeDate(value);
    }
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

    .button {
      color: $brand-color;
      background-color: $grey;

      &:hover {
        background: lighten($grey, 10%);
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
