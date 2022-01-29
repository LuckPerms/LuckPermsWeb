<template>
<div>
  <h2><font-awesome icon="exclamation-circle" /> {{ $t('editor.reusedsession.title') }}</h2>
  <p>
    {{ $t('editor.reusedsession.desc') }}
  </p>
   <p>
    {{ $t('editor.reusedsession.desc2') }}
  </p>
</div>
</template>

<script>
export default {
  name: 'ReusedSessionWarning',
};
</script>

<style lang="scss">
  p {
    font-size: 1.2rem;
  }
</style>
