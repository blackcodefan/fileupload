<template>
    <div class="lb-tags-wrapper">
        <div class="col-12 lb-search">
            <div id="incrementalSearch">
                <b-input-group class="lb-search-input">
                    <b-input-group-prepend>
                        <div v-for="(item, index) in items" :key='index' class="lb-search-input-container">
                            <span class="label label-default rounded">
                                    {{item.name}}
                                    <b-btn variant="link" @click="removeTag(item, index)" class="btn-option" v-show="editMode">
                                        <i class="fa fa-close" aria-hidden="true"></i>
                                    </b-btn>
                            </span>
                        </div>
                    </b-input-group-prepend>
                    <b-form-input v-show="editMode" v-model.trim="inputValue"
                                  @focus="handleFocus"
                                  @blur="handleBlur"
                                  v-on:keyup.esc="isFocused = false"
                                  v-on:keyup.enter="addQueryKeyword"
                                  v-on:keyup.delete="removeLastSearchKeyword"
                                  v-on:keyup.down="moveDown"
                                  v-on:keyup.up="moveUp"
                                  autocomplete="off" placeholder="Add tags..."/>
                </b-input-group>
                <transition name="fade">
                    <TagDropdown v-show="isFocused" :query="query"
                                 @hide-dropdown="isFocused = false"
                                 @add-tag="addTag"
                                 @edit-tag="editTag"
                                 @set-active-tag="setActiveTag"
                                 ref="dropDown"></TagDropdown>
                </transition>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import _ from 'lodash'
    import {childOf} from "@/utils/utils";
    import TagDropdown from "@/components/notes/TagDropdown.vue";
    import BaseDropdown from "@/components/search/BaseDropdown.vue";
    import {Note, Tag} from "@/types/graphql";

    @Component({components: {TagDropdown}})
    export default class Tags extends Vue {
        @Prop({})
        editMode: boolean;
        @Prop({})
        note: Note;

        inputValue = "";
        lastInputValue = "";
        query = "";
        isFocused = false;
        activeTag: Tag = null;

        debounceFunc = _.debounce(function (this, val: string) {
            this.query = val;
            console.log("Search: " + this.query);
        }, 300, {});

        mounted() {
        }

        addQueryKeyword() {
            if (this.activeTag) {
                this.addTag(this.activeTag)
            }
            this.moveReset();
        }

        removeLastSearchKeyword() {
            console.log("last input: ", this.lastInputValue);
            if (this.inputValue.length == 0 && this.lastInputValue.length == 0 && this.items.length > 0) {
                    this.removeTag(this.items[this.items.length - 1], this.items.length - 1)
                }
            this.lastInputValue = this.inputValue;
        }

        get items(): Tag[] {
            this.inputValue = "";
            this.$nextTick(() => this.lastInputValue = "");
            let items = this.note.tags;
            return (items) ? items : new Array<Tag>();
        }

        addTag(tag: Tag) {
            if (this.items.find(value => value.id == tag.id))
                return;
            this.note.tags.push(tag);
        }

        editTag(tag: Tag) {
            this.$root.$emit("open-tageditor", {note: this.note, tag: tag})
        }

        removeTag(tag: Tag, index: number) {
            this.note.tags = this.note.tags.filter(value => value.id != tag.id);
        }

        setActiveTag(tag: Tag) {
            this.activeTag = tag;
        }

        handleFocus() {
            this.isFocused = this.inputValue.length > 0;
        }

        handleBlur(evt) {
            const ref = this.$refs["dropDown"] as Vue;
            console.log("el:", ref.$el);
            console.log(childOf(evt, ref.$el));
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
            this.lastInputValue = oldValue;
            this.isFocused = value.length > 0;
            const re = /[^A-Z0-9]/gi;
            this.inputValue = value.replace(re, '');
            this.debounceFunc(this.inputValue);
        }
    }
</script>

<style lang="scss">


</style>