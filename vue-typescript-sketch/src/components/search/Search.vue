<template>
    <div class="lb-search-wrapper">
        <div class="col-12 lb-search thumbnail">
            <div>
                <b-input-group class="lb-search-input">
                    <b-input-group-prepend>
                        <span v-for="(item, index) in tags" :key='index' class="label label-default rounded">
								{{item.name}}
								<button class="btn-option">
									<b-btn variant="link" @click="removeTag(index)" class="btn-option">
                                        <i class="fa fa-close" aria-hidden="true"></i>
                                    </b-btn>
								</button>
                        </span>
                        <!-- How searching for a keyword would look like in the search bar -->
                        <span v-for="(item, index) in searchKeywords" :key="'key'+index" class="label label-default rounded">
								<span id="searchFilterText">Keyword: </span>
								<span id="searchFilterKeywordText">{{item}}</span>
								<b-btn variant="link" @click="removeSearchKeyword(index)" class="btn-option">
                                    <i class="fa fa-close" aria-hidden="true"></i>
                                </b-btn>
                        </span>
                    </b-input-group-prepend>
                    <b-form-input v-model.trim="inputValue"
                                  @focus="handleFocus"
                                  @blur="handleBlur"
                                  v-on:keyup.esc="isFocused = false"
                                  v-on:keyup.enter="addQueryKeyword"
                                  v-on:keyup.delete="removeLastSearchKeyword"
                                  v-on:keyup.down="moveDown"
                                  v-on:keyup.up="moveUp"
                                  autocomplete="off" placeholder="Search..."/>
                    <b-input-group-append>
                        <b-button variant="link" type="reset" @click="reset()">
                            <span class="lnr lnr-cross"></span>
                            <span class="sr-only">Close</span>
                        </b-button>
                    </b-input-group-append>
                </b-input-group>

                <transition name="fade">
                    <TopDropdown v-show="isFocused"
                                 :query="query"
                                 :searchTags="searchTags"
                                 :show="isFocused"
                                 @hide-dropdown="isFocused = false"
                                 @add-tag="addTag"
                                 @edit-tag="editTag"
                                 @set-active-tag="setActiveTag"
                                 ref="dropDown"></TopDropdown>
                </transition>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import TopDropdown from "@/components/search/TopDropdown.vue";
    import _ from 'lodash'
    import {childOf} from "@/utils/utils";
    import BaseDropdown from "@/components/search/BaseDropdown.vue";
    import {QueryTagsArgs, Tag} from "@/types/graphql";
    import gql from "graphql-tag";

    const GetTags = gql`
                query getTags($tagIds: [ID!]!){
                             tags(tagIds: $tagIds){
                              id,name,synonyms
                            }
                        }
                    `;
    const TAGS = "tags";
    const TEXT = "text";


    @Component({
        components: {TopDropdown},
        apollo: {
            tags: {
                query: GetTags,
                variables(): QueryTagsArgs {
                    return {tagIds: this.searchTags}
                },
            },
        }

    })
    export default class Search extends Vue {
        inputValue = "";
        lastInputValue = "";
        query = null;
        isFocused = false;
        activeTag: Tag = null;
        tags = new Array<Tag>();
        isMounted = false;

        debounceFunc = _.debounce(function (this, val: string) {
            this.query = val;
            console.log("Search: " + this.query);
        }, 300, {});

        beforeUpdate() {
            // only fetch the query tags once. After we just ad them to the tags list programmatically
            this.$apollo.skipAllQueries = true;
        }

        addTag(tag: Tag) {
            this.tags.push(tag);
            this.inputValue = "";
            let ids = [...this.searchTags, tag.id];
            this.setQuery(ids, TAGS);
        }

        removeTag(index: number) {
            this.tags.splice(index, 1);
            let ids = _.clone(this.searchTags);
            ids.splice(index, 1);
            this.setQuery(ids, TAGS);
        }

        setActiveTag(tag: Tag) {
            this.activeTag = tag;
        }

        addQueryKeyword() {
            if (this.activeTag) {
                this.addTag(this.activeTag)
            } else if (this.inputValue.length > 0) {
                let ids = [...this.searchKeywords, this.inputValue];
                this.setQuery(ids, TEXT);
            }
            this.inputValue = "";
            this.moveReset();
        }

        editTag(tag: Tag) {
            this.$root.$emit("open-tageditor", {note: null, tag: tag})
        }

        removeSearchKeyword(index: number) {
            let ids = _.clone(this.searchKeywords);
            ids.splice(index, 1);
            this.setQuery(ids, TEXT);
        }

        removeLastSearchKeyword() {
            if (this.inputValue.length == 0 && this.searchKeywords.length > 0
                && (this.lastInputValue.length === 0 || this.lastInputValue === this.searchKeywords[this.searchKeywords.length - 1])) {
                this.removeSearchKeyword(this.searchKeywords.length - 1);
            } else {
                if (this.lastInputValue.length == 0 && this.searchTags.length > 0) {
                    this.removeTag(this.searchTags.length - 1)
                }
            }
            this.lastInputValue = this.inputValue;
        }

        reset() {
            this.lastInputValue = "";
            this.$router.replace({query: {}});
            this.inputValue = "";
        }

        handleFocus() {
            this.isFocused = true;
        }

        handleBlur(evt) {
            const ref = this.$refs["dropDown"] as Vue;
            //console.log("el:", ref.$el);
            //console.log(childOf(evt, ref.$el));
            if (childOf(evt, ref.$el))
                return;

            this.isFocused = false;
        }

        moveDown() {
            (this.$refs["dropDown"] as BaseDropdown).moveDown()
        }

        moveUp() {
            (this.$refs["dropDown"] as BaseDropdown).moveUp()
        }

        moveReset() {
            (this.$refs["dropDown"] as BaseDropdown).moveReset()
        }

        @Watch('inputValue')
        onPropertyChanged(value: string, oldValue: string) {
            this.debounceFunc(this.inputValue);
            this.lastInputValue = oldValue;
        }

        get searchKeywords(): string[] {
            return this.getQuery(TEXT)
        }

        get searchTags(): string[] {
            let tagIds = this.getQuery(TAGS);
            this.tags = this.tags.filter(value => tagIds.findIndex(value1 => value1 === value.id) >= 0);
            return tagIds
        }

        getQuery(key: string): string[] {
            let q = this.$route.query[key];
            return !q ? [] : (q instanceof Array) ? q : [q];
        }

        private setQuery(ids: string[], key: string) {
            let q = _.clone(this.$route.query);
            if (ids.length == 0) {
                delete q[key];
            } else {
                q[key] = ids;
            }
            this.$router.replace({query: q});
        }
    }
</script>

<style lang="scss">


</style>