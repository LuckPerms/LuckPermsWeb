<template>
  <main id="wiki" class="wiki container">
    <article id="article">
      <router-view />
    </article>
    <aside>
      <h1>Wiki</h1>
      <sidebar />
    </aside>
  </main>
</template>

<script>
import Sidebar from '../wiki/_Sidebar.md';

export default {
  metaInfo: {
    titleTemplate: '%s | Wiki | LuckPerms',
  },
  components: {
    Sidebar,
  },
  mounted() {
    if (window.innerWidth >= 922) return;
    const wiki = document.getElementById('wiki');
    document.querySelectorAll('.wiki aside a').forEach((link) => {
      link.addEventListener('click', () => {
        wiki.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      });
    });
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
    padding: 2em 2em 0 2em;
    background-color: rgba(0,0,0,.25);
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
    }

    a {
      text-decoration: none;
      margin: .2rem;
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;

      ul {
        padding-left: 1rem;
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
      background-color: rgba(0,0,0,.5);
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

      h1, h2 {
        background: rgba(0,0,0,.25);
        padding: 1rem 2rem;
        font-size: 2rem;
        margin-top: 0;
      }

      h3, h4, h5, h6, p, ol, ul {
        padding: 0 2rem;
      }

      hr {
        border-color: rgba(0,0,0,.25);
      }

      a {
        text-decoration: none;
      }

      p, ol, ul {
        color: rgba(255,255,255,.66);

        code {
          color: #FFF;
        }

        a {
          > code {
            color: $brand-color;
          }
        }
      }

      pre {
        padding: 0 2rem;
        white-space: pre-wrap;

        code {
          padding: 1.5rem 2rem;
          border: 1px solid rgba(0,0,0,.2);
        }
      }

      table {
        margin: 1rem 2rem;
        background: rgba(0,0,0,.2);
        border: 1px solid rgba(0,0,0,.2);
        border-collapse: collapse;

        tr {
          border-top: 1px solid rgba(0,0,0,.2);
        }

        td, th {
          padding: .5rem 1rem;
          border: 1px solid rgba(0,0,0,.2);
        }

        th {
          background: rgba(0,0,0,.2);
        }
      }

      blockquote {
        margin: 2rem 2rem;
        padding: .01rem 0;
        border-left: .5rem solid rgba(0,0,0,.25);
        background: rgba(0,0,0,.1);
      }

      img {
        max-width: 100%;

        &:not([src$="png"]) {
          box-shadow: 0 0 1rem rgba(0,0,0,.2);
        }
      }

      h2:hover > .header-anchor,
      h3:hover > .header-anchor {
        display: initial;
      }
    }
  }

  :target {
    background: $brand-color;
    color: #FFF;
    border: 1px red solid;
  }
</style>
