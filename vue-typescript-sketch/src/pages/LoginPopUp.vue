<template>

</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";


    @Component({
        components: {}
    })
    export default class NotesPage extends Vue {
        // lifecycle hook
        mounted() {
            let token = this.$route.query.token as string;

            // user clicked cancel
            if (!token) {
                console.error("No token. Closing window");
                window.close();
            }

            // to support running on localhost and using remote API send the token to localhost
            let origin = "http://localhost:8089";
            console.info("sending token to opener: " + origin);
            window.opener.postMessage(token, origin);

            this.signIn(token);
        }

        signIn(token: string) {
            //firebase.auth().signOut();
            let comp = this;
            let firebase = this.$firebase;
            firebase.auth().signInWithCustomToken(token).then(function (userCred) {
                console.info("Got token. Closing window");
                var user = userCred.user;
                if (user) {

                    //$('<div class="modal-backdrop" style="background-color: white"></div>').appendTo(document.body).hide().fadeIn();
                    //$(".modal-backdrop").remove();
                    // User is signed in.
                    var displayName = user.displayName;
                    var email = user.email;
                    var emailVerified = user.emailVerified;
                    var photoURL = user.photoURL;
                    var uid = user.uid;
                    var phoneNumber = user.phoneNumber;
                    var providerData = user.providerData;
                    //comp.setCookie('snuid', uid, 100);
                    if (email == null) {
                        window.alert("We need permission to you email to continue!");
                        firebase.auth().signOut();
                        return;
                    }
                    user.getIdToken(true).then(function (accessToken) {
                        if (!emailVerified) {
                            var actionCodeSettings = {
                                url: window.location.href
                            };
                            user.sendEmailVerification(actionCodeSettings).then(function () {
                                console.log("email sent");
                                //$("#verifyEmail").fadeIn();
                            }).catch(function (error) {
                                console.log(error);
                            });
                        } else {
                            //$('<div class="modal-backdrop" style="background-color: white"></div>').appendTo(document.body).hide().fadeIn();
                            window.close();
                        }
                    });
                }
            }, function (error) {
                console.log(error);
            });
        }
    }
</script>

<style>

</style>
