<template>
    <div>
        <!--<b-button v-b-modal.download-modal>Download</b-button>-->
        <button class="file-btn" v-b-modal.download-modal>Download</button>
        <!--<button class="file-btn" @click="openModal">Download</button>-->

        <b-modal
                id="download-modal"
                ref="modal"
                title="Download your background image"
                @show="resetModal"
                @hidden="resetModal"
                @ok="handleOk"
        >
            <b-form-group
                    :state="nameState"
                    label="Enter your download path"
                    label-for="path"
                    invalid-feedback="path is required"
            >
                <b-form-input
                        id="name-input"
                        ref="input"
                        value="http://mangiarebuono.it/wp-content/uploads/2014/04/frutta-e-verdura.jpg"
                        v-model="path"
                        :state="nameState"
                        required
                ></b-form-input>
            </b-form-group>
        </b-modal>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    let vm;

    @Component
    export default class ImageDownloadDialog extends Vue {
        private path: string = '';
        private nameState: string = null;
        mounted() {
            vm = this;
        }

        openModal() {
            this.$emit('bv::show::modal', "download-modal")
        }

        checkFormValidity() {
            const valid = vm.$refs.input.checkValidity();
            this.nameState = valid ? 'valid' : 'invalid';
            return valid
        };

        resetModal() {
            this.path = '';
            this.nameState = null;
        };

        handleOk(bvModalEvt) {
            // Prevent modal from closing
            bvModalEvt.preventDefault();

            if (!this.checkFormValidity()) {
                return
            }
            // Push the name to submitted names
            console.log(this.path);
            // Hide the modal manually
            this.$nextTick(() => {
                vm.$refs.modal.hide()
            });
            // Define the method that emits data to the parent as the first parameter to `$emit()`.
            // This is referenced in the <template> call in the parent. The second parameter is the payload.
            this.$emit('pathIsSet', this.path)
        }
    }

</script>

<style scoped>

</style>
