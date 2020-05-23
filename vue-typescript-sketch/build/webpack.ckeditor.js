const path = require('path');
const CKEditorWebpackPlugin = require( '@ckeditor/ckeditor5-dev-webpack-plugin' );
const { styles } = require( '@ckeditor/ckeditor5-dev-utils' );

module.exports = {
    plugins: [
        new CKEditorWebpackPlugin( {
            language: 'en'
        } )
    ],

    module: {
        rules: [
            {
                // Or /ckeditor5-[^/]+\/theme\/icons\/[^/]+\.svg$/ if you want to limit this loader
                test: /\.svg$/,
                include: /@ckeditor/,
                use: [ 'raw-loader' ]
            },
            {
                test: /\.css$/,
                include: /@ckeditor/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            singleton: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: styles.getPostCssConfig( {
                            themeImporter: {
                                themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
                            },
                            // minify: true
                        } )
                    },
                ]
            }
        ]
    }
};