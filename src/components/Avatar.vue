<template>
  <img
    :src="`https://minotar.net/helm/${id}/${size}.png`"
    :title="`${name}'s avatar`"
  />
</template>

<script>
  export default {
    props: {
      id: {
        required: true
      },
      name: {
        required: true
      },
      size: {
        type: Number,
        default: 100
      }
    }
  }
</script>
