<template>
    <b-modal ref="tagModal" :title="title" @ok="handleOk()">
        <div class="modal-body" v-if="tag">
            <b-form-group>
                <label>Tag name</label>
                <b-form-input v-model.trim="tag.name" type="text" placeholder="Tag name..."></b-form-input>
            </b-form-group>

            <b-form-group>
                <label>Synonyms (separate with comma)</label>
                <b-form-input v-model.trim="synonyms" type="text" placeholder="Enter synonyms..."></b-form-input>
            </b-form-group>

            <b-form-group>
                <label>Tag description</label>
                <b-form-textarea v-model.trim="tag.description"></b-form-textarea>
            </b-form-group>
        </div>
    </b-modal>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {Modal} from "bootstrap-vue";
    import gql from "graphql-tag";
    import {MutationCreateNotebookArgs, MutationCreateTagArgs, MutationUpdateTagArgs, Note, Tag} from "@/types/graphql";
    import _ from 'lodash';

    const CreateMutation = gql`
                mutation createTag($input: TagInput!){
                             createTag(input: $input){
                              id, name
                            }
                        }
                    `;

    const UpdateMutation = gql`
                mutation updateTag($id: ID!, $input: TagInput!){
                             updateTag(id: $id, input: $input){
                              id, name
                            }
                          }
                    `;

    @Component
    export default class CreateTagDialog extends Vue {
        private title = '';
        private synonyms = '';
        private tag: Tag = null;
        private data: { note: Note, tag: Tag } = null;

        mounted() {
            this.$root.$on('open-tageditor', (data: { note: Note, tag: Tag }) => {
                this.data = data;
                this.tag = _.cloneDeep(data.tag);
                this.title = (this.tag.id != '-1') ? 'Edit tag' : 'Create tag';
                this.synonyms = (this.tag.synonyms) ? this.tag.synonyms.join(", ") : "";
                this.$nextTick(() => {
                    if (this.$refs.tagModal)
                        (this.$refs.tagModal as Modal).show();
                })
            });
        }

        @Watch('synonyms')
        onPropertyChanged(value: string, oldValue: string) {
            let arr = value.split(",").map(function (item) {
                return item.trim();
            });
            this.tag.synonyms = arr;
        }

        handleOk() {
            let input = {input: {name: this.tag.name, description: ""}} as MutationCreateTagArgs;

            if (this.tag.id != '-1') {
                let options = {
                    // Query
                    mutation: UpdateMutation,
                    // Parameters
                    variables: {id: this.tag.id, ...input} as MutationUpdateTagArgs,

                    update: (store, {data: {updateTag}}) => {
                        if (!this.data.note) return;
                        let index = this.data.note.tags.findIndex(value => value.id == this.tag.id);
                        if (index >= 0)
                            this.data.note.tags.splice(index, 1, updateTag);
                        else
                            this.data.note.tags.push(updateTag)
                    },

                    // Optimistic UI
                    // Will be treated as a 'fake' result as soon as the request is made
                    // so that the UI can react quickly and the user be happy
                    optimisticResponse: {
                        __typename: 'Mutation',
                        updateTag: this.tag
                    }
                };
                this.send(options);
            } else {
                let options = {
                    // Query
                    mutation: CreateMutation,
                    // Parameters
                    variables: input as MutationCreateNotebookArgs,
                    // Update the cache with the result
                    // The query will be updated with the optimistic response
                    // and then with the real result of the mutation
                    update: (store, {data: {createTag}}) => {
                        if (!this.data.note) return;
                        let index = this.data.note.tags.findIndex(value => value.id == '-1');
                        if (index >= 0)
                            this.data.note.tags.splice(index, 1, createTag);
                        else
                            this.data.note.tags.push(createTag)
                    },
                    // Optimistic UI
                    // Will be treated as a 'fake' result as soon as the request is made
                    // so that the UI can react quickly and the user be happy
                    optimisticResponse: {
                        __typename: 'Mutation',
                        createTag: this.tag
                    }
                };
                this.send(options);
            }
        };

        private send(options) {
            // Call to the graphql mutation
            this.$apollo.mutate(options).then((data) => {
                // Result
                console.log('saved:', data)
            }).catch((error) => {
                this.$root.$emit("alert", "danger", error);
            })
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

</style>
