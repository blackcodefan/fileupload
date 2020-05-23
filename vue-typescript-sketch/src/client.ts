import Vue from 'vue';
import createApp from './index';
import config from '../config';
// import '@/assets/bootstrap/custom/custom.css'
//import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm';
import CKEditor from '@ckeditor/ckeditor5-vue';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import moment from 'moment'


Vue.use(BootstrapVue);
Vue.use(CKEditor);
Vue.filter('formatDate', function (value) {
    if (value) {
        return moment(String(value)).format('lll')
    }
});

Vue.filter('formatDateSmall', function (value) {
    if (value) {
        return moment(String(value)).format('l')
    }
});


//console.log(config.fbKey);
firebase.initializeApp(config.fbKey);

const {app, router, apolloProvider} = createApp({
    ssr: false,
    url: config.apiPath + '/query',
});

/* Bind firebase to your Vue instance */
Vue.prototype.$firebase = firebase;
Vue.prototype.$apiPath = config.apiPath;
Vue.prototype.$dropboxImagePath = config.dropboxImagePath;


    // LoginPopUp sends the login token so we can login on frontend and backend domains
    // eg. when running frontend on localhost and API on external server
    window.addEventListener('message', function (event) {
        if (event.origin !== config.apiPath) return;
        console.info("Got token running localhost");
        firebase.auth().signInWithCustomToken(event.data);
    }, false);

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            // dont force refresh
            console.log("Auth state changed setting token");
            user.getIdToken(false).then(function (accessToken) {
                setCookie('sncookie', accessToken, 100);
                let loc = router.currentRoute.query.redirect ? router.currentRoute.query.redirect as string :
                    (router.currentRoute.fullPath == '/') ? '/projects' : router.currentRoute;
                router.replace(loc);
            });
        } else {
            // User is signed out.
            // forward to login
            console.log("User logged out");
            setCookie('sncookie', 0, -1);
        }
    }, function (error) {
        console.log(error);
    });

    // we need to keep the token updated as it expires every 1 hour
    setInterval(function () {
        updateToken(); // this starts the promise
    }, 55 * 60 * 1000);
    window.onfocus = function () {
        updateToken();
    };


function updateToken() {
    return new Promise(function (resolve, reject) {
        let user = firebase.auth().currentUser;
        console.log("Refreshing token for " + user);
        if (user) {
            user.getIdToken( /* forceRefresh */ true).then(function (accessToken) {
                setCookie('sncookie', accessToken, 100);
                resolve(accessToken);
            }).catch(function (error) {
                console.log(error);
                reject(error);
            });
        } else {
            setCookie('sncookie', 0, -1);
            resolve(null);
        }
    });
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
