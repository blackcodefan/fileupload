<template>
    <div class="col-12 lb-filelist">
        <b-btn variant="link" class="btn btn-default text-primary float-left" v-b-toggle="'collapse_' + uuid" v-show="show">
            <i class="fa fa-minus fa-fw"></i> Hide files
        </b-btn>
        <b-btn variant="link" class="btn btn-default text-primary float-left" v-b-toggle="'collapse_' + uuid" v-show="!show && note.fileCount > 0">
            <i class="fa fa-bars fa-fw"></i> Show files (
            <span class="text-primary" id="fileCount">{{note.fileCount? note.fileCount : 0}}</span>
            )
        </b-btn>
        <span v-if="false" class="float-right" data-field="fileListConnectBtn">
					You have disconnected from Dropbox, click
					<a href="/settings">here</a>
					to connect again.
				</span>

        <div class="clear"></div>


        <b-collapse tag="div" :is-nav="true" :id="'collapse_' + uuid" @show="openList()" @hide="closeList()">
            <table class="table table-sm table-hover">
                <thead>
                <tr class="d-flex">
                    <th class="col-sm-1 d-none d-sm-table-cell" scope="col">#</th>
                    <th class="col-sm-1 d-none d-sm-table-cell" scope="col"></th>
                    <th class="col-5 col-sm-4" scope="col">File name</th>
                    <th class="col-sm-2  d-none d-sm-table-cell" scope="col">Date</th>
                    <th class="col-3 col-sm-2" scope="col">Size</th>
                    <th class="col-2 col-sm-1" scope="col"></th>
                    <th class="col-2 col-sm-1" scope="col"></th>
                </tr>
                </thead>
                <tbody id="tableBody">
                <transition-group name="fade">
                    <tr v-for="(item, index) in files" :key='item.id' class="d-flex">
                        <td class="col-sm-1 d-none d-sm-table-cell" scope="row">{{index + 1}}</td>
                        <td class="col-sm-1 d-none d-sm-table-cell" scope="row">
                            <Thumbnail :file="item" :path="getPreviewPath(item.id, 'w32h32')"></Thumbnail>
                        </td>
                        <td class="col-5 col-sm-4 text-truncate">{{item.name}}</td>
                        <td class="col-sm-2 d-none d-sm-table-cell">{{item.createTime | formatDate}}</td>
                        <td class="col-3 col-sm-2">{{humanFileSize(item.size)}}</td>
                        <td class="col-2 col-sm-1"><a @click="preview(item)" v-if="canPreview(item)">View</a></td>
                        <td class="col-2 col-sm-1 text-right">
                            <div class="dropdown">
                                <b-dropdown variant="link" no-caret>
                                    <template slot="button-content">
                                        <i class="fa fa-chevron-down fa-fw"></i>
                                    </template>

                                    <b-dropdown-item-button @click.stop="addToEditor(item)">
                                        <i class="fa fa-caret-square-o-up fa-fw"></i> Add to editor
                                    </b-dropdown-item-button>
                                    <b-dropdown-item @click.stop="" :href="download(item)" download="true">
                                        <i class="fa fa-download fa-fw"></i> Download
                                    </b-dropdown-item>
                                    <!--
                                        <b-dropdown-item-button class="dropdown-item" type="button" id="deleteFileBtn">
                                            <i class="fa fa-trash-o fa-fw"></i> Delete file
                                        </b-dropdown-item-button>
                                        -->
                                </b-dropdown>
                            </div>
                            <!--
                            <i class="fa fa-spinner fa-pulse fa-fw" id="fileDeleteSpinner"/>
                            -->
                        </td>
                    </tr>
                </transition-group>

                <transition-group name="fade">
                    <tr v-for="(item, index) in uploadFiles" :key='item.id' class="d-flex">
                        <td class="col-sm-1 d-none d-sm-table-cell" scope="row"><span>{{item.index}}</span></td>
                        <td class="col-sm-1 d-none d-sm-table-cell" scope="row"><span>{{item.index}}</span></td>
                        <td class="col-5 col-sm-4 text-truncate">
                            <b-progress :max="100" show-progress animated>
                                <span>{{item.name}}</span>
                                <b-progress-bar :value="+item.progress">
                                    {{ item.progress }}%
                                </b-progress-bar>
                            </b-progress>
                        </td>
                        <td class="col-sm-2 d-none d-sm-table-cell">{{new Date(item.file.lastModified) | formatDate}}</td>
                        <td class="col-3 col-sm-2">{{humanFileSize(item.size)}}</td>
                        <td class="col-2 col-sm-1"></td>
                        <td class="col-2 col-sm-1 text-right">
                            <b-button variant="link" class="btn-option" @click="item.active = false" v-show="false">
                                <i class="fa fa-times fa-fw"></i>
                            </b-button>
                        </td>
                    </tr>
                </transition-group>
                </tbody>
            </table>
            <div class="col-12 text-center" v-show="$apollo.loading">
                <i class="fa fa-refresh fa-spin-custom"></i> Loading files...
            </div>
            <div class="col-12 text-center" id="fileListSyncSpinner" aria-hidden="true" style="display: none;">
                <i class="fa fa-refresh fa-spin-custom"></i> Synchronizing with Dropbox...
            </div>
        </b-collapse>
        <!-- https://lian-yue.github.io/vue-upload-component/#/ -->
        <file-upload
                v-if="!hideOnSSR"
                ref="upload"
                :input-id="'fileUpload_' + note.id"
                v-model="uploadFiles"
                :multiple="true"
                :drop="'#dropTarget_' + note.id"
                :drop-directory="false"
                :thread="2"
                :custom-action="customAction"
                @input-file="inputFile"
                @input-filter="inputFilter"
                @input="updatetValue"
        ></file-upload>
        <b-modal class="preview" scrollable size="xl" hide-footer v-model="modalShow">
            <div v-show="!previewHTML && !previewImg" class="text-center">
                <span class="fa fa-spinner fa-spin fa-3x w-100"></span>
            </div>
            <div v-if="previewHTML" v-html="previewHTML">
            </div>
            <img v-if="previewImg" :src="previewImg">
        </b-modal>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import FileUpload from "vue-upload-component";
    import Thumbnail from "@/components/notes/Thumbnail.vue";
    import gql from "graphql-tag";
    import {File, MutationCreateNoteArgs, Note, NoteInput, QueryFilesArgs} from "@/types/graphql";
    import NoSSR from 'vue-no-ssr'
    import {CreateNoteQuery} from "@/queries";
    import {createId} from "@/utils/utils";

    let GetFilesQuery = gql`
                    query getFiles($noteId: ID!, $sync: Boolean = false) {
                          files(noteId: $noteId, sync: $sync){
                              id,createTime,updateTime,name,mimeType,type,size
                            }
                      }
                `;
    @Component({
        components: {Thumbnail, FileUpload, 'no-ssr': NoSSR},
        apollo: {
            files: {
                query: GetFilesQuery,
                variables(): QueryFilesArgs {
                    return {noteId: this.note.id, sync: false}
                },
                skip: true,
                fetchPolicy: "cache-and-network"
            }
        }
    })
    export default class FileList extends Vue {
        @Prop({})
        editMode: boolean;
        @Prop({})
        note: Note;

        uuid = createId();
        show = false;
        files = new Array<File>();
        uploadFiles = new Array<VUFile>();
        isMounted = false;
        hideOnSSR = true;
        modalShow = false;
        previewHTML: string = null;
        previewImg: string = null;
        public DBUploadPath = "https://content.dropboxapi.com/2/files/upload";

        mounted() {
            this.hideOnSSR = false; // now we can safely show the SSR hidden components
            // used to make dropActive work as we have to wait for mounting
            this.$nextTick(() => this.isMounted = true);
        }

        onDragStart(item: File, event: DragEvent) {
            event.dataTransfer.dropEffect = "move";
            // event.dataTransfer.setData('text/plain', JSON.stringify(item));
        }

        addToEditor(item: File) {

        }

        download(item: File): String {
            return this.getPreviewPath(item.id);
        }

        // as the component uses Form post by default and Dropbox only supports direct data post
        async customAction(file: VUFile, component) {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', file.postAction);
            return await component.uploadXhr(xhr, file, file.file.slice())
        }

        get dropActive(): boolean {
            if (!this.isMounted)
                return false;
            if (this.$refs.upload)
                return (this.$refs.upload as FileUpload).dropActive;
            return false;
        }

        openList() {
            this.show = true;
            this.load();
        }

        closeList() {
            this.show = false;
        }

        preview(file: File) {
            this.previewHTML = null;
            this.previewImg = null;
            let ext = file.id.split('.').pop();
            switch (ext) {
                // dropbox supported preview https://www.dropbox.com/developers/documentation/http/documentation#files-get_preview
                case "jpg":
                case "jpeg":
                case "png":
                case "tiff":
                case "tif":
                case "gif":
                case "bmp":
                    this.previewImg = this.getPreviewPath(file.id);
                    break;
                default:
                    window.open(this.getPreviewPath(file.id), "_blank");
                    return;
            }
            this.modalShow = true;
        }

        /*
        Supported image sizes
        w32h32 Void 32 by 32 px.
        w64h64 Void 64 by 64 px.
        w128h128 Void 128 by 128 px.
        w256h256 Void 256 by 256 px.
        w480h320 Void 480 by 320 px.
        w640h480 Void 640 by 480 px.
        w960h640 Void 960 by 640 px.
        w1024h768 Void 1024 by 768 px.
        w2048h1536 Void 2048 by 1536 px.
        */
        getPreviewPath(fileName: string, size = "w2048h1536"): string {
            let path = "/dropbox/thumb/note/" + this.note.id + "/file/" + fileName + "?provId=" + this.getPath(fileName) + "&size=" + size;
            return encodeURI(this.$apiPath + path);
        }

        private getPath(fileName: string) {
            return "/notebook/" + this.$route.params['notebook'] + "/notes/" + this.note.number + "/" + fileName;
        }

        canPreview(value: File): boolean {
            if (value.mimeType && value.mimeType.startsWith("image/"))
                return true;

            let ext = value.id.split('.').pop();
            switch (ext) {
                // dropbox supported preview https://www.dropbox.com/developers/documentation/http/documentation#files-get_preview
                case "pdf":
                case "ai":
                case "doc":
                case "docm":
                case "docx":
                case "eps":
                case "odp":
                case "odt":
                case "pps":
                case "ppsm":
                case "ppsx":
                case "ppt":
                case "pptm":
                case "pptx":
                case "rtf":
                    // as PDF
                    return true;
                case "csv":
                case "ods":
                case "xls":
                case "xlsm":
                case "xlsx":
                    // as HTML
                    return true;
                default:
                    return false;
            }
            return false;
        }

        load() {
            this.$apollo.skipAll = false;
        }

        public async sync() {
            console.log("syncing...");
            try {
                let result = await this.$apollo.query({
                    query: GetFilesQuery,
                    variables: {noteId: this.note.id, sync: true},
                    fetchPolicy: "network-only"
                });
                this.files = result.data.files;
                this.uploadFiles = this.uploadFiles.filter(value => !value.success);
                this.note.fileCount = this.files.length;
            } catch (error) {
                this.$root.$emit("alert", "danger", error);
            }
        }

        async updatetValue(files: VUFile[]) {
        }

        async createDBHeaders(fileName: string): Promise<Map<string, string>> {
            let user: firebase.User = this.$firebase.auth().currentUser;
            let tokenResultPromise = user.getIdTokenResult();

            if (this.note.id == "-1") {
                console.info("Saving note to get a proper id before upload");
                try {
                    let input = {name: "", text: "", tagsIds: []} as NoteInput;
                    let notebookId = this.$route.params['notebook'];
                    await this.$apollo.mutate({
                        mutation: CreateNoteQuery,
                        variables: {notebookId: notebookId, input: input} as MutationCreateNoteArgs,
                        update: (store, {data: {createNote}}) => {
                            this.note.id = createNote.id;
                            this.note.createTime = createNote.createTime;
                            this.note.number = createNote.number;
                        },
                    });
                } catch (err) {
                    this.$root.$emit("alert", "danger", err);
                    throw err;
                }
            }

            // open the file list
            if (!this.show) {
                this.show = true;
                this.$root.$emit('bv::toggle::collapse', 'collapse_' + this.uuid);
            }

            let res = await tokenResultPromise;

            let map = new Map<string, string>();
            let args = {
                "path": this.getPath(fileName),
                "mode": "add",
                "autorename": true,
                "mute": true
            };
            map.set("Authorization", "Bearer " + res.claims.token);
            map.set("Dropbox-API-Arg", this.encodeNonAsciiCharacters(JSON.stringify(args)));
            map.set("Content-Type", "application/octet-stream");
            return map;
        }

        // changed files


        async inputFile(newFile: VUFile, oldFile: VUFile) {
            if (newFile && !oldFile) {
                // add
                newFile.postAction = this.DBUploadPath;
                let headers = await this.createDBHeaders(newFile.name);
                headers.forEach((value, key) => newFile.headers[key] = value);
            } else if (newFile && oldFile) {
                // update
                if (newFile.active && !oldFile.active) {
                    // beforeSend
                    // min size

                }
                if (newFile.progress !== oldFile.progress) {
                    // progress
                }
                if (newFile.error && !oldFile.error) {
                    // error
                    this.$root.$emit("alert", "danger", newFile.error)
                }
                if (newFile.success && !oldFile.success) {
                    // success
                    if (newFile.xhr) {
                        //  Get the response status code
                    }
                    if (this.uploadFiles.every(value => value.active == false)) {
                        this.sync();
                    }
                }

            } else if (!newFile && oldFile) {
                // remove
            }
            if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
                if (!(this.$refs.upload as FileUpload).active) {
                    (this.$refs.upload as FileUpload).active = true
                }
            }
        }

        // files to filter out
        inputFilter(newFile: VUFile, oldFile: VUFile, prevent) {
            if (newFile && !oldFile) {
                // Filter non-image file
                //if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.name)) {
                //    return prevent()
                //}
            }

            // Create a blob field
            /*
            newFile.blob = ''
            let URL = window.URL
            if (URL && URL.createObjectURL) {
                newFile.blob = URL.createObjectURL(newFile.file)
            }
            */
        }

        @Watch("dropActive")
        dropAsdctiveHandler(newVal: boolean, oldVal: boolean) {
            console.log("Drop?", newVal);
            this.$emit('showDropTarget', newVal && !this.editMode);
        }

        humanFileSize(bytes, si = true) {
            var thresh = si ? 1000 : 1024;
            if (Math.abs(bytes) < thresh) {
                return bytes + ' B';
            }
            var units = si
                ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
                : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
            var u = -1;
            do {
                bytes /= thresh;
                ++u;
            } while (Math.abs(bytes) >= thresh && u < units.length - 1);
            return bytes.toFixed(1) + ' ' + units[u];
        }

        encodeNonAsciiCharacters(value: string) {
            let out = "";
            for (let i = 0; i < value.length; i++) {
                const ch = value.charAt(i);
                let chn = ch.charCodeAt(0);
                if (chn <= 127) out += ch;
                else {
                    let hex = chn.toString(16);
                    if (hex.length < 4)
                        hex = "000".substring(hex.length - 1) + hex;
                    out += "\\u" + hex;
                }
            }
            return out;
        }

    }
</script>

<style lang="scss">
    .modal-xl { // scoped does not work here. Why?
        min-width: 100% !important;
        margin: 0 !important;
        min-height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
    }
</style>