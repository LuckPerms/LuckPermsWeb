<template>
<div>
  <h2><font-awesome icon="exclamation-circle" /> {{ $t('editor.reusedsession.title') }}</h2>
  <p class="text-[1.2rem]">
    {{ $t('editor.reusedsession.desc') }}
  </p>
   <p class="text-[1.2rem]">
    {{ $t('editor.reusedsession.desc2') }}
  </p>
</div>
</template>

<script>
export default {
  name: 'ReusedSessionWarning',
};
</script>
