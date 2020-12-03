<template>
  <ToolIntro type="treeview" />
</template>

<script>
import ToolIntro from '@/components/ToolIntro';

export default {
  head: {
    title: 'Tree',
    meta: [
      { hid: 'description', name: 'description', content: 'Easily view your permission nodes.' },
      { hid: 'twitter:description', name: 'twitter:description', content: 'Easily view your permission nodes.' },
      { hid: 'og:description', name: 'og:description', content: 'Easily view permission nodes.' },
    ],
  },
  components: {
    ToolIntro,
  },
}
</script>
