import * as firebase from 'firebase/app';
import NoteList from "@/components/notes/NoteList.vue";
import About from "@/components/About.vue";
import Terms from "@/components/Terms.vue";
import Privacy from "@/components/Privacy.vue";
import Front from "@/components/Front.vue";
import Sketch from "@/components/Sketch.vue";

function requireAuth(to, from, next) {
    if (!firebase.auth().currentUser) {
        next({path: '/', query: {redirect: to.fullPath}})
    } else {
        next()
    }
}

export default [
    {
        path: '/',
        component: () => import('@/pages/FrontPage.vue'),
        children: [
            {
                path: '',
                component: Front
            },
            {
                path: 'about',
                component: About
            },
            {
                path: 'terms',
                component: Terms
            },
            {
                path: 'privacy',
                component: Privacy
            },
            {
                path: 'sketch',
                component: Sketch
            }
        ],
    },
    {
        path: '/projects',
        component: () => import('@/pages/NotesPage.vue'),
        children: [
            {
                path: ':project/notebook/:notebook',
                component: NoteList
            }
        ],
        //beforeEnter: requireAuth
    },
    {
        path: '/fbAuth',
        component: () => import('@/pages/LoginPopUp.vue')
    },
    {
        path: '/PDF/:noteId',
        component: () => import('@/pages/PDFPage.vue'),
        props: true
    },
    {
        path: '*',
        redirect: '/'
    }
];