import { defineConfig } from "oxlint";
import ultraciteCore from "ultracite/oxlint/core";
import ultraciteVue from "ultracite/oxlint/vue";

export default defineConfig([
  ultraciteCore,
  ultraciteVue,
  {
    rules: {
      // The web app uses vuex/vue-i18n legacy APIs that trigger these
      "class-methods-use-this": "off",
      "no-console": "off",
    },
  },
]);
