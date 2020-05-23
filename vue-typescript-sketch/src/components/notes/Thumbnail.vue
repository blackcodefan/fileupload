<template>
    <img v-if="img" :src="img" @error="imgError()">
    <i v-else-if="clazz" :class="clazz" aria-hidden="true"></i>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {File} from "@/types/graphql";

    @Component({
        components: {}
    })
    export default class Thumbnail extends Vue {
        @Prop({})
        file: File;
        @Prop({})
        path: string;
        img: string = null;
        clazz: string = null;

        imgError() {
            console.error("Error getting image: " + this.img);
            this.img = null;
            this.clazz = "fa fa-file-image-o";
        }
        mounted() {

            let ext = this.file.id.split('.').pop();
            switch (ext) {
                // dropbox supported preview https://www.dropbox.com/developers/documentation/http/documentation#files-get_preview

                case "jpg":
                case "jpeg":
                case "png":
                case "tiff":
                case "tif":
                case "gif":
                case "bmp":
                    if (this.file.size < 20000000) {
                        this.img = this.path;
                    } else {
                        this.clazz = "fa fa-file-image-o";
                    }
                    break;
                case "pdf":
                    this.clazz = "fa fa-file-pdf-o";
                    break;
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
                    this.clazz = "fa fa-file-text-o";
                    break;
                case "csv":
                case "ods":
                case "xls":
                case "xlsm":
                case "xlsx":
                    // as HTML
                    this.clazz = "fa fa-file-text-o";
                    break;
                default:
                    this.clazz = "fa fa-file-o";
                    return false;
            }
        }
    }
</script>

<style lang="scss">
    img{
        cursor: pointer;
    }
</style>