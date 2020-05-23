const path = require('path');
const merge = require('webpack-merge');
const HtmlPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.base');
const baseCkeditorConfig = require('./webpack.ckeditor');
const config = require('../config');

module.exports = merge(baseConfig, {
    entry: './src/client.ts',
    plugins: [
        new HtmlPlugin({
            meta: [{viewport: 'width=device-width, initial-scale=1.0'}],
            inject: false,
            template: config.env === 'development' ? require('html-webpack-template') : path.resolve(__dirname, '../src/template.html'),
            title: config.title,
            appMountId: 'app',
            minify: config.env === 'development' ? false : {
                caseSensitive: true,
                collapseWhitespace: true,
                removeComments: false
            }
        })
    ]
},baseCkeditorConfig);