<template>
  <main id="wiki" class="wiki container">
    <article id="article">
      <div id="wiki-locale-notification" v-if="showLocaleWarning">
        {{ $t("wikiLocaleWarning") }}
        <button @click="acknowledgeWikiWarning">
          <font-awesome icon="check" />
        </button>
      </div>
      <router-view />
    </article>
    <aside>
      <h1>{{ $t("wiki") }}</h1>
      <sidebar />
    </aside>
  </main>
</template>

<script>
// eslint-disable-next-line import/no-unresolved
import Sidebar from "../wiki/pages/_Sidebar.md";

export default {
  metaInfo: {
    titleTemplate: "%s | Wiki | LuckPerms",
  },
  components: {
    Sidebar,
  },
  data() {
    return {
      wikiWarningAcknowledged: !!JSON.parse(localStorage.getItem("wikiWarningAcknowledged")),
    };
  },
  computed: {
    locale() {
      return this.$store.getters.userLocale;
    },
    showLocaleWarning() {
      if (!this.locale || this.locale.code === "en") {
        return false;
      }

      return !this.wikiWarningAcknowledged;
    },
  },
  mounted() {
    if (window.innerWidth >= 922) return;
    const wiki = document.getElementById("wiki");
    document.querySelectorAll(".wiki aside a").forEach((link) => {
      link.addEventListener("click", () => {
        wiki.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    });
  },
  methods: {
    acknowledgeWikiWarning() {
      this.wikiWarningAcknowledged = true;
      localStorage.setItem("wikiWarningAcknowledged", JSON.stringify(true));
    },
  },
};
</script>

<style lang="scss">
.wiki {
  display: flex;
  align-items: flex-start;
  background-color: $grey;
  height: 100%;
  flex-wrap: wrap;
  overflow-y: scroll;

  @include breakpoint($md) {
    overflow-y: auto;
  }

  .header-anchor {
    text-decoration: none;
    display: none;
  }
}

aside {
  width: 100%;
  padding: 1em 0.5em 0 1em;
  background-color: rgba(0, 0, 0, 0.25);
  order: 2;

  @include breakpoint($md) {
    flex: 2;
    order: 1;
    overflow: auto;
    height: 100%;
    max-width: 20rem;
  }

  @include breakpoint($lg) {
    flex: 0 0 24em;
  }

  section {
    margin-bottom: 2rem;
  }

  h1 {
    font-size: 2rem;
    margin-top: 0;
    margin-bottom: 0.3em;
  }

  h3 {
    padding: 1rem 0 0.2rem 0;
    margin: 0;
  }

  a {
    text-decoration: none;
    margin: 0.2rem;
  }

  ul {
    margin: 0;
    padding: 0 0 0 1.5rem;
    /*list-style: none;*/

    ul {
      padding-left: 1rem;
      padding-bottom: 0.1rem;
      line-height: 1.2;
    }
  }
}

#article {
  flex: 3;
  max-width: 100%;
  position: relative;
  width: 100%;
  order: 1;

  @include breakpoint($md) {
    height: 100%;
    overflow: auto;
    order: 2;
  }

  h1 {
    background-color: rgba(0, 0, 0, 0.5);
    font-size: 4rem;
    padding: 1rem 2rem;
    margin: 0;
  }

  section {
    width: 100%;
    padding: 0;

    @include breakpoint($md) {
      position: absolute;
    }

    h1,
    h2 {
      background: rgba(0, 0, 0, 0.25);
      margin-top: 0;
    }

    h1 {
      padding: 1rem 2rem;
      font-size: 2rem;
    }

    h2 {
      padding: 0.5rem 2rem;
      font-size: 1.5rem;
    }

    h3 {
      font-size: 1.4rem;
    }

    h4 {
      font-size: 1.2rem;
    }

    h3,
    h4,
    h5,
    h6,
    p,
    ol,
    ul {
      padding: 0 2rem;
    }

    hr {
      border-color: rgba(0, 0, 0, 0.25);
    }

    a {
      text-decoration: none;
    }

    code {
      padding: 0.1em 0.3em;
    }

    p,
    ol,
    ul {
      // Prioritise the system font for wiki content
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu,
        Cantarell, "Helvetica Neue", sans-serif;
      color: rgba(255, 255, 255, 0.76);

      code {
        color: #fff;
      }

      a {
        > code {
          color: $brand-color;
        }
      }
    }

    ol,
    ul {
      padding: 0 4rem;
    }

    li > ul,
    li > ol {
      padding: 0 2rem;
    }

    pre {
      padding: 0 2rem;
      white-space: pre-wrap;

      code {
        padding: 0.7rem;
        border: 1px solid rgba(0, 0, 0, 0.2);
      }
    }

    table {
      margin: 1rem 2rem;
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-collapse: collapse;

      tr {
        border-top: 1px solid rgba(0, 0, 0, 0.2);
      }

      td,
      th {
        padding: 0.5rem 1rem;
        border: 1px solid rgba(0, 0, 0, 0.2);
      }

      th {
        background: rgba(0, 0, 0, 0.2);
      }
    }

    blockquote {
      margin: 2rem 2rem;
      padding: 0.01rem 0;
      border-left: 0.5rem solid rgba(0, 0, 0, 0.25);
      background: rgba(0, 0, 0, 0.1);
    }

    img {
      max-width: 100%;

      &:not([src$="png"]) {
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);
      }
    }

    h2:hover > .header-anchor,
    h3:hover > .header-anchor {
      display: initial;
    }
  }

  .notfound .hero {
    padding: 4rem;

    h1 {
      background: none;
      font-size: 4rem;

      svg {
        top: 1rem;
      }
    }

    p,
    code {
      padding: inherit;
      color: inherit;
    }
  }
}

:target {
  background: $brand-color;
  color: #fff;
}

.hljs {
  display: block;
  overflow-x: auto;
  color: #abb2bf;
}

.hljs-comment,
.hljs-quote {
  color: #5c6370;
  font-style: italic;
}

.hljs-doctag,
.hljs-keyword,
.hljs-formula {
  //color: #c678dd;
  color: $brand-color;
}

.hljs-section,
.hljs-name,
.hljs-selector-tag,
.hljs-deletion,
.hljs-subst {
  color: #e06c75;
}

.hljs-literal {
  color: #56b6c2;
}

.hljs-string,
.hljs-regexp,
.hljs-addition,
.hljs-attribute,
.hljs-meta-string {
  color: #98c379;
}

.hljs-built_in,
.hljs-class .hljs-title {
  color: #e6c07b;
}

.hljs-attr,
.hljs-variable,
.hljs-template-variable,
.hljs-type,
.hljs-selector-class,
.hljs-selector-attr,
.hljs-selector-pseudo,
.hljs-number {
  color: #d19a66;
}

.hljs-symbol,
.hljs-bullet,
.hljs-link,
.hljs-meta,
.hljs-selector-id,
.hljs-title {
  color: #61aeee;
}

.hljs-emphasis {
  font-style: italic;
}

.hljs-strong {
  font-weight: bold;
}

.hljs-link {
  text-decoration: underline;
}

#wiki-locale-notification {
  font-weight: bold;
  background: $brand-color;
  color: black;
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: space-between;

  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0 0.5rem;
  }
}
</style>
