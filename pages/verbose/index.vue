<template>
  <ToolIntro type="verbose" />
</template>

<script>
import ToolIntro from '@/components/ToolIntro';

export default {
  head: {
    title: 'Verbose',
    meta: [
      { hid: 'description', name: 'description', content: 'Find out what permissions have been checked.' },
      { hid: 'twitter:description', name: 'twitter:description', content: 'Find out what permissions have been checked.' },
      { hid: 'og:description', name: 'og:description', content: 'Find out what permissions have been checked.' },
    ],
  },
  components: {
    ToolIntro,
  },
}
</script>
