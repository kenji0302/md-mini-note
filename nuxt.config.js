import colors from 'vuetify/es5/util/colors'

//cross-env
const environment = process.env.NODE_ENV || 'development';
// console.log(process.env.NODE_ENV);
// console.log(environment);
const envSet = require(`./env.${environment}.js`)
// console.log(envSet);

export default {
  //cross-env
  env: envSet,
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: 'md mini note',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
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
    'tui-editor/dist/tui-editor.css',
    'tui-editor/dist/tui-editor-contents.css',
    'codemirror/lib/codemirror.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/myFilter.js'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/axios'
  ],
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    /*
    //グレー
    theme:  {
      primary: "#9E9E9E",
      secondary: "#9E9E9E",
      accent: "#9E9E9E",
      error: "#9E9E9E",
      warning: "#9E9E9E",
      info: "#9E9E9E",
      success: "#9E9E9E"
    }
    */
    /*
    //デフォルト
    theme: {
      primary: colors.blue.darken2,
      accent: colors.grey.darken3,
      secondary: colors.amber.darken3,
      info: colors.teal.lighten1,
      warning: colors.amber.base,
      error: colors.deepOrange.accent4,
      success: colors.green.accent3
    }
    */
    //リリース向け
    theme:  {
      primary: "#8bc34a",
      secondary: "#cddc39",
      accent: "#ffeb3b",
      error: "#ff5722",
      warning: "#ff9800",
      info: "#607d8b",
      success: "#03a9f4"
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  },
  axios: {

  }
}
