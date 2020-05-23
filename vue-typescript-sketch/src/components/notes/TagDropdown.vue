<script lang="ts">
    import {Component} from 'vue-property-decorator';
    import BaseDropdown from "@/components/search/BaseDropdown.vue";
    import {mixins} from "vue-class-component";
    import gql from "graphql-tag";
    import {QueryTagQueryArgs, Tag} from "@/types/graphql";

    const GetTagsQuery = gql`
                query
                   getTags($queryString: String!) {
                    tags: tagQuery(queryString: $queryString){id,name,synonyms}
                  }
            `;

    @Component({
        apollo: {
            tags: {
                query: GetTagsQuery,
                variables(): QueryTagQueryArgs {
                    return {queryString: this.value}
                },
                skip: true
            }
        }
    })
    export default class TagDropdown extends mixins(BaseDropdown) {
        header = false;
        value = "";
        tags: Tag[] = [];

        get items() {
            return this.tags;
        }

        search(value: string) {
            this.value = value;
            this.$apollo.skipAll = false;
        }
    }
</script>

<style lang="scss">


</style>