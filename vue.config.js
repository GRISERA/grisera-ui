const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    configureWebpack: {
    entry: "./src/main.js",
    devServer: {
        hot: true,
    },
    watch: true,
    watchOptions: {
        ignored: /node_modules/,
        poll: 1000,
    },
},
  transpileDependencies: [
    'vuetify'
  ]
})
//const { defineConfig } = require('@vue/cli-service');
//module.exports = defineConfig({
//    chainWebpack: config => {
//        config.module
//            .rule('vue')
//            .use('vue-loader')
//            .tap(options => {
//                options.prettify = false;
//
//                return options;
//            });
//    },
//    configureWebpack: {
//        entry: './src/main.js',
//        devServer: {
//            hot: true,
//        },
//        watch: true,
//        watchOptions: {
//            ignored: /node_modules/,
//            poll: 1000,
//        },
//    },
//    transpileDependencies: [
//        'vuetify',
//    ],
//    devServer: {
//        allowedHosts: 'all',
//    },
//});