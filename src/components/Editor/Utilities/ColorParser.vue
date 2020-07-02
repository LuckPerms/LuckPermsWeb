<template>
  <div><span v-html="parsedText" /> <code v-if="showRaw">({{ text }})</code></div>
</template>

<script>
export default {
  props: ['text', 'showRaw'],
  created() {
    const randomize = this.randomize;
    setInterval(() => {
      Array.from(document.getElementsByClassName('mc-obfuscated')).forEach((element) => {
        element.textContent = randomize(element.textContent);
      });
    }, 100);
  },
  methods: {
    randomize(text) {
      var length = text.length;
      var text = '';
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i=0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      return text;
    },
  },
  computed: {
    parsedText() {
      const parts = this.text.split('&r');
      for (var partIt = 0; partIt < parts.length; partIt++) {
        var part = parts[partIt];

        var hexBungeeMatches = part.match(/(&x&([a-zA-Z0-9])&([a-zA-Z0-9])&([a-zA-Z0-9])&([a-zA-Z0-9])&([a-zA-Z0-9])&([a-zA-Z0-9]))/gi);
        if (hexBungeeMatches !== null) {
          if (hexBungeeMatches.length > 0) part = part.replace(/(&x&([a-zA-Z0-9])&([a-zA-Z0-9])&([a-zA-Z0-9])&([a-zA-Z0-9])&([a-zA-Z0-9])&([a-zA-Z0-9]))/gi, '<span style="color: #$2$3$4$5$6$7;">');
          for (var i = 0; i < hexBungeeMatches.length; i++) part = part + '</span>';
        }

        var hexMatches = part.match(/(&#(([a-zA-Z0-9]){6}))/gi);
        if (hexMatches !== null) {
          if (hexMatches.length > 0) part = part.replace(/(&#(([a-zA-Z0-9]){6}))/gi, '<span style="color: #$2;">');
          for (var i = 0; i < hexMatches.length; i++) part = part + '</span>';
        }

        var colorMatches = part.match(/(&([a-f0-9]))/gi);
        if (colorMatches !== null) {
          if (colorMatches.length > 0) part = part.replace(/(&([a-f0-9]))/gi, '<span class="mc-color-$2">');
          for (var i = 0; i < colorMatches.length; i++) part = part + '</span>';
        }

        var boldMatches = part.match(/(&l)/gi);
        if (boldMatches !== null) {
          if (boldMatches.length > 0) part = part.replace(/(&l)/gi, '<span class="mc-bold">');
          for (var i = 0; i < boldMatches.length; i++) part = part + '</span>';
        }

        var italicMatches = part.match(/(&o)/gi);
        if (italicMatches !== null) {
          if (italicMatches.length > 0) part = part.replace(/(&o)/gi, '<span class="mc-italic">');
          for (var i = 0; i < italicMatches.length; i++) part = part + '</span>';
        }

        var underlineMatches = part.match(/(&n)/gi);
        if (underlineMatches !== null) {
          if (underlineMatches.length > 0) part = part.replace(/(&n)/gi, '<span class="mc-underline">');
          for (var i = 0; i < underlineMatches.length; i++) part = part + '</span>';
        }

        var strikethroughMatches = part.match(/(&m)/gi);
        if (strikethroughMatches !== null) {
          if (strikethroughMatches.length > 0) part = part.replace(/(&m)/gi, '<span class="mc-strikethrough">');
          for (var i = 0; i < strikethroughMatches.length; i++) part = part + '</span>';
        }

        var obfuscatedMatches = part.match(/(&k)/gi);
        if (obfuscatedMatches !== null) {
          if (obfuscatedMatches.length > 0) part = part.replace(/(&k)/gi, '<span class="mc-obfuscated">');
          for (var i = 0; i < obfuscatedMatches.length; i++) part = part + '</span>';
        }

        parts[partIt] = part;
      }
      return parts.join('');
    },
  },
}
</script>

<style lang="scss">
.mc-bold {
  font-weight: bold;
}

.mc-italic {
  font-style: italic;
}

.mc-underline {
  text-decoration: underline;
}

.mc-strikethrough {
  text-decoration: line-through;
  text-decoration-color: currentColor;
}

.mc-color-0 {
  color: #000000;
}

.mc-color-1 {
  color: #0000AA;
}

.mc-color-2 {
  color: #00AA00;
}

.mc-color-3 {
  color: #00AAAA;
}

.mc-color-4 {
  color: #AA0000;
}

.mc-color-5 {
  color: #AA00AA;
}

.mc-color-6 {
  color: #FFAA00;
}

.mc-color-7 {
  color: #AAAAAA;
}

.mc-color-8 {
  color: #555555;
}

.mc-color-9 {
  color: #5555FF;
}

.mc-color-a {
  color: #55FF55;
}

.mc-color-b {
  color: #55FFFF;
}

.mc-color-c {
  color: #FF5555;
}

.mc-color-d {
  color: #FF55FF;
}

.mc-color-e {
  color: #FFFF55;
}

.mc-color-f {
  color: #FFFFFF;
}
</style>
