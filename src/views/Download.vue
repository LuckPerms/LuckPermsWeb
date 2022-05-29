<template>
  <main class="download">
    <section class="hero">
      <div class="container">
        <h1>{{ $t("download.title") }}</h1>
        <div class="version">
          <p>
            <span>v{{ version }}</span>
          </p>
          <p>{{ $t("download.build", { time: relativeTimestamp }) }}</p>
          <font-awesome icon="asterisk" :spin="true" v-if="!version" />
        </div>
      </div>
    </section>

    <div class="container">
      <section class="resources">
        <div>
          <h2>{{ $t("download.typeChoose") }}</h2>
          <a :href="downloads.bukkit" v-on:click="logDownload('bukkit')" class="resource">
            <span>
              <img src="@/assets/logos/bukkit.png" alt="Bukkit" />
              Bukkit
            </span>
            <small>{{ $t("download.bukkit") }}</small>
          </a>
          <a :href="downloads.velocity" v-on:click="logDownload('velocity')" class="resource">
            <span>
              <img src="@/assets/logos/velocity.png" alt="Velocity" />
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
          <h2>{{ $t("download.changelog") }}</h2>
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
        </div>
      </section>
    </div>
    </div>
  </main>
</template>

<script>
import { relativeDate } from "@/util/date";

export default {
  name: "Download",
  metaInfo: {
    title: "Download",
  },
  components: {
    Quiz: () => import("../components/Download/Quiz"),
  },
  data() {
    return {
      quiz: {
        open: false,
      },
    };
  },
  computed: {
    extensions() {
      return this.$store.getters.extensions;
    },
    additionalPlugins() {
      return this.$store.getters.additionalPlugins;
    },
    placeholderExpansions() {
      return this.$store.getters.placeholderExpansions;
    },
    downloads() {
      return this.$store.getters.downloads;
    },
    version() {
      return this.$store.getters.version;
    },
    versionTimestamp() {
      return this.$store.getters.versionTimestamp;
    },
    relativeTimestamp() {
      if (this.versionTimestamp) {
        return relativeDate(this.versionTimestamp, this.$i18n.locale, new Date().getTime(), true);
      }
      return null;
    },
    changeLog() {
      return this.$store.getters.changeLog;
    },
  },
  methods: {
    logDownload(platform) {
      // eslint-disable-next-line no-undef
      plausible("Download", { props: { type: platform } });
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
      color: rgba(225, 255, 255, 0.5);

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
      margin-right: 0.75rem;
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
      background: lighten($grey, 10%);
    }

    svg {
      opacity: 0.5;
      margin-right: 1rem;
    }
  }

  .changelog {
    list-style: none;
    padding: 0;

    li {
      padding-bottom: 0.25rem;
      margin-bottom: 0.25rem;
      display: flex;
      justify-content: space-between;

      &:not(:last-child) {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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

      h1,
      p {
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
