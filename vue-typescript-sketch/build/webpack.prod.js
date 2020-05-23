const path = require('path');
const glob = require('glob-all');
const merge = require('webpack-merge');
const Webpackbar = require('webpackbar');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PurgeCssPlugin = require('purgecss-webpack-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const baseClientConfig = require('./webpack.client');
const baseServerConfig = require('./webpack.server');
const baseCkeditorConfig = require('./webpack.ckeditor');
const config = require('../config/prod');


const productionCofig = {
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
                        options: {
                            name: 'image/[hash].[ext]',
                            publicPath: config.publicPath
                        },
                    },
                ],
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: './style/[name].css'
        })
    ]
};

const clientConfig = merge.smart(baseClientConfig, productionCofig, {
    mode: 'production',
    output: {
        path: config.clientOutputPath,
        filename: './script/[name].[hash].js',
        publicPath: config.publicPath
    },
    plugins: [
        new PurgeCssPlugin({
            paths: glob.sync([
                path.join(__dirname, "../src/**/*.ts"),
                path.join(__dirname, "../src/**/*.vue")
            ]),
            extractors: [],
            whitelist: ['html', 'body']
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessorOptions: {safe: true, map: {inline: false}}
        }),
        new VueSSRClientPlugin(),
        new Webpackbar({
            name: 'Client',
            color: 'green'
        })
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: 'initial',
                    name: 'vendor',
                    test: /node_modules/,
                    enforce: true
                }
            },
            minChunks: Infinity
        },
        runtimeChunk: {
            name: 'manifest'
        }
    }
},baseCkeditorConfig);

const serverConfig = merge.smart(baseServerConfig, productionCofig, {
    plugins: [
        new Webpackbar({
            name: 'Server',
            color: 'orange'
        })
    ]
},baseCkeditorConfig);

module.exports = [
    clientConfig,
    serverConfig
];