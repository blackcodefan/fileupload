const url = require('url');
const path = require('path');
const express = require('express');
const config = require('./config');
const {createBundleRenderer} = require('vue-server-renderer');
const COOKIE = 'sncookie';
const renderer = createBundleRenderer(require('./dist/server/vue-ssr-server-bundle.json'), {
    runInNewContext: false,
    template: require('fs').readFileSync('./dist/client/index.html', 'utf-8'),
    clientManifest: require('./dist/client/vue-ssr-client-manifest.json')
});

const server = express();

server.use(`/${config.prod.assetPath}`, express.static(config.prod.clientOutputPath));
server.use('/public', express.static(path.resolve(__dirname, './public')));

var get_cookies = function (request) {
    var cookies = {};
    request.headers && request.headers.cookie && request.headers.cookie.split(';').forEach(function (cookie) {
        var parts = cookie.match(/(.*?)=(.*)$/);
        cookies[parts[1].trim()] = (parts[2] || '').trim();
    });
    return cookies;
};

function render(req, res, cookie) {
    let baseUrl = 'https://' + req.get('host');
    renderer.renderToString({baseUrl: baseUrl, url: req.url, token: cookie}).then(html => {
        //console.log(html)
        res.end(html)
    }).catch(err => {
        if (err.code === 404) {
            res.status(404).end('Page not found');
            res.redirect('/');
        } else if (err.code === 401) {
            res.clearCookie(COOKIE);
            res.redirect('/');
        } else {
            res.status(500).end('Internal Server Error');
        }
        console.error(`error during render : ${req.url}`);
        console.error(err)
    })
}

server.get('/', (req, res) => {
    let cookie = get_cookies(req)[COOKIE];
    if (cookie)
        res.redirect('/projects');
    else
        render(req, res, cookie);
});

server.get('/fbAuth', (req, res) => {
    render(req, res);
});

//TODO: open for PDF render to access endpoint
server.get('/PDF/*', (req, res) => {
    render(req, res);
});

server.get('*', (req, res) => {
    let cookie = get_cookies(req)[COOKIE];
    render(req, res, cookie);
});

server.listen(config.prod.port, function () {
    const listenHost = url.format({
        host: `${config.prod.host}:${config.prod.port}`,
        protocol: 'http:'
    });

    console.log(`Application is running on ${listenHost}`)
});
