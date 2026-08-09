<template>
  <div class="download-quiz fixed inset-0 z-[100] flex items-center justify-center bg-black/90" @click="closeModal">
    <div class="modal bg-[linear-gradient(-2deg,#11111d,#2d2d38)] p-16 w-full max-w-[48rem] h-full max-h-[32rem] overflow-hidden relative rounded" @click.stop>
      <button class="close-button absolute bottom-4 left-1/2 -translate-x-1/2 bg-transparent border-0 font-inherit text-white opacity-50 uppercase cursor-pointer p-4 hover:opacity-100" @click="closeModal">
        <font-awesome icon="times"/>
        {{ $t('close') }}
      </button>
      <transition name="fade" mode="out-in">
        <div v-if="page === 1" class="page page-1 flex flex-col items-center absolute w-[calc(100%-8rem)] h-[calc(100%-8rem)] overflow-auto">
          <h1 class="my-0 mb-4 text-center">{{ $t('quiz.choose') }}</h1>
          <ul class="options">
            <li @click="proceed(2, 'single')">{{ $t('quiz.single') }}</li>
            <li @click="proceed(2, 'network')">{{ $t('quiz.network') }}</li>
          </ul>
        </div>
      </transition>

      <transition name="fade" mode="out-in">
        <div v-if="page === 2" class="page page-2 flex flex-col items-center absolute w-[calc(100%-8rem)] h-[calc(100%-8rem)] overflow-auto">
          <h1 class="my-0 mb-4 text-center">{{ $t('quiz.type') }}</h1>
          <ul class="options list-none m-0 p-0 flex flex-col w-full" v-if="options.single">
            <li class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center hover:brightness-110" @click="proceed(3, 'bukkit')">Spigot / Paper</li>
            <li class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center hover:brightness-110" @click="proceed(3, 'sponge')">SpongeForge / SpongeVanilla</li>
            <li class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center hover:brightness-110" @click="proceed(3, 'fabric')">Fabric</li>
            <li class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center hover:brightness-110" @click="proceed(3, 'forge')">Forge</li>
            <li class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center hover:brightness-110" @click="proceed(3, 'neoforge')">NeoForge</li>
            <li class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center hover:brightness-110" @click="proceed(3, 'nukkit')">NukkitX</li>
          </ul>
          <p class="lighter" v-if="options.network">
            {{ $t('quiz.note') }}
          </p>
          <ul class="options list-none m-0 p-0 flex flex-col w-full" v-if="options.network">
            <li class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center hover:brightness-110" @click="proceed(5, 'bungee')">BungeeCord / Waterfall</li>
            <li class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center hover:brightness-110" @click="proceed(5, 'velocity')">Velocity</li>
          </ul>
        </div>
      </transition>

      <transition name="fade" mode="out-in">
        <div v-if="page === 3" class="page page-3 flex flex-col items-center absolute w-[calc(100%-8rem)] h-[calc(100%-8rem)] overflow-auto">
          <h1 class="my-0 mb-4 text-center">{{ $t('quiz.version', { serverType }) }}</h1>
          <ul class="options list-none m-0 p-0 flex flex-col w-full" v-if="options.bukkit">
            <li class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center hover:brightness-110" @click="proceed(4, 'latest')">{{ $t('quiz.newer', { version: '1.8.8' }) }}</li>
            <li class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center hover:brightness-110" @click="proceed(4, 'unsupported')">1.8 - 1.8.7</li>
            <li class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center hover:brightness-110" @click="proceed(4, 'legacy')">1.7.10</li>
            <li class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center hover:brightness-110" @click="proceed(4, 'unsupported')">{{ $t('quiz.older', { version: '1.7.9' }) }}</li>
          </ul>
          <ul class="options list-none m-0 p-0 flex flex-col w-full" v-if="options.sponge">
            <li class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center hover:brightness-110" @click="proceed(4, 'latest')">
              {{ $t('quiz.newer', { version: 'SpongeAPI 12' }) }}
            </li>
            <li class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center hover:brightness-110" @click="proceed(4, 'unsupported')">
              {{ $t('quiz.older', { version: 'SpongeAPI 7' }) }}
            </li>
          </ul>
          <ul class="options list-none m-0 p-0 flex flex-col w-full" v-if="options.fabric">
            <li class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center hover:brightness-110" @click="proceed(4, 'latest')">
              {{ $t('quiz.newer', { version: '1.21' }) }}
            </li>
            <li class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center hover:brightness-110" @click="proceed(4, 'unsupported')">
              {{ $t('quiz.older', { version: '1.20' }) }}
            </li>
          </ul>
          <ul class="options list-none m-0 p-0 flex flex-col w-full" v-if="options.forge">
            <li class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center hover:brightness-110" @click="proceed(4, 'latest')">
              {{ $t('quiz.newer', { version: '1.21' }) }}
            </li>
            <li class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center hover:brightness-110" @click="proceed(4, 'unsupported')">
              {{ $t('quiz.older', { version: '1.20' }) }}
            </li>
          </ul>
          <ul class="options list-none m-0 p-0 flex flex-col w-full" v-if="options.neoforge">
            <li class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center hover:brightness-110" @click="proceed(4, 'latest')">
              {{ $t('quiz.newer', { version: '1.21' }) }}
            </li>
            <li class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center hover:brightness-110" @click="proceed(4, 'unsupported')">
              {{ $t('quiz.older', { version: '1.20' }) }}
            </li>
          </ul>
          <ul class="options list-none m-0 p-0 flex flex-col w-full" v-if="options.nukkit">
            <li class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center hover:brightness-110" @click="proceed(4, 'latest')">{{ $t('quiz.newer', { version: 'b93' }) }}</li>
            <li class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center hover:brightness-110" @click="proceed(4, 'unsupported')">{{ $t('quiz.newer', { version: 'b92' }) }}</li>
          </ul>
        </div>
      </transition>

      <transition name="fade" mode="out-in">
        <div v-if="page === 4" class="page page-4 flex flex-col items-center absolute w-[calc(100%-8rem)] h-[calc(100%-8rem)] overflow-auto">
          <template v-if="options.latest">
            <img alt="LuckPerms logo" src="@/assets/logo.svg" class="w-32 h-32 mb-4">
            <h1 class="my-0 mb-4 text-center">{{ $t('quiz.result', { serverType }) }}</h1>
            <div class="options flex flex-col w-full list-none m-0 p-0">
              <a :href="downloads.bukkit" v-if="options.bukkit" download class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center no-underline">
                {{ $t('links.download') }}
              </a>
              <a :href="downloads.sponge" v-if="options.sponge" download class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center no-underline">
                {{ $t('links.download') }}
              </a>
              <a :href="downloads.fabric" v-if="options.fabric" download class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center no-underline">
                {{ $t('links.download') }}
              </a>
              <a :href="downloads.forge" v-if="options.forge" download class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center no-underline">
                {{ $t('links.download') }}
              </a>
              <a :href="downloads.neoforge" v-if="options.neoforge" download class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center no-underline">
                {{ $t('links.download') }}
              </a>
              <a :href="downloads.nukkit" v-if="options.nukkit" download class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center no-underline">
                {{ $t('links.download') }}
              </a>
              <a :href="downloads.bungee" v-if="options.bungee" download class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center no-underline">
                {{ $t('links.download') }}
              </a>
              <a :href="downloads.velocity" v-if="options.velocity" download class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center no-underline">
                {{ $t('links.download') }}
              </a>
            </div>
          </template>
          <template v-if="options.legacy">
            <img alt="LuckPerms logo" src="@/assets/logo.svg" class="w-32 h-32 mb-4">
            <h1 class="my-0 mb-4 text-center">{{ $t('quiz.resultLegacy', { serverType }) }}</h1>
            <div class="options flex flex-col w-full list-none m-0 p-0">
              <a :href="downloads['bukkit-legacy']" v-if="options.bukkit" download class="bg-brand text-navy font-bold mx-4 my-4 p-2 rounded cursor-pointer text-[1.5rem] text-center no-underline">
                {{ $t('links.download') }}
              </a>
            </div>
          </template>
          <template v-if="options.unsupported">
            <h1 v-if="!options.bungee" class="my-0 mb-4 text-center">{{ $t('quiz.outdated', { serverType }) }}</h1>
            <h1 v-if="options.bungee" class="my-0 mb-4 text-center">{{ $t('quiz.travertine') }}</h1>
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
            <li @click="proceed(4, 'latest')">{{ $t('quiz.newer', { version: '3.0' }) }}</li>
            <li @click="proceed(4, 'unsupported')">{{ $t('quiz.newer', { version: '1.0' }) }}</li>
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
        fabric: false,
        forge: false,
        neoforge: false,
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
      if (this.options.fabric) return 'Fabric';
      if (this.options.forge) return 'Forge';
      if (this.options.neoforge) return 'NeoForge';
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
              background: color.adjust($brand-color, $lightness: 10%);
            }
          }
        }
      }
    }
  }
</style>
