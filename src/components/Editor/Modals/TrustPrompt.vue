<template>
<div class="trust-prompt">
  <h2><font-awesome icon="network-wired" /> {{ $t('editor.trust.title') }}</h2>
  <p>
    {{ $t('editor.trust.prompt') }}
  </p>

  <div class="command">
    <code class="command-area" @click="copyCommand" :title="$t('editor.clipboardCopy')">
      /{{ metaData.commandAlias }} trusteditor {{ this.props.nonce }}
    </code>
    <span class="command-copied" v-if="commandCopied">
      {{ $t('editor.copied') }}
    </span>
  </div>

  <p v-html="$t('editor.trust.note')" />
</div>
</template>

<script>
export default {
  name: 'TrustPrompt',

  data() {
    return {
      commandCopied: false,
    };
  },

  props: {
    props: Object,
  },

  computed: {
    metaData() {
      return this.$store.getters.metaData;
    },
  },

  methods: {
    async copyCommand() {
      await this.$copyText(`/${this.metaData.commandAlias} trusteditor ${this.props.nonce}`);
      this.commandCopied = true;
    },
  },
};
</script>

<style lang="scss">
  .trust-prompt {
    .command-area {
      font-size: 1.5rem;
      cursor: pointer;

      &:hover {
        opacity: .8;
      }
    }

    .command {
      position: relative;
      padding-bottom: 2rem;
      margin-bottom: 2rem;

      .command-copied {
        position: absolute;
        bottom: 0;
        left: 0;
        display: block;
        color: $brand-color;
      }
    }
  }
</style>
