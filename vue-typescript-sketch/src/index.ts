import Vue from 'vue';
import App from '@/components/App.vue';
import {createApolloClient} from "@/apollo";
import "vue-apollo";
import VueApollo from 'vue-apollo'
import createRouter from "@/router";

function createApp(context) {
    const router = createRouter();

    // sync the router with the vuex store.
    // this registers `store.state.route`
    //sync(store, router);

    // Apollo
    const apolloClient = createApolloClient(context);
    const apolloProvider = new VueApollo({
        defaultClient: apolloClient,
    });

    return {
        app: new Vue({
            el: '#app',
            router,
            apolloProvider,
            render: h => h(App),
        }),
        router,
        apolloProvider,
    }
}

export default createApp