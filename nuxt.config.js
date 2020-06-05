
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Source+Code+Pro:400,700|Source+Sans+Pro:400,700' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
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
    '@nuxtjs/style-resources'
  ],
  /*
  ** Style resources
  */
  styleResources: {
    scss: [
      'assets/scss/variables.scss',
      'assets/scss/breakpoints.scss'
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
}
