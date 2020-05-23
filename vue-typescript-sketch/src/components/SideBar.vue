<template xmlns:th="http://www.w3.org/1999/xhtml">
    <div>
        <!-- Sidebar wrapper START -->
        <div class="lb-sidebar-wrapper" th:fragment="sidebar">
            <!-- Project-select START  -->
            <div class="col-md-12 lb-sidebar-projects">

                <!-- NEW note  -->
                <div class="lb-newnote text-center">
                    <b-btn variant="link" title="Create new note" @click.stop="createNote()">
                        <i class="fa fa-plus"></i> New note
                    </b-btn>
                </div>


                <div class="lb-sidebar-header">PROJECTS
                    <b-btn variant="link" @click.stop="createProject()" class="float-right text-primary" title="Create new project">
                        <i class="fa fa-plus"></i>
                    </b-btn>
                </div>

                <!-- Remove collapse function of project sidebar -->
                <div id="projectListSidebar">
                    <ProjectList ref="createProjectDialog"></ProjectList>
                </div>
            </div>
            <!-- Project-select END  -->

            <!-- Deleted items START  -->
            <div class="col-md-12 lb-sidebar-projects">
                <div class="lb-sidebar-header">
                    <i class="fa fa-trash-o fa-fw"></i> DELETED
                    <button class="float-right" type="button" data-toggle="collapse"
                            data-target="#deletedProjectListSidebar"
                            aria-expanded="true" aria-controls="listNotes">
                        <i class="fa fa-bars"></i>
                    </button>
                </div>
                <div class="collapse" id="deletedProjectListSidebar">
                    <ul class="list-group" data-field="smallDeletedProjectList" th:remove="all-but-first">
                        <!-- Spinner -->
                        <li class="list-group-item" data-field="smallDeletedProjectListSpinner">
                            <i class="fa fa-refresh fa-spin-custom lb-padded-text"></i> Loading
                        </li>
                        <li class="list-group-item lb-project-active lb-deleted-mode-show"
                            data-field="smallDeletedProjectListAll">
                            <a href="#deleted">
                                <i class="fa fa-angle-right fa-fw"></i>
                                <span> Deleted notes</span>
                            </a>
                        </li>
                        <li>
                            <ul data-field="smallProjectDeletedListItems" class="list-group" data-role="dummy">
                                <li class="list-group-item lb-deleted-mode-show" data-field="smallDeletedProjectListItem">
                                    <a href="#" data-field="smallProjectListAnchor">
                                        <i class="fa fa-angle-right fa-fw">&nbsp;</i>
                                        <span data-field="smallProjectListName"> Project 1</span>
                                    </a>
                                    <div class="dropdown">
                                        <button type="button" class="dropdown-toggle btn-option" data-toggle="dropdown"
                                                aria-haspopup="true" aria-expanded="false">
                                            <i class="fa fa-chevron-circle-down" aria-hidden="true"></i>
                                        </button>
                                        <div class="dropdown-menu dropdown-menu-right">
                                            <button class="dropdown-item" type="button"
                                                    data-field="smallProjectListUndeleteBtn">
                                                <i class="fa fa-undo fa-fw"></i> Undelete
                                            </button>
                                            <button class="dropdown-item" type="button"
                                                    data-field="smallProjectListDeletePermBtn">
                                                <i class="fa fa-trash-o fa-fw"></i> Delete permanently
                                            </button>
                                        </div>
                                    </div>
                                </li>

                                <li class="list-group-item lb-project-active lb-project-deleted">
                                    <a href="#">
                                        <i class="fa fa-angle-right fa-fw">&nbsp;</i>
                                        <span> Project 2</span>
                                    </a>
                                    <div class="dropdown">
                                        <button type="button" class="dropdown-toggle btn-option" data-toggle="dropdown"
                                                aria-haspopup="true" aria-expanded="false">
                                            <i class="fa fa-cog" aria-hidden="true"></i>
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <!-- Deleted items END  -->

                <!-- Labnotes list -->
                <div class="col-md-12 lb-sidebar-projects lb-labnote-list" id="noteListSidebar">
                    <div class="lb-infinity-scroll" style="overflow: auto; position: relative; zoom: 1;">
                        <div style="position: relative; zoom: 1;">
                            <ul class="list-group" data-role="dummy" data-field="smallNoteList">
                                <li th:remove="all">
                                    <ul class="list-group" data-role="dummy" data-field="smallNoteListItems">
                                        <li class="list-group-item" data-field="smallNoteListItem">
                                            <a href="#" data-field="smallNoteListAnchor">
                                                <span>#</span>
                                                <span data-field="smallNoteListNumber">42</span>
                                                <span data-field="smallNoteListName">Note title</span>
                                                <br>
                                                <span class="lb-labnote-date hidden-sm-down" data-field="smallNoteListDate">June 12, 10:23</span>
                                            </a>
                                        </li>
                                        <li class="list-group-item ">
                                            <a href="#">
                                                <span>#</span>
                                                <span>42</span>
                                                <span>Note title</span>
                                                <br>
                                                <span class="lb-labnote-date hidden-sm-down">June 12, 10:23</span>
                                            </a>
                                        </li>
                                        <li class="list-group-item ">
                                            <a href="#">
                                                <span>#</span>
                                                <span>42</span>
                                                <span>Note title</span>
                                                <br>
                                                <span class="lb-labnote-date hidden-sm-down">June 12, 10:23</span>
                                            </a>
                                        </li>
                                        <li class="list-group-item ">
                                            <a href="#">
                                                <span>#</span>
                                                <span>42</span>
                                                <span>Note title</span>
                                                <br>
                                                <span class="lb-labnote-date hidden-sm-down">June 12, 10:23</span>
                                            </a>
                                        </li>
                                        <li class="list-group-item ">
                                            <a href="#">
                                                <span>#</span>
                                                <span>42</span>
                                                <span>Note title</span>
                                                <br>
                                                <span class="lb-labnote-date hidden-sm-down">June 12, 10:23</span>
                                            </a>
                                        </li>
                                        <li class="list-group-item ">
                                            <a href="#">
                                                <span>#</span>
                                                <span>42</span>
                                                <span>Note title</span>
                                                <br>
                                                <span class="lb-labnote-date hidden-sm-down">June 12, 10:23</span>
                                            </a>
                                        </li>
                                        <li class="list-group-item ">
                                            <a href="#">
                                                <span>#</span>
                                                <span>42</span>
                                                <span>Note title</span>
                                                <br>
                                                <span class="lb-labnote-date hidden-sm-down">June 12, 10:23</span>
                                            </a>
                                        </li>
                                        <li class="list-group-item ">
                                            <a href="#">
                                                <span>#</span>
                                                <span>42</span>
                                                <span>Note title</span>
                                                <br>
                                                <span class="lb-note-date hidden-sm-down">June 12, 10:23</span>
                                            </a>
                                        </li>
                                        <li class="list-group-item ">
                                            <a href="#">
                                                <span>#</span>
                                                <span>42</span>
                                                <span>Note title</span>
                                                <br>
                                                <span class="lb-note-date hidden-sm-down">June 12, 10:23</span>
                                            </a>
                                        </li>
                                        <li class="list-group-item ">
                                            <a href="#">
                                                <span>#</span>
                                                <span>42</span>
                                                <span>Note title</span>
                                                <br>
                                                <span class="lb-labnote-date hidden-sm-down">June 12, 10:23</span>
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <!-- Spinner -->
                                <li class="list-group-item" data-field="smallNoteListSpinner">
                                    <i class="fa fa-refresh fa-spin-custom lb-padded-text"></i> Loading notes
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import ProjectList from '@/components/ProjectList.vue';
    import {Note, Project, QueryNotesArgs} from "@/types/graphql";
    import {GetNotesQuery} from "@/queries";
    import {ObservableQuery} from 'apollo-client';
    import {DataProxy} from 'apollo-cache';

    @Component({
        components: {ProjectList},
    })
    export default class SideBar extends Vue {
        observableQuery: ObservableQuery<any, QueryNotesArgs>;

        mounted() {
            this.observableQuery = this.$apolloProvider.defaultClient.watchQuery(this.getOptions());
        }

        async createNote() {
            if (this.$root.$data.currentNote) {
                return window.alert('You have unsaved changes in note: ' + this.$root.$data.currentNote.number)
            }

            let notebookId = this.$route.params['notebook'];

            this.$router.replace({query: {}});
            if (notebookId) {
                // the cache for this query could be empty (eg. after reload etc.)
                // this will make sure the query is in the cache before we update
                await this.observableQuery.result();

                let options = this.getOptions();
                const data = this.$apollo.provider.defaultClient.readQuery(options);
                console.log(data);

                const newNote = {
                    __typename: 'Note',
                    id: '-1',
                    name: '',
                    text: '',
                    createTime: new Date(),
                    fileCount: 0,
                    number: (data.items.result.length > 0) ? (data.items.result[0].number + 1) : 1,
                    tags: []
                } as Note;

                data.items.result.unshift(newNote);
                options.data = data;
                this.$apollo.provider.defaultClient.writeQuery(options);
            } else {
                window.alert("Select notebook first")
            }

            window.scrollTo(0, 0);

        }

        createProject(): void {
            let project = {name: ''} as Project;
            this.$root.$emit('editProject', project);
        }

        private getOptions(): DataProxy.WriteQueryOptions<any, QueryNotesArgs> {
            return {
                query: GetNotesQuery,
                data: null,
                variables: {notebookId: this.$route.params['notebook'], filter: "", cursor: ""} as QueryNotesArgs
            };
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
