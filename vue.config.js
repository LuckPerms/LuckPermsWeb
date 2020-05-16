module.exports = {
  // change the publicPath if you plan to serve the web tools from a subdirectory
  // e.g. domain.com/permissions/editor -> you would set publicPath: '/permissions'
  publicPath: '/',
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/scss/variables.scss";
          @import "@/scss/breakpoints.scss";
        `,
      },
    },
  },
  chainWebpack: config => {
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-markdown-loader')
      .loader('vue-markdown-loader/lib/markdown-compiler')
      .options({
        raw: true,
        linkify: true,
        use: [
          [require('markdown-it-anchor'), {
            "permalink": true,
            "permalinkSymbol": "🔗"
          }],
          require('markdown-it-emoji')
        ]
      })
  },
};
