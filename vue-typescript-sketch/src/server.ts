import Vue from 'vue';
import config from '../config';
import createApp from './index';
import ApolloSSR from 'vue-apollo/ssr'
import BootstrapVue from 'bootstrap-vue'

export default context => {
    return new Promise((resolve, reject) => {
        Vue.use(BootstrapVue);

        let baseURL = config.apiPath ? config.apiPath : context.baseUrl;
        console.log("Using baseURL: " + baseURL);
        const {app, router, apolloProvider} = createApp({
            ssr: true,
            token: context.token,
            url: baseURL + '/query',
        });

        // set router's location
        router.push(context.url);

        // wait until router has resolved possible async hooks
        router.onReady(() => {
            // This `rendered` hook is called when the app has finished rendering
            context.rendered = () => {
                // After the app is rendered, our store is now
                // filled with the state from our components.
                // When we attach the state to the context, and the `template` option
                // is used for the renderer, the state will automatically be
                // serialized and injected into the HTML as `window.__INITIAL_STATE__`.
                //context.state = store.state;

                // ALso inject the apollo cache state
                context.apolloState = ApolloSSR.getStates(apolloProvider)
            };
            resolve(app)
        })
    });
}