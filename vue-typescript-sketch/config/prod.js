const path = require('path');
const {merge} = require('lodash');

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8089;

const config = {
    clientOutputPath: path.resolve(__dirname, '../dist/client'),
    serverOutputPath: path.resolve(__dirname, '../dist/server'),
    host: 'localhost',
    port: PORT,
    assetPath: 'assets'
};

module.exports = merge(config, {
    publicPath: `/${config.assetPath}/`
});