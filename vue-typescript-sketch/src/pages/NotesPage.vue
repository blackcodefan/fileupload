<template>
    <div id="top-layer">
        <CreateProjectDialog></CreateProjectDialog>
        <CreateNotebookDialog></CreateNotebookDialog>
        <CreateTagDialog></CreateTagDialog>

        <div id="navbar">
            <NavBar></NavBar>
        </div>
        <div class="container-fluid">
            <div id="alerts">
                <div></div>
            </div>

            <div class="clearfix"></div>

            <div class="row">
                <div class="lb-page-wrapper col-12 pr-0">
                    <div id="sidebar">
                        <SideBar></SideBar>
                    </div>
                    <div id="content">
                        <router-view/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import NavBar from '@/components/NavBar.vue';
    import SideBar from '@/components/SideBar.vue';
    import CreateProjectDialog from "@/components/dialogs/CreateProjectDialog.vue";
    import CreateNotebookDialog from "@/components/dialogs/CreateNotebookDialog.vue";
    import CreateTagDialog from "@/components/dialogs/CreateTagDialog.vue";

    @Component({
        components: {
            CreateTagDialog,
            SideBar,
            NavBar, CreateNotebookDialog, CreateProjectDialog,
        },
    })
    export default class NotesPage extends Vue {
        static asyncData({store, route}) {
            // return the Promise from the action
            let promise1 = store.dispatch('fetchProjects');
            if (!route.params['notebook'])
                return promise1;
            let promise2 = store.dispatch('getNotes', {notebookId: (route.params['notebook'] || "x"), cursor: "", filter: ""});
            return Promise.all([promise1, promise2])


        }
    }
</script>

<style>

</style>
