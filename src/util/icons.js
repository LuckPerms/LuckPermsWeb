import { h } from 'vue';

import Icon from '@/components/common/Icon.vue';

const FontAwesomeLayers = {
  name: 'FontAwesomeLayers',
  setup(_, { slots }) {
    return () => h('span', { class: 'fa-layers' }, slots.default?.());
  },
};

export default {
  install(app) {
    app.component('font-awesome', Icon);
    app.component('Icon', Icon);
    app.component('font-awesome-layers', FontAwesomeLayers);
  },
};
