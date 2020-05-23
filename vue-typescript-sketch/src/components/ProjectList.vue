<template>
    <ul class="list-group">
        <li v-for="(item, index) in items" :key='index'>
            <ul class="list-group">
                <li class="list-group-item lb-deleted-mode-hide" v-b-toggle="'notebooknav' + item.id">
                    <span>{{ item.name }}</span>
                    <span>
                        <b-dropdown variant="link" no-caret>
                            <template slot="button-content">
                                <i class="fa fa-chevron-circle-down" aria-hidden="true"></i>
                            </template>
                            <b-dropdown-item-button @click.stop="editProject(item)" class="lb-deleted-mode-hide">
                                <i class="fa fa-pencil fa-fw"></i> Edit project
                            </b-dropdown-item-button>
                            <b-dropdown-item-button @click.stop="deleteProject(item)" class="lb-deleted-mode-hide">
                                <i class="fa fa-trash-o fa-fw"></i> Delete project
                            </b-dropdown-item-button>
                            <b-dropdown-item-button class="lb-deleted-mode-show">
                                <i class="fa fa-undo fa-fw"></i> Undelete
                            </b-dropdown-item-button>
                            <b-dropdown-item-button class="lb-deleted-mode-show">
                                <i class="fa fa-trash-o fa-fw"></i> Delete permanently
                            </b-dropdown-item-button>
                        </b-dropdown>
                    </span>
                    <b-button variant="link" class="float-right" @click.stop="createNotebook(item)"
                              title="Create new notebook"><i class="fa fa-plus" aria-hidden="true"></i></b-button>
                </li>
                <NotebookList :project="item" :index="index"></NotebookList>
            </ul>
        </li>
        <li class="list-group-item lb-project-active lb-deleted-mode-hide">
            <a href="#PROJECT=all;">
                <span> VIEW ALL NOTES</span>
            </a>
        </li>
    </ul>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import NotebookList from "@/components/NotebookList.vue";
    import gql from "graphql-tag";
    import {Notebook, Project} from "@/types/graphql";


    const GetProjectsQuery = gql`
                query  getProjects{
                    items: projects {id,name}
                }
            `;

    @Component({
        components: {NotebookList},
        apollo: {
            items: {
                query: GetProjectsQuery
            }
        }
    })
    export default class ProjectList extends Vue {
        items: Project[] = [];

        serverPrefetch() {

        }

        mounted() {

        }

        createNotebook(project: Project): void {
            if (this.$root.$data.currentNote) {
                alert("finish note before adding more");
                return;
            }
            let notebook = {moaoType: 'Notebook'};
            this.$root.$emit('editNotebook', notebook, project);
        }

        editProject(project: Project) {
            this.$root.$emit('editProject', project);
        }

        deleteProject(project: Project) {
        }

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="scss" scoped>
    .dropdown {
        top: 0rem;
    }
</style>
