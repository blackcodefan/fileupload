<template>
    <div>
        <div id="signin-header">
            <nav class="navbar fixed-top navbar-light lb-signin-header" th:fragment="signin-header">

                <!-- <button class="navbar-toggler hidden-md-up float-right" type="button" data-toggle="collapse" data-target="#navbar-collapse">
                    <i class="fa fa-bars"></i> <span class="sr-only">Toggle navigation</span>
                </button> -->
                <router-link class="navbar-brand mr-auto" to="/">
                    <img alt="ScientificNotes" src="@/assets/images/logo.svg" height="40px">
                </router-link>
                <!-- <div class="collapse navbar-toggleable-sm" id="navbar-collapse"> -->
                <!-- <ul class="nav navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link hidden-down" href="#">Features</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link hidden-down" href="#">Pricing</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link hidden-down" href="#">About</a>
                        </li>
                    </ul> -->

                <div class="float-right d-flex flex-nowrap">
                    <button type="button" class="btn btn-primary rounded-0" @click="onClickDropBox()">
                        <i class="fa fa-dropbox align-middle" aria-hidden="true"></i>
                        <span class="align-middle">Sign in with Dropbox</span>
                    </button>
                    <button type="button" class="btn btn-primary rounded-0" data-toggle="modal" @click="showAlert">
                        <i class="fa fa-google align-middle" aria-hidden="true"></i>
                        <span class="align-middle">Google Drive</span>
                    </button>
                    <button type="button" class="btn btn-primary rounded-0" data-toggle="modal" @click="showAlert">
                        <i class="fa fa-cloud align-middle" aria-hidden="true"></i>
                        <span class="align-middle">iCould</span>
                    </button>
                    <!--
                    <button class="btn btn-primary border-0 rounded-0 p-0" onclick="ga('send', 'event', 'login', 'onedrive');">
                        <i class="fa fa-google-drive align-middle" aria-hidden="true"></i>
                        <span class="align-middle">Sign in with OneDrive</span>
                    </button>
                    -->
                </div>
                <!--
                <form class="float-right d-none d-md-block" role="input" action="/login" method="post">
                    <div class="form-group">
                        <input type="text" class="form-control" name="username" placeholder="Username" required>
                        <input type="password" class="form-control" name="password" placeholder="Password" required>
                        <input type="submit" name="submit" class="form-control btn btn-primary" value="Sign In">
                    </div>
                    <div class="form-inline">
                        No account yet? Sign up
                        <a href="/signup">here.</a>
                        <a class="float-right" href="/forgot">Forgot password?</a>
                    </div>
                </form>
            -->

            </nav>
        </div>
        <div class="container-fluid">
            <div id="alerts">
                <div class="row justify-content-center">
                    <b-alert class="col-8 text-center" :show="dismissCountDown"
                             dismissible
                             fade
                             @dismissed="dismissCountDown=0"
                             @dismiss-count-down="countDownChanged"
                    >Please sign up below!
                    </b-alert>
                </div>
            </div>

            <div class="clearfix"></div>

            <div class="row" id="content">
                <router-view></router-view>
            </div>
        </div>
        <div id="footer">
            <footer class="footer">
                <nav class="nav fixed-bottom bg-primary justify-content-end">
                    <router-link class="nav-link text-white" to="/about" title="About">About</router-link>
                    <a class="nav-link text-white" href="mailto:contact@scientificnotes.com?subject=Enquiry"
                       title="Contact"
                       target="_blank">Contact</a>

                    <router-link class="nav-link text-white" to="/terms" title="Terms">Terms</router-link>
                    <router-link class="nav-link text-white" to="/privacy" title="Privacy">Privacy</router-link>
                    <router-link class="nav-link text-white" to="/sketch" title="Sketch">Sketch</router-link>
                </nav>
            </footer>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="notImplementedModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
             aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Coming soon</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        This feature will be added soon. Currently only Dropbox login is available.
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>


    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import Front from "@/components/Front.vue";
    import 'firebase/auth';

    @Component({
        components: {Front}
    })
    export default class FrontPage extends Vue {
        dismissSecs = 2;
        dismissCountDown = 0;

        // lifecycle hook
        mounted() {

        }

        countDownChanged(dismissCountDown) {
            this.dismissCountDown = dismissCountDown
        }

        showAlert() {
            this.dismissCountDown = this.dismissSecs
        }

        onClickDropBox(): void {
            var full = this.$apiPath ? this.$apiPath : location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
            full = full.replace('8089', '8080');
            this.popupCenter(full + '/dropbox/auth/authUrl', 'Dropbox Auth', 400, 580);
        }

        popupCenter(url, title, w, h) {
            // Fixes dual-screen position                         Most browsers      Firefox
            var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
            var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

            var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement
                .clientWidth : screen.width;
            var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement
                .clientHeight : screen.height;

            var left = ((width / 2) - (w / 2)) + dualScreenLeft;
            var top = ((height / 2) - (h / 2)) + dualScreenTop;
            var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top +
                ', left=' + left);

            // Puts focus on the newWindow
            if (window.focus) {
                newWindow.focus();
            }
        }
    }
</script>

<style scoped>

</style>