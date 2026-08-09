<template>
<div class="saved-changes">
  <h2>{{ $t('editor.saved') }}</h2>
  <p>
    {{ $t('editor.command') }}
  </p>

  <div class="command relative mb-8 pb-8">
    <code class="apply-edits cursor-pointer text-[1.5rem] hover:opacity-80" @click="copyCommand" :title="$t('editor.clipboardCopy')">
      /{{ metaData.commandAlias }} applyedits {{ this.props.saveKey }}
    </code>
    <span class="command-copied absolute bottom-0 left-0 block text-brand" v-if="commandCopied">
      {{ $t('editor.copied') }}
    </span>
  </div>

  <p v-html="$t('editor.applyNote')" />
</div>
</template>

<script>
export default {
  name: 'SavedChanges',

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
      await navigator.clipboard.writeText(`/${this.metaData.commandAlias} applyedits ${this.props.saveKey}`);
      this.commandCopied = true;
    },
  },
};

</script>