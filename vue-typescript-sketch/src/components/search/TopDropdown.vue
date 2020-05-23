<script lang="ts">
    import {Component, Prop} from 'vue-property-decorator';
    import BaseDropdown from "@/components/search/BaseDropdown.vue";
    import {mixins} from "vue-class-component";
    import {QueryTagRelationsArgs, Tag} from "@/types/graphql";
    import gql from "graphql-tag";

    const GetTagRelations = gql`
                query
                   getTagRelations($notebookId: ID!) {
                    tags: tagRelations(notebookId: $notebookId){id,name,synonyms,relations}
                  }
            `;

    @Component({
        apollo: {
            tags: {
                query: GetTagRelations,
                variables(): QueryTagRelationsArgs {
                    return {notebookId: this.$route.params['notebook']}
                },
                skip: true
            }
        }
    })
    export default class TopDropdown extends mixins(BaseDropdown) {
        @Prop({})
        searchTags: Tag[];

        header = true;
        value = "";

        tags: Tag[] = [];

        get items() {
            let items = this.tags;
            if (!items)
                return items;
            // filter

            // first on relations
            if (this.searchTags.length > 0) {
                items = items
                // remove the already chosen search tags
                    .filter(value => !this.searchTags.some(value1 => value1.id == value.id))
                    // remove tags not relating to all of the chosen tags
                    .filter(value => this.searchTags.every(value1 => {
                            return (value1.relations) ? value1.relations.some(value2 => value2 == value.id) : false;
                        })
                    );
            }

            // the remove tags not matching the query string
            if (this.query == null || this.query.length == 0)
                return items;

            return items.filter(value => {
                let result = false;
                result = result || value.name.toLocaleLowerCase().startsWith(this.query.toLocaleLowerCase());
                if (value.synonyms)
                    value.synonyms.forEach(value => result = result || value.startsWith(this.query.toLocaleLowerCase()));
                return result;
            });

            return null
        }


        search(value: string) {
            this.value = value;
            this.$apollo.skipAll = false;
            //this.$forceUpdate()
        }

    }
</script>

<style lang="scss">


</style>