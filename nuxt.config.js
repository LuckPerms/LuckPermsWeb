import axios from 'axios';

export default {
  generate: {
    fallback: true,
    routes: function () {
      // This is a temporary solution and we should probably read the file list of the submodule
      return axios.get('https://api.github.com/repos/LuckPerms/wiki/contents')
      .then((response) => {
        return response.data.map((file) => {
          return file.name.replace(/(.+)\.md/g, '$1');
        })
        .filter(pageName => !(['README', '_Sidebar', 'LICENSE'].includes(pageName)))
        .map(pageName => `/wiki/${pageName}`);
      });
    },
  },

  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s | LuckPerms',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'LuckPerms is a permissions plugin for Minecraft servers.' },
      { name: 'author', content: 'Luck' },
      { name: 'twitter:card', content: 'summary'},
      { name: 'twitter:title', content: 'LuckPerms'},
      { hid: 'twitter:description', name: 'twitter:description', content: 'LuckPerms is a permissions plugin for Minecraft servers.'},
      { name: 'og:title', content: 'LuckPerms' },
      { hid: 'og:description', name: 'og:description', content: 'LuckPerms is a permissions plugin for Minecraft servers.' },
      { name: 'og:type', content: 'product' },
      { name: 'og:url', content: 'https://luckperms.net'},
      { name: 'og:site_name', content: 'LuckPerms - A permissions plugin for Minecraft servers' },
      { name: 'theme-color', content: '#141422' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Source+Code+Pro:400,700|Source+Sans+Pro:400,700' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#94df03' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    ['@nuxtjs/fontawesome', {
      component: 'FontAwesome',
      icons: {
        solid: [
          'faSave',
          'faUndo',
          'faRedo',
          'faExclamationCircle',
          'faPlusCircle',
          'faTimes',
          'faTimesCircle',
          'faChevronCircleDown',
          'faAsterisk',
          'faPlus',
          'faSyncAlt',
          'faBook',
          'faArrowAltCircleDown',
          'faArrowLeft',
          'faCaretRight',
          'faEdit',
          'faCheck',
          'faHome',
          'faCommentAlt',
          'faTools',
          'faMinus',
          'faSitemap',
          'faPlusSquare',
          'faMinusSquare',
          'faQuestionCircle',
          'faBars',
          'faCodeBranch',
          'faClone',
          'faSignInAlt',
          'faSearch',
          'faServer',
          'faHeart',
          'faArrowCircleRight',
        ],
        brands: [
          'faGithub',
          'faDiscord',
          'faPatreon',
        ]
      }
    }]
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/markdownit',
    '@nuxtjs/style-resources'
  ],
  /*
  ** Style resources
  */
  styleResources: {
    scss: [
      'assets/scss/_index.scss',
    ]
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },
  markdownit: {
    raw: true,
    linkify: true,
    use: [
      'markdown-it-emoji',
      [
        'markdown-it-anchor', {
          permalink: true,
          permalinkSymbol: '🔗',
          slugify: (s) => String(s).trim().toLowerCase().replace(/\s+/g, '-').replace(/([^\w\-]+)/g, ''),
        },
      ],
    ],
  }
}
