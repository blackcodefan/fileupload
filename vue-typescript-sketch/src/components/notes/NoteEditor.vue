<template>
    <div :id="'dropTarget_' + currentNote.id" class="col-12 thumbnail">

        <div v-show="showDropTarget" class="lb-updating" update-text="Drop to upload"></div>

        <!-- Labnote header START -->
        <div class="col-12 lb-labnote-header top fixedsticky" id="top-a">
            <div class="col-8 float-left text-nowrap">
                <span>#</span>
                <span id="number">{{currentNote.number}}</span>
                <input v-model="currentNote.name" id="title" placeholder="Enter title..." :disabled="!editMode"/>
                <span id="dateLong" class="lb-labnote-date d-none d-md-inline">{{currentNote.createTime | formatDate}}</span>
                <span id="dateShort" class="lb-labnote-date d-md-none d-inline">{{currentNote.createTime | formatDateSmall}}</span>
            </div>
            <div class="col-4 float-right text-right text-nowrap">
                    <span class="lb-deleted-mode-show">
                        <i class="fa fa-trash-o fa-fw text-danger"></i>
                    </span>
                <!--
                <b-btn variant="link" v-show="!editMode" @click="sync()" class="lb-deleted-mode-hide"
                       title="Synchronize files with Dropbox">
                    <span class="lnr lnr-sync"></span>
                </b-btn>
                -->
                <b-btn variant="link" v-show="!editMode" @click="edit()" :disabled="!ckLoaded" class="lb-deleted-mode-hide" title="Edit Note">
                    <!-- <i class="fa fa-pencil" aria-hidden="true"></i><span> Edit</span> -->
                    <span v-show="!spinner" class="lnr lnr-pencil" aria-hidden="true"></span>
                    <span v-show="spinner" class="spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true"></span>
                </b-btn>
                <b-btn variant="link" v-show="editMode" @click="cancel()" title="Discard changes">
                    <!-- <i class="fa fa-times-circle" aria-hidden="true"></i><span class="hidden-sm-down"> Cancel</span> -->
                    <span class="lnr lnr-cross" aria-hidden="true"></span>
                </b-btn>
                <b-btn variant="link" v-show="editMode" @click="save()" title="Save changes">
                    <!-- <i class="fa fa-check" aria-hidden="true"></i><span class="hidden-sm-down"> Save</span> -->
                    <span class="lnr lnr-checkmark-circle" aria-hidden="true"></span>
                </b-btn>
                <div class="dropdown">
                    <b-dropdown variant="link" no-caret>
                        <template slot="button-content">
                            <span class="lnr lnr-chevron-down"></span>
                        </template>
                        <!--
                        <b-dropdown-item-button style="cursor: move; z-index: 10;" id="dragBtn" draggable="true">
                            <i class="fa fa-arrows-alt fa-fw"></i> Drag to move to project
                        </b-dropdown-item-button>
                        -->
                        <b-dropdown-item-button>
                            <i class="fa fa-globe fa-fw"></i> Share
                        </b-dropdown-item-button>
                        <b-dropdown-item-button @click="upload">
                            <i class="fa fa-upload fa-fw"></i> Upload files
                        </b-dropdown-item-button>
                        <!--
                        <b-dropdown-item-button>
                            <i class="fa fa-files-o fa-fw"></i> Duplicate note
                        </b-dropdown-item-button>
                        -->
                        <b-dropdown-item-button @click="print">
                            <i class="fa fa-print fa-fw"></i> Print
                        </b-dropdown-item-button>
                        <b-dropdown-item-button @click="openPDF">
                            <i class="fa fa-file-pdf-o fa-fw" aria-hidden="true"></i> Open as PDF
                        </b-dropdown-item-button>
                        <!--
                        <b-dropdown-item-button >
                            <i class="fa fa-trash-o fa-fw"></i> Delete
                        </b-dropdown-item-button>
                        <b-dropdown-item-button>
                            <i class="fa fa-undo fa-fw"></i> Undelete
                        </b-dropdown-item-button>
                        <b-dropdown-item-button>
                            <i class="fa fa-trash-o fa-fw"></i> Delete permanently
                        </b-dropdown-item-button>
                        -->
                    </b-dropdown>
                </div>
            </div>
        </div>
        <!-- Note header END -->

        <!-- Labnote content START  -->
        <div class="col-12 lb-labnote-content">
            <div class="ck-editor" id="ckEditor">
                <component v-bind:is="cke" :note="currentNote" :editMode="editMode"></component>
                <div v-show="!editMode" v-html="note.text"></div>
            </div>
        </div>

        <Tags :editMode="editMode" :note="currentNote"></Tags>

        <FileList ref="fileList" :editMode="editMode" :note="currentNote" @showDropTarget="dropTarget"></FileList>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import FileList from "@/components/notes/FileList.vue";
    import _ from 'lodash';
    import Tags from "@/components/notes/Tags.vue";

    import {MutationCreateNoteArgs, MutationUpdateNoteArgs, Note, QueryNotesArgs, QursorResult} from "@/types/graphql";
    import gql from "graphql-tag";
    import {CreateNoteQuery, GetNotesQuery} from "@/queries";
    import {VueApolloMutationOptions} from "vue-apollo/types/options";
    import {DataProxy} from 'apollo-cache';


    const UpdateMutation = gql`
                mutation updateNote($id: ID!, $input: NoteInput!){
                             updateNote(id: $id, input: $input){
                              id,createTime,name,text,number,fileCount,tags{
                                    id,name
                                  }
                            }
                          }
                    `;

    @Component({
        components: {Tags, FileList}
    })
    export default class NoteEditor extends Vue {
        @Prop({})
        private note: Note;

        private cke = null;
        private noteCopy: Note = null;
        private editMode = false;


        private spinner = false;
        showDropTarget = false;
        ckLoaded = false;

        get currentNote(): Note {
            if (this.editMode)
                return this.noteCopy;
            return this.note;
        }

        mounted() {
            console.log("Loading CKEditor");
            this.cke = () => import("@/components/notes/CKEditorWrapper.vue").then(value => {
                this.ckLoaded = true;
                return value;
            });
            if (this.note.id == '-1') {
                this.edit();
            }
        }

        dropTarget(show: boolean) {
            this.showDropTarget = show;
        }


        edit() {
            if (this.$root.$data.currentNote) {
                return window.alert('You have unsaved changes in note: ' + this.$root.$data.currentNote.number)
            }
            this.noteCopy = _.cloneDeep(this.note);
            this.$root.$data.currentNote = this.noteCopy;
            this.editMode = true;
        }

        async save() {
            this.editMode = false;
            this.$root.$data.currentNote = null;
            if (_.isEqual(this.note, this.noteCopy)) {
                return;
            }
            this.spinner = true;
            try {
                // Call to the graphql mutation
                await this.$apollo.mutate(this.getOptions());
            } catch (err) {
                this.editMode = true;
                this.$root.$data.currentNote = this.noteCopy;
                this.$root.$emit("alert", "danger", err);
            }
            this.spinner = false;
        }

        cancel() {
            this.note.fileCount = this.$root.$data.currentNote.fileCount;
            this.$root.$data.currentNote = null;
            this.editMode = false;

            // if note has not been saved yet (eg. because of file upload) we can just delete it from cache
            this.noteCopy.name = this.note.name;
            this.noteCopy.text = this.note.text;
            this.updateCache(this.$apollo.provider.defaultClient, this.noteCopy);
        }

        sync() {
            // @ts-ignore
            this.$refs.fileList.sync();
        }

        print() {
            const win = window.open("/PDF/" + this.note.id, "_blank");
            win.focus(); //IE fix
        }

        openPDF() {
            let serverUrl = window.location.protocol + "//" + window.location.hostname;
            let pdfUrl = serverUrl + "/dropbox/pdfDownload";
            let param = serverUrl + "/PDF/" + this.note.id;
            let finalUrl = pdfUrl + "?" + "targetURL=" + encodeURI(param);
            console.info("Fetching PDF: " + finalUrl);
            window.open(finalUrl, "pdf", "");
        }

        upload() {
            // get upload widget and click it
            let fu = (this.$refs.fileList as FileList).$refs.upload as Vue;
            let elm = fu.$children[0];
            (elm.$el as HTMLElement).click();
        }

        @Watch("editMode")
        watchOnbeforeunload(value: boolean, oldValue: boolean) {
            window.onbeforeunload = null;
            if (value) {
                let that = this;
                window.onbeforeunload = function () {
                    return 'Do you really want to leave? you have unsaved changes in note: ' + that.$root.$data.currentNote.number
                }
            }
        }

        private getOptions(): VueApolloMutationOptions<any, any> {
            let input = {
                input: {
                    name: this.noteCopy.name,
                    text: this.noteCopy.text,
                    tagsIds: this.noteCopy.tags.map(value => value.id),
                }
            } as MutationCreateNoteArgs;

            if (this.noteCopy.id != '-1') {
                console.info("saving note:", this.noteCopy);
                return {
                    mutation: UpdateMutation,
                    variables: {id: this.noteCopy.id, ...input} as MutationUpdateNoteArgs,
                    update: (store, {data: {updateNote}}) => {
                        this.updateCache(store, updateNote);
                    },
                    optimisticResponse: {
                        __typename: 'Mutation',
                        updateNote: this.noteCopy
                    }
                };
            } else {
                return {
                    mutation: CreateNoteQuery,
                    variables: {notebookId: this.$route.params['notebook'], ...input} as MutationCreateNoteArgs,
                    update: (store, {data: {createNote}}) => {
                        this.updateCache(store, createNote);
                    },
                    optimisticResponse: {
                        __typename: 'Mutation',
                        createNote: this.noteCopy
                    }
                };
            }
        }

        private updateCache(store: DataProxy, note: Note) {
            let notebookId = this.$route.params['notebook'];
            // Read the data from our cache for this query.
            let query = {
                query: GetNotesQuery,
                variables: {notebookId: notebookId, filter: "", cursor: ""} as QueryNotesArgs
            };
            let data = store.readQuery(query);

            // @ts-ignore
            let qr: QursorResult = data.items as QursorResult;
            let index = qr.result.findIndex(value => value.id == '-1');
            //console.log(index, note, qr.result);
            if (index >= 0) {
                if (note.id != '-1')
                    qr.result.splice(index, 1, note);
                else
                    qr.result.shift();
                // Write our data back to the cache.
                store.writeQuery({...query, data})
            }
        }
    }
</script>

<style lang="scss">


</style>