<template>
<div class="saved-changes">
  <h2>{{ $t('editor.saved') }}</h2>

  <p>
    {{ $t('editor.command') }}
  </p>

  <div class="command">
    <code class="apply-edits" @click="copyCommand" :title="$t('editor.clipboardCopy')">
      /{{ metaData.commandAlias }} applyedits {{ props }}
    </code>
    <span class="command-copied" v-if="commandCopied">
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
    props: String,
  },

  computed: {
    metaData() {
      return this.$store.getters.metaData;
    },
  },

  methods: {
    async copyCommand() {
      await this.$copyText(`/${this.metaData.commandAlias} applyedits ${this.props}`);
      this.commandCopied = true;
    },
  },
};
</script>

<style lang="scss">
  .saved-changes {
    .apply-edits {
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
