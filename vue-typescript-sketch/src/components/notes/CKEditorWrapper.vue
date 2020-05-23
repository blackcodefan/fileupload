<template>
    <ckeditor v-if="editMode && editor" @ready="onEditorReady" @input="onEditorInput" :editor="editor" v-model="note.text" :config="editorConfig"></ckeditor>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
    import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials';
    import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold';
    import HeadingPlugin from '@ckeditor/ckeditor5-heading/src/heading';
    import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic';
    import LinkPlugin from '@ckeditor/ckeditor5-link/src/link';
    import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph';
    import BlockquotePlugin from '@ckeditor/ckeditor5-block-quote/src/blockquote';
    import TablePlugin from '@ckeditor/ckeditor5-table/src/table';
    import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
    import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';

    import CKFinder from '../../utils/ckeditor5-ckfinder/src/ckfinder';
    import Image from '@ckeditor/ckeditor5-image/src/image';
    import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
    import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
    import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
    import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
    import {Note} from "@/types/graphql";

    @Component({})
    export default class CKEditorWrapper extends Vue {
        @Prop({})
        private note: Note;
        @Prop({})
        private editMode: boolean;

        showDropTarget = false;

        editor = ClassicEditor;


        private editorConfig = {
            plugins: [
                EssentialsPlugin,
                BoldPlugin,
                HeadingPlugin,
                ItalicPlugin,
                LinkPlugin,
                ParagraphPlugin,
                BlockquotePlugin,
                TablePlugin,
                TableToolbar,
                MediaEmbed,
                CKFinder,
                Image,
                ImageUpload,
                ImageToolbar,
                ImageCaption,
                ImageStyle
            ],
            toolbar: {
                items: [
                    'heading',
                    '|',
                    'bold',
                    'italic',
                    'link',
                    'bulletedList',
                    'numberedList',
                    'imageUpload',
                    'blockQuote',
                    'insertTable',
                    'mediaEmbed',
                    'undo',
                    'redo',
                ]
            },
            heading: {
                options: [
                    {model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph'},
                    {model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1'},
                    {model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2'},
                    {model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3'}
                ]
            },
            table: {
                contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
            },
            ckfinder: {
                noteComp: null
            },
            image: {
                toolbar: ['imageTextAlternative', '|', 'ImageStyle:full', 'ImageStyle:side']
            }
        };
        user: firebase.User;

        created() {
            this.editorConfig.ckfinder.noteComp = this.$parent;
        }


        onEditorReady(editor) {
        }

        async onEditorInput(editor, a) {
            // change thumbnail size on images dragged from file list
            let txt = this.note.text;
            let t = txt.replace(/size=w32h32/g, 'size=w2048h1536');
            this.note.text = t;
        }
    }
</script>

<style lang="scss">


</style>