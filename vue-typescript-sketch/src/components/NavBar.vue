<template xmlns:th="http://www.w3.org/1999/xhtml">
    <nav class="navbar navbar-expand-lg fixed-top navbar-light lb-navbar" th:fragment="navbar">

        <button class="navbar-toggler d-lg-none" type="button">
            <i id="sidebar-toggle" class="navbar-toggler-icon"></i>
        </button>


        <ul class="navbar-nav mr-auto">
            <li class="nav-item">
                <a class="navbar-brand" href="/">
                    <img class="d-none d-md-inline-flex" alt="ScientificNotes" src="@/assets/images/logo.svg"
                         height="40px">
                    <img class="d-md-none" alt="ScientificNotes" src="@/assets/images/logo-sm.svg" height="40px">
                </a>
            </li>
        </ul>


        <ul class="nav">

            <!--
            <li class="nav-item lb-navbar-menutext float-left">
                <a href="/" class="nav-link">Projects</a>
            </li>
            -->
            <!-- Navbar Bug reporting dropdown START  -->
            <li class="nav-item dropdown lb-navbar-menutext d-none d-sm-inline-flex">
                <a href="#" class="nav-link dropdown-toggle my-auto" data-toggle="dropdown" role="button"
                   aria-haspopup="true" aria-expanded="false">
                    <i class="fa fa-exclamation-circle"></i>
                </a>
                <div class="dropdown-menu dropdown-menu-right" role="menu">
                    <a class="dropdown-item"
                       href="mailto:incoming+labbird/labbird-web+aoucfgyswauTA2rJaLTo@incoming.gitlab.com"
                       target="_blank"
                       th:remove="all">Suggest improvement or report a bug</a>
                    <script th:attr="type='text/javascript'" type="text/example">
                		// dynamically add the script otherwise it wont render in Firefox
              			// see http://hivelogic.com/enkoder/index.php
						//<![CDATA[
						<!--
						var x="function f(x){var i,o=\"\",ol=x.length,l=ol;while(x.charCodeAt(l/13)!" +
						"=51){try{x+=x;l+=l;}catch(e){}}for(i=l-1;i>=0;i--){o+=x.charAt(i);}return o" +
						".substr(0,ol);}f(\")601,\\\"5=7\\\"\\\\(7i(:bqa\\\"\\\\` n\\\\710\\\\320\\\\"+
						"310\\\\730\\\\310\\\\X500\\\\130\\\\U000\\\\530\\\\720\\\\430\\\\520\\\\130" +
						"\\\\100\\\\730\\\\430\\\\600\\\\300\\\\I430\\\\420\\\\300\\\\200\\\\300\\\\" +
						"620\\\\1_B300\\\\53=78600\\\\z310\\\\k!14 0$ol120\\\\!$)g*&*1-$200\\\\.420\\"+
						"\\030\\\\2030\\\\#b610\\\\230\\\\8-<90/!%0+\\\"\\\\i#%H320\\\\YNRX[Y[130\\\\"+
						"QFZPSQC500\\\\JBBGFKIO730\\\\KWNHAr<A!}771\\\\kp74Iyvfx=aybh{e{l%Z8wpcmc^43" +
						"0\\\\@YR720\\\\420\\\\220\\\\200\\\\430\\\\600\\\\400\\\\\\\\\\\\500\\\\630" +
						"\\\\n\\\\300\\\\030\\\\710\\\\400\\\\610\\\\\\\"(f};o nruter};))++y(^)i(tAe" +
						"doCrahc.x(edoCrahCmorf.gnirtS=+o;721=%y;i=+y)601==i(fi{)++i;l<i;0=i(rof;htg" +
						"nel.x=l,\\\"\\\"=o,i rav{)y,x(f noitcnuf\")"                                 ;
						while(x=eval(x));
						//-->
						//]]>





                    </script>
                </div>
            </li>
            <!-- Navbar Settings dropdown START  -->
            <li class="nav-item dropdown lb-navbar-avatar">
                <b-dropdown variant="link" no-caret class="nav-link">
                    <template slot="button-content">
                        <img class="rounded" alt="" :src="img" height="40px">
                        <span class="d-none d-sm-inline-flex">{{ user ? user.displayName : 'Unknown' }}</span><span><i class="fa fa-caret-down fa-fw"></i></span>
                    </template>
                    <b-dropdown-item-button @click="logoutHandler()">
                        <i class="fa fa-sign-out fa-fw"></i> Log out
                    </b-dropdown-item-button>
                </b-dropdown>
            </li>
            <!-- Navbar Settings dropdown END  -->


        </ul>
    </nav>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class NavBar extends Vue {
        user: firebase.User = null;

        beforeMount() {
            let comp = this;
            this.user = this.$firebase.auth().currentUser;
            this.$firebase.auth().onAuthStateChanged(function (u) {
                comp.user = u;
            });
        }

        logoutHandler() {
            this.$firebase.auth().signOut();
            this.$router.replace('/');
        }

        get img() {
            return this.user ? this.user.photoURL : require('../assets/images/profile-icon.png')
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
