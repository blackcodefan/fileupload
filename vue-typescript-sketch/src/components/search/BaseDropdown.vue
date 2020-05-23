<template>
    <div tabindex="0" @blur="handleBlur" ref="dropDown" class="dropdown-menu lb-search-dropdown col-12 col-sm-8 col-md-6">
        <!-- Custom div, which tells the user that he can search for keywords -->
        <span v-show="header" class="col-md-12 lb-search-dropdown-item lb-search-suggestion">
						<span>
							Keyword:
							<span class="lb-keyword">{{query}}</span>
							(press Enter to search)
						</span>
        </span>
        <!-- Spinner -->
        <div v-show="spinner" class="col-12 lb-padded-text text-center">
            <i class="fa fa-refresh fa-spin-custom"></i> Searching...
        </div>
        <div class="clear"></div>
        <div class="d-flex flex-wrap">
            <div v-for="(item, index) in items" :key='index' @click.stop="addTag(item)" class="col-6 lb-search-dropdown-item" v-bind:class="{ hover: index == position }">
                <p class="lb-tag">
                    <span class="label label-default rounded">{{item.name}}</span>
                    <span class="lb-tag-usage">
									<span>x </span>
									<span>{{item.count}}</span>
								</span>
                </p>
                <p class="lb-tag-description">{{item.description}}</p>
                <p class="lb-tag-synonym text-truncate">{{concat(item.synonyms)}}</p>
                <p class="lb-tag-edit">
                    <b-btn variant="link" @click.stop="tagPopup(item)">
                        <i class="fa fa-pencil" aria-hidden="true"></i>
                    </b-btn>
                </p>
            </div>
        </div>
        <!-- Custom button for tag creation -->
        <div class="col-12 lb-search-dropdown-item lb-add-tag" v-show="!header">
            <b-btn variant="link" @click.stop="tagPopup(null)" @focus.stop class="text-primary">
                <i class="fa fa-plus fa-fw"></i> New tag
            </b-btn>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {childOf} from "@/utils/utils";
    import {Tag} from "@/types/graphql";

    @Component
    export default class BaseDropdown extends Vue {
        @Prop({})
        query: string;
        @Prop({})
        show: boolean;

        spinner = false;
        position = -1;

        get items() {
            return [];
        }

        handleBlur(evt) {
            if (childOf(evt, this.$refs["dropDown"] as Element))
                return;
            this.$emit('hide-dropdown');
        }


        addTag(tag: Tag) {
            this.$emit('add-tag', tag);
            if (this.items.length == 0)
                this.$emit('hide-dropdown');
        }

        tagPopup(tag: Tag) {
            if (!tag)
                tag = {id: '-1', __typename: 'Tag', name: this.query} as Tag;
            this.$emit('edit-tag', tag);
            this.$emit('hide-dropdown');
        }

        concat(synonyms: string[]) {
            if (!synonyms)
                return "";
            return synonyms.join(", ")
        }

        @Watch('show')
        @Watch('query')
        async onPropertyChanged(value: string, oldValue: string) {
            this.spinner = true;
            await this.search(value);
            this.spinner = false;
        }

        search(value: string) {
        }

        moveDown() {
            this.position++;
            if (this.position > this.items.length - 1)
                this.position = -1;
            this.$emit('set-active-tag', (-1 < this.position && this.position < this.items.length) ? this.items[this.position] : null);
        }

        moveUp() {
            this.position--;
            if (this.position < -1)
                this.position = this.items.length - 1;
            this.$emit('set-active-tag', (-1 < this.position && this.position < this.items.length) ? this.items[this.position] : null);
        }

        moveReset() {
            this.position = -1;
            this.$emit('set-active-tag', null);
        }
    }
</script>

<style lang="scss">


</style>