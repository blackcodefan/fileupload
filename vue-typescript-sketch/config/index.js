const dev = require('./dev');
const prod = require('./prod');

const devkey = {
    apiKey: "AIzaSyCkGDtWGUcT_GeeV63J-ItAs8_NQ6vr5Hs",
    authDomain: "sn-dev-1ba7d.firebaseapp.com",
    databaseURL: "https://sn-dev-1ba7d.firebaseio.com",
    projectId: "sn-dev-1ba7d",
    storageBucket: "sn-dev-1ba7d.appspot.com",
    messagingSenderId: "34656384497"
};

module.exports = {
    env: process.env.NODE_ENV || 'development',
    title: 'ScientificNotes - The free integrated notebook platform',
    dropboxImagePath: "https://www.dropbox.com/home/Apps/ScientificNotes",
    fbKey: process.env.WEB_KEY || devkey, //# FIREBASE_WEB_KEY_PROD is added to the environment by CI run
    apiPath: process.env.API_PATH || '', // API_PATH=xxx path to REST api
    dev,
    prod
};