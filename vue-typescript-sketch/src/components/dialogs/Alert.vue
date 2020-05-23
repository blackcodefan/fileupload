<template v-if="show">
    <b-alert
            :variant="variant"
            dismissible
            fade
            :show="show"
            @dismissed="show=false"
            class="alert-fixed"
    >
        {{text}}
    </b-alert>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';


    //export const VARIANT = {DANGER: "danger"};

    @Component
    export default class Alert extends Vue {
        text = "";
        show = false;
        private variant = "danger";

        mounted() {
            this.$root.$on('alert', (variant: string, text: string) => {
                console.log(variant);
                this.text = text;
                this.variant = variant;
                this.show = true
            });
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    .alert-fixed {
        position: fixed;
        top: 0px;
        left: 20%;
        width: 60%;
        z-index: 9999;
        border-radius: 0px;
        text-align: center;
    }
</style>
