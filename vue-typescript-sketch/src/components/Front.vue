<template>
    <div class="col-12 col-sm-10 offset-sm-1 lb-front container d-flex flex-wrap">

        <div class="lb-labbird-newsletter lb-labbird-newsletter-header">
            <h1>Welcome to ScientificNotes.</h1>
            <h2>The free integrated notebook platform.</h2>
        </div>

        <!-- </div> -->

        <!--
            <form class="col-12 col-sm-10 offset-sm-1 d-md-none" role="input" action="/login" method="post" onsubmit="clearCache();">
                <div class="form-group">
                    <input type="text" class="form-control" name="username" placeholder="Username" required>
                    <input type="password" class="form-control" name="password" placeholder="Password" required>
                    <input type="submit" name="submit" class="form-control btn-primary" value="Sign In">
                </div>
                <div class="float-left">
                    No account yet? Sign up <a href="/signup">here.</a>
                </div>
                <div class="float-right">
                    <a href="/forgot">Forgot password?</a>
                </div>
            </form>
        -->

        <div class="row lb-circles">
            <div class="col-md-4">
                <img class="img-responsive center-block d-none d-md-block mx-auto"
                     src="@/assets/images/circle-notebook-draw.png">
                <div class="lb-labbird-newsletter">
                    <h3 class="bg-primary text-white d-md-none text-center">Keep notebook</h3>
                    <p>ScientificNotes helps you keep track of all your notes and research.
                        Easily collect all your text, images and other relevant files in one place.
                        Organize your work using tags to quickly search or browse through your notes and data.
                    </p>
                </div>
            </div>
            <div class="col-md-4">
                <img class="img-responsive center-block d-none d-md-block mx-auto"
                     src="@/assets/images/circle-data-draw.png">
                <div class="lb-labbird-newsletter">
                    <h3 class="bg-primary text-white d-md-none text-center">Store data</h3>
                    <p>With ScientificNotes you can easily access your work from anywhere.
                        Using our integration with Dropbox, your files are automatically backed up, version controlled
                        and synchronized to your local computer.
                    </p>
                </div>
            </div>
            <div class="col-md-4">
                <img class="img-responsive center-block d-none d-md-block mx-auto"
                     src="@/assets/images/circle-collaborate-draw.png">
                <div class="lb-labbird-newsletter">
                    <h3 class="bg-primary text-white d-md-none text-center">Collaborate</h3>
                    <p>
                        Collaborate with your colleagues on projects to facilitate easy sharing of data and discussion
                        of results.
                        <i>Coming soon!</i>
                    </p>
                </div>
            </div>

        </div>

        <div class="row col-12">
            <div class="col-12 text-center">
                <h5>We are currently running a beta-test. If you are intdiested in participating, please sign up below.</h5>
            </div>
        </div>
        <div class="row col-12 justify-content-md-center">
            <b-form inline @submit="onSubmit">
                <b-input id="email" required class="mr-2 mb-sm-0 text-center" placeholder="Enter email" type="email"/>
                <b-button variant="primary" type="submit" value="Sign me up" class="">Sign me up</b-button>
            </b-form>
        </div>
        <div class="row col-12 justify-content-md-center">
            <b-alert class="col-6 text-center"
                     dismissible
                     fade
                     :show="showDismissibleAlert"
                     @dismissed="showDismissibleAlert=false"
            >Thank you for signing up!
            </b-alert>
        </div>

    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class Front extends Vue {
        showDismissibleAlert = false;

        onSubmit(evt) {
            evt.preventDefault();
            this.showDismissibleAlert = true;
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
