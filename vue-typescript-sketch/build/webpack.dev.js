const merge = require('webpack-merge');
const history = require('connect-history-api-fallback');
const convert = require('koa-connect');
const baseConfig = require('./webpack.client');
const config = require('../config/dev');

module.exports = merge.smart(baseConfig, {
    mode: 'development',
    output: {
        filename: '[name].js',
        publicPath: config.publicPath
    },
    module: {
        rules: [
            {
                test: /\.(css|scss)$/,
                exclude:/@ckeditor/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            data: `
          @import "@/assets/bootstrap/custom/variables.scss";
        `
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                exclude:/@ckeditor/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {},
                    },
                ],
            }
        ]
    },
    serve: {
        host: config.host,
        port: config.port,
        dev: {
            publicPath: config.publicPath
        },
        add: (app, middleware, options) => {
            app.use(convert(history()));
        }
    },
    devtool: 'source-map'
});