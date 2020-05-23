import Vue from 'vue'
import fetch from 'node-fetch';
import VueApollo from 'vue-apollo'
import {ApolloClient} from 'apollo-client'
import {HttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'

// Install the vue plugin
Vue.use(VueApollo);

// Create the apollo client
export function createApolloClient(context) {
    const httpLink = new HttpLink({
        // You should use an absolute URL here
        uri: context.url,
        headers: {"Authorization": "Bearer " + context.token},
        credentials: 'include',
        fetch: fetch
    });

    const cache = new InMemoryCache();

    // If on the client, recover the injected state
    if (!context.ssr) {
        if (typeof window !== 'undefined') {
            // @ts-ignore
            const state = window.__APOLLO_STATE__;
            if (state) {
                // If you have multiple clients, use `state.<client_id>`
                cache.restore(state.defaultClient)
            }
        }
    }

// Create the apollo client
    return new ApolloClient({

        link: httpLink,
        connectToDevTools: true,
        cache,
        ...(context.ssr ? {
            // Set this on the server to optimize queries when SSR
            ssrMode: true,
        } : {
            // This will temporary disable query force-fetching
            ssrForceFetchDelay: 100,
        }),
    });
}

