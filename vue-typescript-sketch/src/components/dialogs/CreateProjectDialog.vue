<template v-if="project">
    <b-modal ref="modal" id="modal" :title="title" @ok="handleOk()">
        <div class="modal-body">
            <div class="form-group">
                <b-form-input v-if="project" v-model.trim="project.name" type="text" placeholder="Project name..."></b-form-input>
            </div>
            <!--
            <div class="form-group hidden-up hidden-xl-down">
                <input type="text" class="form-control" placeholder="Invite collaborators..." id="projectCollaborators">
            </div>
            <label class="checkbox-inline hidden-up hidden-xl-down">
                <input type="checkbox" value="option1" id="projectShowToMembers">
                Show notes to project members by default?
                <a href="#" data-toggle="popover" data-trigger="focus" title="Tooltip"
                    data-content="Tick this box if you prefer to automatically show all your notes to project members by default. If you prefer to manually select which notes are shown to members, leave this box unticked.">Tip.</a>
            </label>
             -->
        </div>
    </b-modal>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Modal} from "bootstrap-vue";
    import {MutationCreateProjectArgs, MutationUpdateProjectArgs, Project} from "@/types/graphql";
    import gql from "graphql-tag";
    import _ from 'lodash'

    const GetProjectsQuery = gql`
                query  getProjects{
                    items: projects {id,name}
                }
            `;

    const CreateMutation = gql`
                mutation createProjec($input: ProjectInput!){
                             createProject(input: $input){
                              id, name
                            }
                        }
                    `;

    const UpdateMutation = gql`
                mutation updateProject($id: ID!, $input: ProjectInput!){
                             updateProject(id: $id, input: $input){
                              id, name
                            }
                          }
                    `;

    @Component({})
    export default class CreateProjectDialog extends Vue {
        private title = '';
        private project: Project = null;

        mounted() {
            this.$root.$on('editProject', data => {
                this.project = _.clone(data);
                this.title = (data.id) ? 'Edit notebook' : 'Create notebook';
                this.$nextTick(() => {
                    if (this.$refs.tagModal)
                        (this.$refs.modal as Modal).show();
                })
            });
        }

        handleOk() {
            let input = {input: {name: this.project.name, description: ""}} as MutationCreateProjectArgs;

            let optimisticVal = {
                __typename: 'Project',
                id: "-1",
                name: input.input.name,
                description: "",
                createTime: new Date().getTime(),
            } as Project;

            if (this.project.id) {
                let options = {
                    // Query
                    mutation: UpdateMutation,
                    // Parameters
                    variables: {id: this.project.id, ...input} as MutationUpdateProjectArgs,

                    // Optimistic UI
                    // Will be treated as a 'fake' result as soon as the request is made
                    // so that the UI can react quickly and the user be happy
                    optimisticResponse: {
                        __typename: 'Mutation',
                        updateProject: optimisticVal
                    }
                };
                this.sendProject(options);
            } else {
                let options = {
                    // Query
                    mutation: CreateMutation,
                    // Parameters
                    variables: input,
                    // Update the cache with the result
                    // The query will be updated with the optimistic response
                    // and then with the real result of the mutation
                    update: (store, {data: {createProject}}) => {
                        // Read the data from our cache for this query.
                        const data: any = store.readQuery({query: GetProjectsQuery});
                        // Add our tag from the mutation to the end
                        data.items.unshift(createProject);
                        // Write our data back to the cache.
                        store.writeQuery({query: GetProjectsQuery, data})
                    },
                    // Optimistic UI
                    // Will be treated as a 'fake' result as soon as the request is made
                    // so that the UI can react quickly and the user be happy
                    optimisticResponse: {
                        __typename: 'Mutation',
                        createProject: optimisticVal
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
