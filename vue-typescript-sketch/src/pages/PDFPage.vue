<template>
    <div>
        <img alt="ScientificNotes" src="@/assets/images/logo.svg" height="20px" align="left">
        <div v-if="note" style="text-align: right;">{{note.createTime | formatDate}}</div>

        <h1 v-if="note" style="text-align: center;">{{note.name}}</h1>
        <!-- Write HTML just like a web page -->
        <div v-if="note" v-html="note.text">Loading note...</div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {Note, QueryNoteArgs} from "@/types/graphql";
    import {GetNoteQuery} from "@/queries";

    @Component({
        apollo: {
            note: {
                query: GetNoteQuery,
                variables(): QueryNoteArgs {
                    return {noteId: this.noteId}
                }
            }
        }
    })

    export default class PDFPage extends Vue {
        @Prop({})
        noteId: string;
        note: Note;

        @Watch("note")
        print() {
            if (this.note != null)
                this.$nextTick(() => window.print());
        }

    }
</script>

<style>
    body {
        background: none
    }

</style>
