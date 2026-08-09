<template>
<div class="trust-prompt">
  <h2><font-awesome icon="network-wired" /> {{ $t('editor.trust.title') }}</h2>
  <p>
    {{ $t('editor.trust.prompt') }}
  </p>

  <div class="command relative mb-8 pb-8">
    <code class="command-area cursor-pointer text-[1.5rem] hover:opacity-80" @click="copyCommand" :title="$t('editor.clipboardCopy')">
      /{{ metaData.commandAlias }} trusteditor {{ this.props.nonce }}
    </code>
    <span class="command-copied absolute bottom-0 left-0 block text-brand" v-if="commandCopied">
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
      await navigator.clipboard.writeText(`/${this.metaData.commandAlias} trusteditor ${this.props.nonce}`);
      this.commandCopied = true;
    },
  },
};
</script>