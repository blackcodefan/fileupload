<template v-if="notebook">
    <b-modal ref="modal" id="modal" :title="title" @ok="handleOk()">
        <div class="modal-body">
            <div class="form-group">
                <b-form-input v-if="notebook" v-model.trim="notebook.name" type="text" placeholder="Notebook name..."></b-form-input>
            </div>
        </div>
    </b-modal>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Modal} from "bootstrap-vue";
    import {Mutation, MutationCreateNotebookArgs, MutationUpdateNotebookArgs, Notebook, Project} from "@/types/graphql";
    import _ from 'lodash'
    import gql from "graphql-tag";

    const GetNotebooksQuery = gql`
                query
                  getNotebooks($projectId: ID!) {
                    items: notebooks(projectId: $projectId){id,name}
                  }
            `;

    const CreateMutation = gql`
                mutation createNotebook($projectId: ID!, $input: NotebookInput!){
                             createNotebook(projectId: $projectId, input: $input){
                              id, name
                            }
                        }
                    `;

    const UpdateMutation = gql`
                mutation updateNotebook($id: ID!, $input: NotebookInput!){
                             updateNotebook(id: $id, input: $input){
                              id, name
                            }
                          }
                    `;

    @Component
    export default class CreateNotekookDialog extends Vue {
        private title = '';
        private notebook: Notebook = null;
        private project: Project = null;

        mounted() {
            this.$root.$on('editNotebook', (notebook, project) => {
                this.notebook = _.clone(notebook);
                this.project = project;
                this.title = (notebook.id) ? 'Edit notebook' : 'Create notebook';
                this.$nextTick(() => {
                    if (this.$refs.tagModal)
                        (this.$refs.modal as Modal).show();
                })
            });
        }

        handleOk() {
            let input = {input: {name: this.notebook.name, description: ""}} as MutationCreateNotebookArgs;

            let optimisticVal = {
                __typename: 'Notebook',
                id: "-1",
                name: input.input.name,
                description: "",
                createTime: new Date().getTime(),
            } as Notebook;

            if (this.notebook.id) {
                let options = {
                    // Query
                    mutation: UpdateMutation,
                    // Parameters
                    variables: {id: this.notebook.id, ...input} as MutationUpdateNotebookArgs,

                    // Optimistic UI
                    // Will be treated as a 'fake' result as soon as the request is made
                    // so that the UI can react quickly and the user be happy
                    optimisticResponse: {
                        __typename: 'Mutation',
                        updateNotebook: optimisticVal
                    }
                };
                this.sendProject(options);
            } else {
                let options = {
                    // Query
                    mutation: CreateMutation,
                    // Parameters
                    variables: {projectId: this.project.id, ...input} as MutationCreateNotebookArgs,
                    // Update the cache with the result
                    // The query will be updated with the optimistic response
                    // and then with the real result of the mutation
                    update: (store, {data: {createNotebook}}) => {
                        // Read the data from our cache for this query.
                        let query = {
                            query: GetNotebooksQuery,
                            variables: {projectId: this.project.id}
                        };
                        const data: any = store.readQuery(query);
                        // Add our tag from the mutation to the end
                        data.items.unshift(createNotebook);
                        // Write our data back to the cache.
                        store.writeQuery({...query, data})
                    },
                    // Optimistic UI
                    // Will be treated as a 'fake' result as soon as the request is made
                    // so that the UI can react quickly and the user be happy
                    optimisticResponse: {
                        __typename: 'Mutation',
                        createNotebook: optimisticVal
                    }
                };
                this.sendProject(options);
            }
        };

        private sendProject(options) {
            // Call to the graphql mutation
            this.$apollo.mutate(options).then((data) => {
                // Result
                console.log('saved:', data)
            }).catch((error) => {
                // Error
                this.$root.$emit("alert", "danger", error);
            })
        }

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

</style>
