<template>
<div class="saved-changes">
  <h2>Data was saved!</h2>

  <p>
    Run this command on your server to apply the changes:
  </p>

  <div class="command">
    <code class="apply-edits" @click="copyCommand" title="Copy to clipboard">
      /lp applyedits {{ props }}
    </code>
    <span class="command-copied" v-if="commandCopied">
    Command copied to clipboard
    </span>
  </div>

  <p>
    <strong>Note:</strong> after running the <code>applyedits</code> command, you should generate another editor URL to continue editing your server's permissions.
  </p>
</div>
</template>

<script>
export default {
  name: 'CreateGroup',

  data() {
    return {
      commandCopied: false,
    };
  },

  props: {
    props: String,
  },

  methods: {
    copyCommand() {
      this.$copyText(`/lp applyedits ${this.props}`)
      .then(() => {
        this.commandCopied = true;
      }).catch(console.error);
    }
  }
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
