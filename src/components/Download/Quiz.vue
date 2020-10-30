<template>
  <div class="download-quiz" @click="closeModal">
    <div class="modal" @click.stop>
      <button class="close-button" @click="closeModal">
        <font-awesome icon="times"/>
        {{ $t('close') }}
      </button>
      <transition name="fade" mode="out-in">
        <div v-if="page === 1" class="page page-1">
          <h1>{{ $t('quiz.choose') }}</h1>
          <ul class="options">
            <li @click="proceed(2, 'single')">{{ $t('quiz.single') }}</li>
            <li @click="proceed(2, 'network')">{{ $t('quiz.network') }}</li>
          </ul>
        </div>
      </transition>

      <transition name="fade" mode="out-in">
        <div v-if="page === 2" class="page page-2">
          <h1>{{ $t('quiz.type') }}</h1>
          <ul class="options" v-if="options.single">
            <li @click="proceed(3, 'bukkit')">CraftBukkit / Spigot / Paper</li>
            <li @click="proceed(3, 'sponge')">SpongeForge / SpongeVanilla</li>
            <li @click="proceed(3, 'nukkit')">NukkitX</li>
          </ul>
          <p class="lighter" v-if="options.network">
            {{ $t('quiz.note') }}
          </p>
          <ul class="options" v-if="options.network">
            <li @click="proceed(5, 'bungee')">BungeeCord / Waterfall / Travertine</li>
            <li @click="proceed(5, 'velocity')">Velocity</li>
          </ul>
        </div>
      </transition>

      <transition name="fade" mode="out-in">
        <div v-if="page === 3" class="page page-3">
          <h1>{{ $t('quiz.version', { serverType }) }}</h1>
          <ul class="options" v-if="options.bukkit">
            <li @click="proceed(4, 'latest')">{{ $t('quiz.newer', { version: '1.8.8' }) }}</li>
            <li @click="proceed(4, 'unsupported')">1.8 - 1.8.7</li>
            <li @click="proceed(4, 'legacy')">1.7.10</li>
            <li @click="proceed(4, 'unsupported')">{{ $t('quiz.older', { version: '1.7.9' }) }}</li>
          </ul>
          <ul class="options" v-if="options.sponge">
            <li @click="proceed(4, 'latest')">{{ $t('quiz.newer', { version: 'SpongeAPI 5' }) }}</li>
            <li @click="proceed(4, 'unsupported')">{{ $t('quiz.older', { version: 'SpongeAPI 4' }) }}</li>
          </ul>
          <ul class="options" v-if="options.nukkit">
            <li @click="proceed(4, 'latest')">{{ $t('quiz.newer', { version: 'b93' }) }}</li>
            <li @click="proceed(4, 'unsupported')">{{ $t('quiz.newer', { version: 'b92' }) }}</li>
          </ul>
        </div>
      </transition>

      <transition name="fade" mode="out-in">
        <div v-if="page === 4" class="page page-4">
          <template v-if="options.latest">
            <img alt="LuckPerms logo" src="@/assets/logo.png">
            <h1>{{ $t('quiz.result', { serverType }) }}</h1>
            <div class="options">
              <a :href="downloads.bukkit" v-if="options.bukkit" download>
                {{ $t('links.download') }}
              </a>
              <a :href="downloads.sponge" v-if="options.sponge" download>
                {{ $t('links.download') }}
              </a>
              <a :href="downloads.nukkit" v-if="options.nukkit" download>
                {{ $t('links.download') }}
              </a>
              <a :href="downloads.bungee" v-if="options.bungee" download>
                {{ $t('links.download') }}
              </a>
              <a :href="downloads.velocity" v-if="options.velocity" download>
                {{ $t('links.download') }}
              </a>
            </div>
          </template>
          <template v-if="options.legacy">
            <img alt="LuckPerms logo" src="@/assets/logo.png">
            <h1>{{ $t('quiz.resultLegacy', { serverType }) }}</h1>
            <div class="options">
              <a :href="downloads['bukkit-legacy']" v-if="options.bukkit" download>
                {{ $t('links.download') }}
              </a>
            </div>
          </template>
          <template v-if="options.unsupported">
            <h1 v-if="options.bungee">{{ $t('quiz.outdated', { serverType }) }}</h1>
            <h1 v-if="!options.bungee">{{ $t('quiz.travertine') }}</h1>
          </template>
        </div>
      </transition>

      <transition name="fade" mode="out-in">
        <div v-if="page === 5" class="page page-5">
          <h1>{{ $t('quiz.version', { serverType }) }}</h1>
          <ul class="options" v-if="options.bungee">
            <li @click="proceed(4, 'latest')">{{ $t('quiz.newer', { version: '1.8.8' }) }}</li>
            <li @click="proceed(4, 'unsupported')">{{ $t('quiz.older', { version: '1.8.7' }) }}</li>
          </ul>
          <ul class="options" v-if="options.velocity">
            <li @click="proceed(4, 'latest')">{{ $t('quiz.newer', { version: '1.0' }) }}</li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 1,
      options: {
        single: false,
        network: false,
        bukkit: false,
        sponge: false,
        nukkit: false,
        bungee: false,
        velocity: false,
        legacy: false,
        latest: false,
        unsupported: false,
      },
    };
  },
  props: {
    downloads: Object,
  },
  computed: {
    serverType() {
      if (this.options.bukkit) return 'Bukkit';
      if (this.options.sponge) return 'Sponge';
      if (this.options.nukkit) return 'Nukkit';
      if (this.options.bungee) return 'BungeeCord';
      if (this.options.velocity) return 'Velocity';
      return null;
    },
  },
  methods: {
    proceed(page, answer) {
      this.options[answer] = true;
      this.page = page;
    },
    reset() {
      this.page = 1;
      // eslint-disable-next-line guard-for-in,no-restricted-syntax
      for (const option in this.options) {
        this.options[option] = false;
      }
    },
    closeModal() {
      this.reset();
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss">
  .download-quiz {
    background: rgba(0, 0, 0, .9);
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;

    .modal {
      background: $bg-gradient-dark;
      padding: 4rem;
      border-radius: 4px;
      width: 100%;
      max-width: 48rem;
      height: 100%;
      max-height: 32rem;
      overflow: hidden;
      position: relative;

      .close-button {
        position: absolute;
        bottom: 1rem;
        left: 50%;
        transform: translateX(-50%);
        background: transparent;
        border: 0;
        font: inherit;
        color: white;
        opacity: .5;
        text-transform: uppercase;
        cursor: pointer;
        padding: 1rem;

        &:hover {
          opacity: 1;
        }
      }

      .page {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: absolute;
        width: calc(100% - 8rem);
        height: calc(100% - 8rem);
        overflow: auto;

        img {
          width: 8rem;
          height: 8rem;
          margin-bottom: 1rem;
        }

        h1 {
          margin: 0 0 1rem;
          text-align: center;
        }

        .options {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          width: 100%;

          li, a {
            background: $brand-color;
            color: $navy;
            font-weight: bold;
            margin: 1rem;
            padding: .5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1.5rem;
            text-align: center;
            text-decoration: none;

            &:hover {
              background: lighten($brand-color, 10%);
            }
          }
        }
      }
    }
  }
</style>
