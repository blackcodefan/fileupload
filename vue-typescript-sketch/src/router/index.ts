import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';

Vue.use(VueRouter);

const createRouter = () => {
    let r = new VueRouter({
        mode: 'history',
        routes
    });

    r.beforeEach((to, from, next) => {
        if (r.app.$root.$data && r.app.$root.$data.currentNote) {
            const answer = window.confirm('Do you really want to leave? you have unsaved changes in note: ' + r.app.$root.$data.currentNote.number);
            if (!answer)
                return next(false);
            r.app.$root.$data.currentNote = null;
            window.onbeforeunload = null; // the NoteEditor will add a function when in edit mode
        }
        return next();
    });

    return r;
};

export default createRouter;