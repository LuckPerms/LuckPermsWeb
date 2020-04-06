module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/scss/_index.scss";
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
      .options({ raw: true })
  },
};
