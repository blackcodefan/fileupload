<template>
    <b-collapse tag="li" :is-nav="true" :id="'notebooknav' + project.id" @show="load()" v-model="toggle">
        <ul class="list-group">
            <!-- Spinner -->
            <li class="list-group-item" v-show="$apollo.loading">
                <i class="fa fa-refresh fa-spin-custom lb-padded-text"></i> Loading notebooks
            </li>

            <transition-group name="fade">
                <router-link tag="li" :to="{path: '/projects/' + project.id + '/notebook/' + item.id}"
                             v-for="(item, index) in items" :key='item.id'>
                    <ul class="list-group">
                        <li class="list-group-item lb-deleted-mode-hide">
                            <span>{{ item.name }}</span>
                            <span>
                            <b-dropdown variant="link" no-caret>
                                <template slot="button-content">
                                    <i class="fa fa-chevron-circle-down" aria-hidden="true"></i>
                                </template>
                                <b-dropdown-item-button @click.stop="editHandler(item)" class="lb-deleted-mode-hide">
                                    <i class="fa fa-pencil fa-fw"></i> Edit
                                </b-dropdown-item-button>
                                <b-dropdown-item-button @click.stop="deleteHandler(item)" class="lb-deleted-mode-hide">
                                    <i class="fa fa-trash-o fa-fw"></i> Delete
                                </b-dropdown-item-button>
                                <b-dropdown-item-button class="lb-deleted-mode-show">
                                    <i class="fa fa-undo fa-fw"></i> Undelete
                                </b-dropdown-item-button>
                                <b-dropdown-item-button class="lb-deleted-mode-show">
                                    <i class="fa fa-trash-o fa-fw"></i> Delete permanently
                                </b-dropdown-item-button>
                            </b-dropdown>
                        </span>
                        </li>
                    </ul>
                </router-link>
            </transition-group>
        </ul>
    </b-collapse>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import gql from "graphql-tag";
    import {Notebook, Project, QueryNotebooksArgs} from "@/types/graphql";

    const GetNotebooksQuery = gql`
                query
                  getNotebooks($projectId: ID!) {
                    items: notebooks(projectId: $projectId){id,name}
                  }
            `;
    @Component({
        components: {},
        apollo: {
            items: {
                query: GetNotebooksQuery,
                variables(): QueryNotebooksArgs {
                    return {projectId: this.project.id}
                },
                skip: true

            }
        }
    })
    export default class NotebookList extends Vue {
        @Prop({})
        project: Project;
        @Prop({})
        index: number;

        items: Notebook[] = [];

        private toggle = false;

        mounted() {
            this.toggle = this.$route.params['project'] == this.project.id
        }

        editHandler(notebook: Notebook) {
            this.$root.$emit('editNotebook', notebook, this.project);
        }

        deleteHandler(project: Project) {
        }

        openNotebook(notebook: Notebook) {
            this.$router.push("/notes/project/" + this.project.id + "/notebook/" + notebook.id)
        }

        load() {
            this.$apollo.skipAll = false;
        }

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="scss" scoped>
    .dropdown {
        top: 0rem;
    }
</style>
