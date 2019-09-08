<template>
  <main class="home">
    <section class="hero">
      <div class="logo">
        <img alt="Vue logo" src="../assets/logo.png">
        <div>
          <h1>LuckPerms</h1>
          <p>An advanced permissions plugin for Bukkit/Spigot, BungeeCord, Sponge, Nukkit and Velocity</p>
        </div>
      </div>

      <div class="download">
        <a href="">
          <span>
            <font-awesome icon="arrow-alt-circle-down" />
            Download
          </span>
          <small>Version 4.4.30</small>
        </a>
      </div>
    </section>

    <section class="resources">
        <a href="">
          <span>
            <font-awesome icon="book" />
            Wiki
          </span>
          <small>Learn how to install, setup, configure and effectively use LuckPerms</small>
        </a>
        <a href="">
          <span>
            <font-awesome :icon="['fab', 'github']" />
            GitHub
          </span>
          <small>Browse the source code, report issues and contribute code</small>
        </a>
        <a href="">
          <span>
            <font-awesome :icon="['fab', 'discord']" />
            Discord
          </span>
          <small>Join 4326 others to discuss the project and ask/answer questions</small>
        </a>
        <a href="">
          <span>
            <font-awesome :icon="['fab', 'patreon']" />
            Patreon
          </span>
          <small>Join 29 others supporting the project on Patreon</small>
        </a>
    </section>
  </main>
</template>

<script>
export default {
  name: 'Home',
};
</script>

<style lang="scss">
  main.home {
    overflow-y: auto;

    .hero {
      background: black;
      display: flex;
    }

    .logo {
      display: flex;
      /*flex-direction: column;*/
      align-items: center;
      justify-content: center;
      padding: 4rem;
      font-size: 1.5em;
      width: 66%;

      div {
        max-width: 35rem;
      }

      img {
        margin-right: 2rem;
      }

      h1 {
        margin: 0 0 1rem;
        line-height: 1;
        font-size: 3em;
      }

      p {
        margin: 0;
        opacity: .4;
      }
    }

    .download {
      padding: 4rem 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 34%;

      a {
        background: #94df03;
        color: #101022;
        font-size: 2em;
        padding: 1rem 2rem;
        text-align: center;
        line-height: 1;
        text-decoration: none;
        border-radius: 2px;
        transition: background .2s;

        &:hover {
          background: lighten(#94df03, 10%);
        }

        span {
          display: block;
          font-weight: bold;

          svg {
            margin-right: .5rem;
            opacity: .5;
          }
        }

        small {
          font-size: 1.25rem;
          opacity: .75;
        }
      }
    }

    .resources {
      display: flex;
      flex-direction: column;
      padding: 4rem;
      width: 50%;

      a {
        display: block;
        background: #2d2d38;
        color: lawngreen;
        padding: 1.5rem;
        line-height: 1;
        text-decoration: none;
        border-radius: 2px;
        font-size: 1.5em;
        transition: background .2s;

        &:not(:last-child) {
          margin-bottom: 2rem;
        }

        &:hover {
          background: lighten(#2d2d38, 10%);
        }

        span {
          display: block;
          font-weight: bold;
          margin-bottom: .5rem;
        }

        svg {
          margin-right: .5rem;
          opacity: .5;
        }

        small {
          color: white;
          opacity: .4;
          font-size: 1rem;
        }
      }
    }
  }
</style>
