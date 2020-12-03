<template>
  <ToolIntro type="editor" />
</template>

<script>
import ToolIntro from '@/components/ToolIntro';

export default {
  head: {
    title: 'Editor',
    meta: [
      { hid: 'description', name: 'description', content: 'Edit your permissions fast and easy.' },
      { hid: 'twitter:description', name: 'twitter:description', content: 'Edit your permissions fast and easy.' },
      { hid: 'og:description', name: 'og:description', content: 'Edit your permissions fast and easy.' },
    ],
  },
  components: {
    ToolIntro,
  },
}
</script>
