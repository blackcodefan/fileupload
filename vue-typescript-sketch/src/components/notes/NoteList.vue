<template>
    <div class="lb-main-wrapper">

        <!-- Search START  -->
        <Search></Search>

        <!-- Labnote wrapper START  -->
        <div class="lb-labnote-wrapper" id="labNotes">

            <div id="labNotesContainer">
                <!-- Sample note -->
                <div id="sampleNote"></div>
                <transition-group name="fade">
                    <div v-for="(item, index) in notes" :key='item.id'>
                        <NoteEditor :note="item"></NoteEditor>
                    </div>
                </transition-group>
            </div>

            <!-- Empty search result -->
            <div class="col-12 thumbnail lb-padded-text" id="labnoteNoResult" v-show="notes.length == 0 && !$apollo.loading" style="display: none;">
                Your search did not return any results. Please modify and try again.
            </div>
            <!-- Note content END  -->

        </div>
        <!-- Note wrapper END  -->
        <div class="clear"></div>
        <!-- Spinner -->
        <div class="col-12 thumbnail lb-padded-text" v-show="$apollo.loading">
            <i class="fa fa-refresh fa-spin-custom"></i> Loading notes...
        </div>

        <div class="clear"></div>

        <div class="lb-viewmore">
            <b-button @click="loadMore()" class="btn btn-primary btn-block" v-show="this.cursor && !$apollo.loading">View more</b-button>
        </div>

    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Search from "@/components/search/Search.vue";
    import NoteEditor from "@/components/notes/NoteEditor.vue";
    import {Note, QueryNotesArgs, QursorResult} from "@/types/graphql";
    import {GetNotesQuery} from "@/queries";
    import * as _ from "lodash";


    @Component({
        components: {NoteEditor, Search},
        apollo: {
            items: {
                query: GetNotesQuery,
                variables(): QueryNotesArgs {
                    return {notebookId: this.$route.params['notebook'], filter: this.filter, cursor: ""}
                }
            }
        }
    })
    export default class NoteList extends Vue {
        items: QursorResult = {qursor: "", result: []};

        get notes(): Note[] {
            return this.items.result as Note[];
        }


        loadMore() {
            console.log(this.$apollo);
            this.$apollo.queries.items.fetchMore({
                // New variables
                variables: {notebookId: this.$route.params['notebook'], filter: this.filter, cursor: this.items.qursor},
                // Transform the previous result with new data
                updateQuery: (previousResult, {fetchMoreResult}) => {
                    console.log(previousResult, fetchMoreResult);
                    let oldResult = previousResult.items as QursorResult;
                    let newResult = fetchMoreResult.items as QursorResult;
                    let result = _.clone(newResult);
                    result.result = [...oldResult.result, ...newResult.result];
                    return {items: result};
                },
            });
        }


        get cursor(): string {
            return this.items.qursor
        }


        get filter(): string {
            let filter = "";

            const tagQuery = this.$route.query['tags'];
            if (tagQuery) {
                filter += "Tags:" + ((tagQuery instanceof Array) ? tagQuery.join(" AND ") : tagQuery);
            }

            const textQuery = this.$route.query['text'];
            if (textQuery) {
                filter += " Text:" + ((textQuery instanceof Array) ? textQuery.map(value => "(" + value + ")").join(" AND ") : textQuery);
            }

            filter.trim();
            console.log("load notes: " + filter);

            return filter;
        }

    }
</script>

<style lang="scss">

</style>