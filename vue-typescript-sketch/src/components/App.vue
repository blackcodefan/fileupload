<template>
    <div>
        <Alert></Alert>
        <router-view/>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Alert from "@/components/dialogs/Alert.vue";

    @Component({
        components: {
            Alert
        },
    })
    export default class App extends Vue {

    }
</script>

<style lang="scss">

    @import "../assets/bootstrap/custom/variables.scss";
    @import '../../node_modules/bootstrap/scss/bootstrap.scss';
    @import url("https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");
    @import url("https://cdn.linearicons.com/free/1.0.0/icon-font.min.css");

    /*@import url(//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css);*/
    /*@import 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css';*/
    /*@import 'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css';*/

    body {
        padding-top: 60px;
        background: #F1F1F1;
        font-size: $lb-font-size;
        font-family: 'Open Sans', sans-serif;
        font-weight: 400;

        b, strong {
            font-weight: 700;
        }
    }

    //Changing the color of all text on the website to dark-grey instead of pure black
    li, pre, p, span, h1, h2, h3, h4, h5, h6 {
        color: $lb-text-color;
    }

    // Might not be needed, can't test if it prevents the transparency issue or not, can't recreate the issue
    tbody {
        background-color: #FFF;
    }


    //Minimum height for page to avoid issues with scroll, navbar, and dropdowns getting cropped off
    .container-fluid {
        min-height: 650px;
    }

    //Class overrides
    //Active elements in list-groups (projects, labnotes)
    .list-group-item.active, .list-group-item.active:hover {
        background-color: lighten($lb-blue, 15%);
        border-color: lighten($lb-blue, 15%);
    }

    .text-primary {
        color: $brand-primary !important;
    }

    .text-secondary {
        color: $brand-secondary !important;
    }

    //Remove caret on dropdown menus
    .dropdown-toggle {
        &:after {
            display: none;
        }
    }

    //Show dropdown-menu on top of other elements
    .dropdown-menu {
        z-index: 1001;
    }

    //Fixes https://github.com/twbs/bootstrap/issues/23553
    .dropdown-menu-right {
        right: 0;
        left: auto;
    }

    //Removing not-allowed cursor on disabled buttons
    .btn.disabled, .btn:disabled {
        cursor: default;
    }

    //Removing the  blue highlighting when you press any input field
    *:focus {
        outline: none !important;
    }

    //Used to clear space after using float on elements
    .clear {
        clear: both;
    }

    .alert {
        top: 1rem;
    }

    //Making all the inputs square
    input {
        border-radius: 0 !important;
    }

    //Making the button always have no background and no border
    button {
        background: transparent;
        border: none;
    }

    a, button {
        cursor: pointer;
    }

    //Removing the standard underlining when hovering a link
    a, .btn-link {
        &:hover, &:focus {
            text-decoration: none;
        }
    }

    hr {
        border-color: $lb-border-color;
    }


    // Rewriting bootstrap primary background color to ours
    .bg-primary {
        background-color: $brand-primary !important;
    }

    .btn {
        font-size: 0.88rem
    }

    // Changing standard bootstrap buttons to fit in with our style
    .btn-primary {
        color: $brand-primary;
        background-color: #FFF;
        border: 1px solid $brand-primary;

        &:hover {
            background-color: $brand-primary;
            color: #FFF;
            border: 1px solid transparent;
        }
    }

    .btn-secondary {
        color: $brand-secondary;
        background-color: #FFF;
        border: 1px solid $brand-secondary;

        &:hover {
            background-color: $brand-secondary;
            color: #FFF;
            border: 1px solid transparent;
        }
    }

    // Changing the standard list-group class to fit in with our style
    .list-group {
        margin: 0;

        .list-group-item {
            position: relative;
            border-radius: 0;
            border-right: none;
            border-left: none;
        }
    }

    // Changing this for usage with tags
    .label {
        position: relative;
        cursor: default;
        padding: 0.3rem 0.5rem;
        font-size: 0.75rem;
    }

    // Changing the default bootstrap label colors
    .label-default {
        //background: $lb-border-color;
        color: $lb-text-color;
        border: 1px solid #999;
    }

    // Filelist jumping up and down fix
    .btn-block + .btn-block {
        margin-top: 0rem;
    }


    //Shepherd web tour
    .shepherd-element {
        z-index: 1100;
    }

    .shepherd-content {
        max-width: 500px;
    }

    .shepherd-mask {
        opacity: 0.5;
        pointer-events: none;
    }


    //Wrapper for whole page, including sidebar, labnotes, etc.
    .lb-page-wrapper {
        // #wrapper
        padding-left: 0px;
        -webkit-transition: all 0.1s ease;
        -moz-transition: all 0.1s ease;
        -o-transition: all 0.1s ease;
        transition: all 0.1s ease;
    }

    //Wrapper for all main content including Search, New note, Labnotes, etc.
    .lb-main-wrapper {
        // #page-content-wrapper
        // position: absolute;
    }

    //Removing the round borders, adjusting size to optimal, adding a slight shadow in the back
    .dropdown-menu {
        font-size: $lb-font-size;
        box-shadow: $lb-boxshadow;
        // Temporary fix of labnote header dropdown-menu being cropped when using buttons in Firefox
        min-width: 180px;
        margin: 8px 0px 0px;
    }

    //Image preview modal
    .modal-body textarea {
        height: 5rem;
        resize: none;
    }

    .modal-title {
        overflow: hidden;
    }

    .modal-dialog-preview {
        @extend .modal-dialog;
        width: 500px;
        max-width: 80%;
    }

    .lb-image-preview {
        .lb-image-container {
            max-height: 600px;
            min-height: 300px;
            max-width: 100%;
            overflow: auto;
            text-align: center;
        }
    }

    @media (min-width: 768px) {
        .lb-image-preview.modal-dialog {
            width: 80%;
        }
    }

    @media(max-width: 767px) {
        //Scale images to modal on small devices
        .lb-image-preview {
            .lb-image-container {
                img {
                    width: 100%;
                }
            }

            //Hide zoom buttons on small devices
            .modal-footer {
                button {
                    display: none;
                }
            }
        }
    }

    // Shows spinner with backdrop to be used for updating labnotes when saving, deleting, etc.
    // To display, inject display: block;
    .lb-updating {
        background: rgba(255, 255, 255, 0.6);
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1040;
        outline: 0;
        background-image: url("../assets/images/loader.svg");
        background-repeat: no-repeat;
        background-size: 40px 40px;
        background-position: center center;
    }

    //Text to lb-updating is from update-text attribute
    div.lb-updating:after {
        content: attr(update-text);
        position: absolute;
        top: 54%;
        left: 47%;
        font-size: 1.2rem;
    }


    //Navbar styling overall
    .navbar {
        background: #FFF;
        margin-bottom: 1rem; //adding the same padding as for all the other elements
        border-radius: 0; //removing the rounded corners
        padding: 0.2rem;
        border-bottom: $lb-border;

        &.lb-navbar {
            height: 60px;
        }

        /*    a.navbar-brand:after {
                top: 10px;
                position: relative;
                content: " beta";
                font-style: italic;
                color: $lb-grey;
            }
        */
        .navbar-brand > img {
            display: inline-block;
            height: 1.7rem;
        }

        button {
            margin: 2px;

            span {
                display: none;
            }
        }
    }


    //Login header styling
    .navbar.lb-signin-header {
        .navbar-brand {
            display: inline-block;
            position: relative;
            padding-top: 1rem;
            padding-left: 1rem;

        }

        form {
            margin-top: 0.35rem;
            margin-right: 0.35rem;

            .form-control {
                display: inline-block;
                width: auto;
                vertical-align: middle;
            }

            .form-group {
                margin-bottom: 0.5rem;
            }
        }
    }

    // Styling of navbar
    .navbar.lb-navbar {
        .navbar-brand {
            position: relative;
            padding-top: 0.6rem;
            padding-left: 2rem;
        }

        .navbar-nav {
            //Remove top/bottom padding in navbar elements
            .nav-link {
                padding-top: 0;
                padding-bottom: 0;
            }

            .nav-item {
                position: relative;
                //Styling for notifications
                .lb-notification {
                    display: block;
                    position: absolute;
                    box-sizing: inherit;
                    font-size: 1rem;
                    color: white;
                    line-height: 1rem;
                    height: 1.1rem;
                    text-align: center;
                    padding: 0rem 0.3rem;
                    border-radius: 0.65rem;
                    background: $brand-primary;

                    &:empty {
                        display: none;
                    }
                }
            }

            // Styling of left-aligned text-based nav elements
            .lb-navbar-menutext {
                font-size: 1.2rem;
                padding: 0.8rem 1rem 0.8rem 2rem;

                .lb-notification {
                    @extend .lb-notification;
                    top: 0.3rem;
                    right: 0.4rem;
                }

            }

            // Styling of icon-based nav elements
            .lb-navbar-icon {
                font-size: $lb-font-size;
                padding-top: 0.5rem;

                .lb-notification {
                    @extend .lb-notification;
                    top: 0.3rem;
                    right: 1.5rem;
                }
            }

            // Styling of navbar avatar
            .lb-navbar-avatar {
                font-size: $lb-font-size;
                padding: 0.3rem 0rem;
                // Adjusting how the name near the avatar looks
                span, & > a > i {
                    font-size: 1rem;
                    vertical-align: middle;
                }

                span {
                    color: inherit; // Making it grey and to change color on click like the arrow next to it
                    margin: 0rem 0.2rem 0rem 0.5rem;
                }

                & > a > i {
                    margin-top: 0.25rem;
                }
            }
        }
    }

    //Bug reporting

    .fa.fa-exclamation-circle {
        color: $brand-primary;
    }

    .lb-username {
        color: $brand-primary;
    }

    .lb-dropdown-date {
        font-size: ($font-size-base * 0.7);
        color: $brand-secondary;
    }

    //Navbar classes for v3.3
    //NOTE make these classes responsive with rem and %
    .lb-navbar-dropdown-element {
        position: relative;
        width: 280px;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        overflow: hidden;

        .img-rounded {
            height: 3rem;
            margin-right: 0.7rem;
        }
    }

    .lb-navbar-dropdown-element-text {
        display: inline-block;
        line-height: 1rem;

        p {
            margin-bottom: 0;
        }
    }

    .lb-navbar-menutext .lb-navbar-documents .lb-navbar-dropdown-element {
        padding-top: 0.2rem;
        padding-bottom: 0.2rem;
        width: 150px;
    }

    //Display buttons on hover
    .dropdown-item {
        &:hover {
            .lb-navbar-dropdown-element-options {
                opacity: 1;
            }
        }
    }

    //Styling for buttons in the dropdown
    .lb-navbar-dropdown-element-options {
        opacity: 0;
        position: absolute;
        right: 0;
        top: 1.25rem;
        //background: #F5F5F5;
        padding: 0 0 0 60px;
        // Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#f5f5f5+100,f5f5f5+100,f5f5f5+101&amp;0+0,1+44
        background: -moz-linear-gradient(left, rgba(245, 245, 245, 0) 0%, rgba(245, 245, 245, 1) 44%, rgba(245, 245, 245, 1) 100%, rgba(245, 245, 245, 1) 101%); // FF3.6+
        background: -webkit-gradient(linear, left top, right top, color-stop(0%, rgba(245, 245, 245, 0)), color-stop(44%, rgba(245, 245, 245, 1)), color-stop(100%, rgba(245, 245, 245, 1)), color-stop(101%, rgba(245, 245, 245, 1))); // Chrome,Safari4+
        background: -webkit-linear-gradient(left, rgba(245, 245, 245, 0) 0%, rgba(245, 245, 245, 1) 44%, rgba(245, 245, 245, 1) 100%, rgba(245, 245, 245, 1) 101%); // Chrome10+,Safari5.1+
        background: -o-linear-gradient(left, rgba(245, 245, 245, 0) 0%, rgba(245, 245, 245, 1) 44%, rgba(245, 245, 245, 1) 100%, rgba(245, 245, 245, 1) 101%); // Opera 11.10+
        background: -ms-linear-gradient(left, rgba(245, 245, 245, 0) 0%, rgba(245, 245, 245, 1) 44%, rgba(245, 245, 245, 1) 100%, rgba(245, 245, 245, 1) 101%); // IE10+
        background: linear-gradient(to right, rgba(245, 245, 245, 0) 0%, rgba(245, 245, 245, 1) 44%, rgba(245, 245, 245, 1) 100%, rgba(245, 245, 245, 1) 101%); // W3C
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00f5f5f5', endColorstr='#f5f5f5', GradientType=1); // IE6-9
        button {
            height: 1.7rem;
            width: 1.7rem;
            padding: 0;
        }
    }

    //Loader icon spin speed
    .fa-spin-custom {
        -webkit-animation: spin 650ms infinite linear;
        animation: spin 650ms infinite linear;
    }

    @-webkit-keyframes spin {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(359deg);
            transform: rotate(359deg);
        }
    }

    @keyframes spin {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(359deg);
            transform: rotate(359deg);
        }
    }


    .fa-pulse-custom {
        animation: 0.7s steps(8, end) 0s normal none infinite running fa-spin;
        -webkit-animation: 0.7s steps(8, end) 0s normal none infinite running fa-spin;
    }


    //Documents START ---------------------------------
    .lb-documents {
        color: $lb-grey;
        padding: 1rem !important;

        thead, tbody, tfoot {
            > tr {
                > th,
                > td {
                    line-height: $line-height-sm*0.7;
                }
            }
        }

        a {
            color: $lb-grey;
        }
    }

    //Documents END ---------------------------------

    //Progress bar START ---------------------------------
    .progress {
        height: $spacer*1.3;
        margin-bottom: 0px;
        text-align: left;
        position: relative;

        span {
            position: absolute;
            margin-left: 1rem;
            z-index: 1;
        }
    }

    .progress[value] {

    }

    .progress[value]::-webkit-progress-value {
        background-color: $brand-primary !important;
        min-width: 1rem;
    }

    //Progress bar END ---------------------------------

    // Custom classes

    //Styling of lnr icons
    .lnr {
        font-size: 18px;
        color: inherit;
        vertical-align: middle;
        padding-bottom: 0.2rem;

        &.lnr-lg {
            font-size: 30px;
        }
    }

    .btn-option { //Remove border etc from button class (for use in option/cogwheel)
        vertical-align: middle;
        color: $brand-secondary;
        opacity: .5;
        padding: 0;

        &:hover,
        &:focus {
            color: $brand-secondary;
            text-decoration: none;
            cursor: pointer;
            opacity: 1;
        }
    }

    button.close {
        padding: 0;
        cursor: pointer;
        background: transparent;
        border: 0;
        -webkit-appearance: none;
    }


    //So the dropdown button wouldn't go on the next line, we always use it somewhere in-line with other elements
    .dropdown {
        display: inline;
    }

    //Styling for the "x" in the tags
    .label {
        #searchFilterText, #searchFilterKeywordText {
            display: inline-block;
        }

        #searchFilterKeywordText {
            font-style: italic;
            margin-left: 0.2rem;
        }

        button.btn-option {
            margin-left: 0.3rem;
            margin-top: -0.15rem;
            line-height: 0.5rem;
            font-size: 0.8rem;

            i {
                line-height: inherit;
            }
        }
    }


    //Style all dropdown icons
    .fa.fa-chevron-down {
        font-size: $lb-font-size;
    }

    // Dropdown styles
    .dropdown {
        button, a, .fa {
            font-size: $lb-font-size;
        }
    }


    //Changing the thumbnail completely to our styling (white background, paddings, shadow behind the elements)
    .thumbnail {
        background: #FFF;
        border-radius: 0;
        border: 0;
        margin-bottom: 1rem;
        padding: 0;
        box-shadow: $lb-boxshadow;
    }

    //Form control styling
    .form-control, .input-group-btn .btn {
        background: #FFF;
        border-radius: 0;
        padding: 0.5rem 1rem;
        font-size: $lb-font-size;

        //Remove border on project-selector and search field
        .lb-project-select &, .lb-search & {
            border: none;
        }

        //Removing standard bootstrap focus animation
        &:focus {
            border-color: $brand-primary;
        }

        &:focus, button.btn:focus {
            box-shadow: none;
        }

        option {
            padding-left: 1rem;
        }
    }


    //Labnotes START----------------------------------------

    //New labnote
    .lb-newnote {
        background: inherit;
        text-decoration: none;
        padding-top: 0.8rem;
        padding-bottom: 0.3rem;

        button {
            background: $brand-primary;
            color: #FFF;
            height: 100%;
            padding: 0.3rem 4rem;
            border-radius: 3px;
        }
    }


    //Search
    .lb-search {
        // Making the div take up the whole width
        .input-group {
            width: 100%;
            // Removing the paddings around and making a padding on the left side
            // This whole div is the future
            .lb-search-input {
                padding: 0rem 0rem 0rem 0.5rem;
                position: relative;
                overflow: hidden;

                input::-webkit-input-placeholder {
                    font-style: italic;
                    font-size: $font-size-base;
                }

                input:focus::-webkit-input-placeholder {
                    opacity: 0;
                }

                input:-moz-placeholder { /* Firefox 18- */
                    font-style: italic;
                    font-size: $font-size-base;
                }

                input::-moz-placeholder { /* Firefox 19+ */
                    font-style: italic;
                    font-size: $font-size-base;
                }

                input:-ms-input-placeholder {
                    font-style: italic;
                    font-size: $font-size-base;
                }

                // Div with tags inside it; aligning it with our input and button (change the name if not appropriate, you know we think differently in terms of naming)
                .lb-search-input-container {
                    float: left;
                    margin-top: 0.25rem;
                }

                // Styling the actual input, which is inside the div
                // (2.25rem is equal to 36px, which is the same height as project selector)
                input {
                    width: auto;
                    min-width: 11rem;
                    height: 2.25rem;
                    padding: 0.47rem 0.3rem 0.47rem 0.4rem;
                }
            }

            // Aligning the button to the right of the div
            .input-group-btn {
                width: 2.25rem;
                vertical-align: top;

                // Scepifying the height/width, because we need to make the button squared without using any complex things
                button {
                    color: $brand-secondary;
                    border: none;
                    height: 2.25rem;
                    width: 2.25rem;
                    padding: inherit;

                    &:hover {
                        color: darken($brand-secondary, 25%);
                    }
                }
            }
        }
    }

    // Removing the padding on the left side inside the tag search, adding the borders to the edit mode
    .lb-labnote-wrapper {
        .lb-search {
            .input-group {
                .lb-search-input {
                    padding: 0rem;
                    // border-bottom: $lb-border;
                    // border-top: $lb-border;
                }

                .input-group-btn {
                    // border-bottom: $lb-border;
                    // border-top: $lb-border;
                }
            }
        }
    }

    //Our custom classes for the search dropdown
    .lb-search-dropdown {
        z-index: 1001;
        top: auto;
        right: 1rem;
        left: 0;
        right: 0;
        margin-top: 0; //TEMPORARY, to be able to hover the dropdown (margin made it dissapear, I can explain if needed)
        display: block; //Need to switch to display: block; when writing something inside the search-box
        overflow: hidden;
        padding: 0;

        .hover {
            background: $lb-hover-bg;
        }

        //Styling the dropdown items
        .lb-search-dropdown-item {
            position: relative;
            padding: 0.5rem;
            font-size: 0.75rem;

            //What happens when you hover a dropdown item
            &:hover {
                background: $lb-hover-bg;
                cursor: pointer;
            }

            //Just some adjusting for the tag
            .label {
                font-size: 0.6rem;
                cursor: pointer;
            }

            .lb-tag {
                margin: 0;
                padding-top: 0;

                .lb-tag-usage {
                    color: $brand-secondary;
                }
            }

            //Tag description styling
            .lb-tag-description {
                margin: 0 0 0.5rem 0;
                height: 2.2rem;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;

                &:empty:before {
                    content: "No description";
                }
            }

            //Tag synonym styling
            .lb-tag-synonym {
                height: 1.1rem;
                font-style: italic;
                margin: 0;

                &:empty:before {
                    content: "No synonyms";
                }
            }

            //Edit button styling
            .lb-tag-edit {
                position: absolute;
                right: 0.5rem;
                top: 0.5rem;
                padding: 0;
                margin: 0;

                button {
                    padding: 2px 6px;

                    &:hover {
                        color: $brand-primary;
                    }
                }
            }
        }

        //Styling for the first div, which suggests you to search for the keyword
        .lb-search-suggestion {
            display: block; //change to "none" later and toggle to "block" when the hint is needed
            padding: 0.4rem 0.5rem;
            margin-bottom: 0.5rem;
            border-bottom: $lb-border;
            font-size: $lb-font-size;

            span {
                color: $brand-secondary;
            }

            .lb-keyword {
                font-style: italic;
                display: inline;
            }

            //Disabling the background on hover and the pointer cursor, unlike for the other items
            &:hover {
                cursor: auto;
                background: #FFF;
            }
        }

        //Styling for the "Create new tag"
        .lb-add-tag {
            padding: 0;
            border-top: $lb-border;

            button {
                display: block;
                padding: 0.4rem 0.5rem;
                width: 100%;
                height: 100%;
                font-size: $lb-font-size;
                text-align: left;
                text-decoration: none;
            }
        }
    }


    .lb-search-wrapper {
        //Add spacing between tags/keywords
        .label {
            margin: 0.15rem 0.15rem 0.15rem 0;
        }

        .lb-search-dropdown {
            width: 25rem;
        }
    }


    .lb-tags-wrapper {

        //Remove tag counter from "Add tag"
        .lb-tag-usage {
            display: none;
        }

        .lb-search-dropdown {
            width: 25rem;
        }

        .lb-search-input {

            .lb-search-input-container {
                padding-bottom: 0.3rem;
            }
        }

        //Add spacing between tags
        .label {
            margin-right: 0.25rem;
        }

        //Remove reset button in tags
        .input-group-btn button {
            display: none;
        }
    }

    //When CKE divarea plugin has been fixed, replace bwlow with labnote-ckeditor-divarea.css
    .lb-labnote-wrapper {
        .thumbnail {
            padding-bottom: 1rem;
        }

        //Styling of labnote's header
        .lb-labnote-header {
            padding-top: 0.5rem;
            margin-bottom: 1rem;
            border-bottom: 1px solid #ccc;
            background: #FFF;
            font-size: 1.2rem;
            height: 2.8rem;
            z-index: 1000;

            input::-webkit-input-placeholder {
                font-style: italic;
            }

            input:focus::-webkit-input-placeholder {
                opacity: 0;
            }

            input:-moz-placeholder { /* Firefox 18- */
                font-style: italic;
            }

            input::-moz-placeholder { /* Firefox 19+ */
                font-style: italic;
            }

            input:-ms-input-placeholder {
                font-style: italic;
            }

            //remove padding to fix vertical alignment of buttons in labnote header
            & > div > button {
                padding: 0;
            }

            //Spacing between lb-labnote-header elements
            #dateLong, #dateShort, #title, #editBtn, #cancelBtn, #okBtn, #dbSyncBtn, .dropdown {
                margin-left: 0.5rem;
            }

            #title {
                font-size: 1.2rem;
                border: 0;
                background: inherit;
                color: $lb-text-color;
                max-width: 8rem;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            //Add hover to Edit icon+text
            #editBtn:hover, #dbSyncBtn:hover, #editBtn:hover span, #dbSyncBtn:hover span {
                color: $brand-primary;
            }

            //Add color and hover to Save icon+text
            #okBtn, #okBtn span {
                color: $brand-primary;

                &:hover, &:hover span {
                    color: darken($brand-primary, 15%);
                }
            }

            //Add color and hover to Cancel icon+text
            #cancelBtn, #cancelBtn span {
                color: $brand-secondary;

                &:hover, &:hover span {
                    color: darken($brand-secondary, 25%);
                }
            }
        }

        //Styling of labnote's content
        .lb-labnote-content {
            padding-bottom: 0.5rem;
            min-height: 15rem;

            word-break: break-word;

            //Fixing the overflow of images
            // img {
            //     max-width: 100%;
            //     height: auto;
            // }

            hr {
                margin-top: 0;
                margin-bottom: 0.75rem;
            }
        }
    }

    .lb-viewmore {
        padding-bottom: 1rem;
    }

    .cke_editable, .lb-labnote-content {
        background: #FFF;
        overflow-x: hidden;

        p {
            margin: 0;
        }

        img {
            max-width: 100%;
            height: auto;
        }

        //Loader/spinner shown during image upload and thumbnail generation
        .cke_upload_uploaded, .cke_upload_uploading {
            margin: 1rem 2rem 1rem 2rem;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 1040;
            outline: 0;
            background-image: url("../assets/images/loader.svg");
            background-repeat: no-repeat;
            background-size: 40px 40px;
            background-position: center center;

            img {
                opacity: 0.5;
                padding: 10px;
            }
        }

        span.cke_upload_uploading:after {
            // content: attr(update-text);
            content: "Uploading image...";
            position: absolute;
            top: 75%;
            left: 24%;
            font-size: 1.2rem;
        }

        span.cke_upload_uploaded:after {
            content: "Processing image, please wait";
            position: absolute;
            top: 75%;
            left: 21%;
            font-size: 1.2rem;
        }


        //CK EDITOR styling START
        //Fix to show the actual editor normally (has to be inside lb-labnote-content to override the standard editor.css)
        .cke_bottom,
        .cke_contents,
        .cke_top {
            overflow: initial;
        }

        .cke {
            border: none;
            border-radius: 0px;
            padding: 0rem;
            background: #FFF;
            margin-bottom: 0.5rem;

            //Turn on when testing CKE locally
            // visibility: visible;
        }

        .cke_bottom, .cke_top {
            padding: 0rem;
            background: #FFF;
        }

        .cke_contents {
            border: none;
            border-radius: 0px;
        }

        .cke_resizer_ltr {
            margin-top: -0.6rem;
            margin-right: 0rem;
        }

        .cke_resizer {
            border-width: 10px 10px 0 0;
            border-color: transparent $brand-secondary transparent transparent;
        }

        .cke_image_resizer {
            bottom: -35px;
            right: -15px;
        }

        .cke_toolbox {
            width: 100%;
            display: none;
            position: relative;
            height: 37px;
        }

        .cke_toolgroup {
            border: 1px solid $lb-border-color;
            border-radius: 0px;

            a.cke_button {
                border-radius: 0px;
            }

            a.cke_button_disabled:active,
            a.cke_button_disabled:focus,
            a.cke_button_disabled:hover,
            a.cke_button_off:active,
            a.cke_button_off:focus,
            a.cke_button_off:hover {
                background: $lb-hover-bg;
            }
        }

        // Removing padding inside the ck-editor
        .cke_wysiwyg_div {
            padding: 0rem;
            min-height: 10rem;
            // max-height: 95rem;
        }

        //Prevent image overflow in browse mode
        .ck-editor.disabled {
            // max-height: 95rem;
            overflow: auto;
        }

        //Image2 styles
        img.right {
            border: 1px solid #ccc;
            float: right;
            margin-left: 15px;
            padding: 5px;
        }

        img.left {
            border: 1px solid #ccc;
            float: left;
            margin-right: 15px;
            padding: 5px;
        }

        pre {
            white-space: pre-wrap; /* CSS 2.1 */
            word-wrap: break-word; /* IE7 */
            -moz-tab-size: 4;
            tab-size: 4;
        }

        .marker {
            background-color: $lb-blue;
        }


        figure {
            //Use inline-block to prevent issues with p-tags wrapping around the figure
            display: inline-block;
            border: solid 1px #ccc;
            background: rgba(0, 0, 0, 0.05);
            padding: 10px;
            margin: 1rem 2rem 1rem 2rem;
        }

        figure > figcaption {
            text-align: center;
            display: block; /* For IE8 */
            &:hover {
                border: none;
            }
        }

        a > img {
            padding: 1px;
            margin: 1px;
            border: none;
            outline: 1px solid #0782C1;
        }

        thead {
            th {
                color: #FFF;
                background: #E2E2E2;
            }
        }
    }


    //Filelist START ---------------------------------
    .lb-filelist {
        background: #FFF;

        //Add a border to the last table row
        tbody tr:last-child {
            border-bottom: 1px solid $gray-500;
        }

        & > button {
            padding: 0.375rem 0rem;
        }

        button {
            font-size: $lb-font-size;
        }

        #collapseFilelist {
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
        }

        //Style FA Dropbox logo
        .fa.fa-dropbox {
            color: #0B7DE2;
        }

        tr.inertFile, tr.lb-filelist-inactive {
            opacity: 0.5;

            a, button {
                pointer-events: none;
                cursor: default;
            }
        }
    }

    //Labnotes END----------------------------------------

    .lb-tag {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
    }

    //Styling for spinners and empty search results
    .lb-padded-text {
        text-align: center;
        color: $lb-grey;
        padding: 1rem;
    }


    //Wrapper for Sidebar
    .lb-sidebar-wrapper {
        padding-right: 0px;
        z-index: 1005;
        position: fixed;
        left: $lb-sidebar-width;
        top: 60px;
        width: 0px;
        height: 100%;
        margin-left: -$lb-sidebar-width;
        overflow-y: auto;
        background: $lb-sidebar-background;
        -webkit-transition: all 0.1s ease;
        -moz-transition: all 0.1s ease;
        -o-transition: all 0.1s ease;
        transition: all 0.1s ease;
    }

    #sidebar-toggle {

    }


    .lb-sidebar-projects {
        width: $lb-sidebar-width;
        background: inherit;
        padding: 0;

        .lb-labnote-list {
            .lb-infinity-scroll {
                height: 300px; //TODO: how to set this to fit the height?
                overflow-y: auto;
            }
        }

        .dropdown {
            position: absolute;
            right: 2rem;
        }

        .list-group {
            list-style-type: none;
        }

        .lb-sidebar-header {
            width: $lb-sidebar-width;
            font-size: $lb-font-size*1.1;
            color: $lb-sidebar-text;
            padding-top: 0.5rem;
            padding-right: 1rem;
            padding-bottom: 0.5rem;
            padding-left: 0.5rem;
            border-bottom: 1px solid $lb-grey;
            //Fix vertical align of button
            button {
                padding: 0;
            }

            .fa-bars {
                color: $lb-sidebar-text;
            }
        }

        .lb-dropbox-connect {
            text-align: center;
            padding-top: 0.5rem;
            font-size: $lb-font-size*1.2;

            & > a {
                color: $brand-primary;
            }

            a:hover {
                color: lighten($brand-primary, 15%);
            }
        }

        .list-group-item {
            background: inherit;
            color: $lb-sidebar-text;
            padding: 0;
            border: none;

            & > span {
                padding: 0.5rem 1rem;
                color: $lb-sidebar-text;
            }

            &:hover {
                color: #fff;
                background: lighten($lb-sidebar-background, 10%);
                cursor: pointer;
            }

            //Show on active projects
            &.lb-project-active {
                & > a, & > div > button > i, span {
                    color: $lb-sidebar-text;
                    background: lighten($lb-sidebar-background, 20%);
                }
            }
        }

        li.lb-labnote-list {

        }

        .lb-labnote-date {
            font-size: $font-size-base*0.7;
        }
    }


    //Fade deleted labnotes in All projects and search
    .lb-labnote-deleted {
        .lb-labnote-content, .lb-tags-wrapper, .lb-filelist {
            opacity: 0.5;
        }

        //Diable buttons in filelist
        .lb-filelist .dropdown {
            button {
                pointer-events: none;
                cursor: default;
            }
        }
    }

    //Hide/show labnote elements in single deleted or projects (eg. edit/sync buttons)
    .lb-project-labnotes-deleted,
    .lb-single-labnotes-deleted,
    .lb-labnote-deleted {

        .lb-deleted-mode-hide {
            display: none;
        }

        button.lb-deleted-mode-show {
            display: block;
        }

        .lb-deleted-mode-show {
            display: initial;
        }
    }

    //Hide dropdown-menu in deleted projects labnotes
    .lb-project-labnotes-deleted {
        .dropdown {
            display: none;
        }
    }

    //Hide deleted-mode elements by default
    .lb-deleted-mode-show,
    .lb-project-deleted {
        display: none;
    }

    //Hide normal-mode elements in deleted wrapper
    .lb-projects-deleted {
        .lb-deleted-mode-hide {
            display: none;
        }

        //Show deleted-mode elements in deleted wrapper
        .lb-deleted-mode-show,
        .lb-project-deleted {
            display: block;
        }
    }


    //Fixed-sticky
    .top,
    .bottom {
        width: 100%;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }

    .top.fixedsticky-on,
    .bottom.fixedsticky-on {
        //Prevents jumping when set to on
        // width: 100%;
    }

    /* Fixed-Sticky CSS */
    .top {
        top: 0;
    }

    .bottom {
        bottom: 0;
    }

    //Sidebar collapse simplesidebar
    .lb-page-wrapper.toggled .lb-sidebar-wrapper {
        width: $lb-sidebar-width;
    }

    /*Set to 0px to show on top of labnote, or set to 250px to push content right*/
    .lb-page-wrapper.toggled {
        padding-left: 0px;
    }

    .lb-page-wrapper.toggled .lb-main-wrapper {
        // position: absolute;
        // margin-right: -$sidebar-width;
    }

    @media(min-width: 992px) {
        .lb-page-wrapper {
            padding-left: $lb-sidebar-width;
        }

        .lb-page-wrapper.toggled {
            padding-left: 0;
        }

        .lb-sidebar-wrapper {
            width: $lb-sidebar-width;
        }

        .lb-page-wrapper.toggled .lb-sidebar-wrapper {
            width: 0;
        }

        .lb-main-wrapper {
            position: relative;
        }

        .lb-page-wrapper.toggled .lb-main-wrapper {
            position: relative;
            margin-right: 0;
        }
    }

    //Sidebar END----------------------------------------

    //SIGNUP PAGE START
    .lb-signup-form {
        display: block;
        margin-top: 0.5rem;
        padding-bottom: 3rem;

        label {
            width: 100%;
        }

        .lb-signup-form-label {
            padding-top: 0.5rem;
        }

        .lb-signup-terms, .lb-signup-recaptcha {
            padding-bottom: 1rem;
        }

        .lb-signup-terms {
            span {
                vertical-align: middle;
                margin-left: 0.4rem;
            }
        }
    }

    //SIGNUP PAGE END

    //SETTINGS PAGE START
    .lb-settings {
        margin-bottom: 2.5rem;

        .thumbnail {
            padding: 0.9375rem 0rem;

            h4 {
                margin: 0rem;
            }
        }

        .lb-settings-item {
            padding: 0rem;
            margin-bottom: 0.9375rem;
            border-bottom: none;
        }
    }

    // PASSWORD UPDATE
    .lb-password-update {
        label {
            width: 100%;
        }

        div label span {
            padding: 0rem;
        }

        .thumbnail {
            padding: 0.9375rem 0rem;

            h4 {
                margin: 0rem;
            }
        }
    }

    //SETTINGS PAGE END

    .lb-signup, .lb-settings {
        top: 3rem;
    }


    //FRONT PAGE START
    .lb-front {
        padding-bottom: 7rem;

        input {
            margin-bottom: 1.1rem;
        }

        .lb-circles {
            padding-bottom: 4rem;

            img {
                max-width: 100%;
            }
        }

        .lb-labbird-newsletter {
            h1 {
                font-size: 2rem;
            }

            h2 {
                font-size: 1.25rem;
            }

            h3 {
                font-size: 1.5rem;
            }

            padding-top: 1rem;
            text-align: left;

            form {
                margin-top: 1.1rem;

                span {
                    padding: 0rem;
                }

                input, button {
                    padding: 0.75rem 1.25rem;
                    font-size: 1.25rem;
                    line-height: 1.333;
                    height: auto;
                }
            }

            @include media-breakpoint-up(md) {
                padding-top: 0rem;
                p {
                    text-align: justify !important;
                }
            }
        }

        .lb-labbird-newsletter-header {
            padding-top: 3rem;
            @media (min-width: 420px) {
                padding-top: 1rem;
            }
        }
    }

    .lb-footer {
        .nav {
            padding-right: 1rem;
        }

        .navbar {
            margin-bottom: 0;
        }
    }

    //FRONT PAGE END

    //CONTACTS PAGE START
    .lb-contacts {
        // Adding padding around the thumbnail
        padding: 0.9375rem 0rem;

        // Adjusting the h4 and the border under it
        h4 {
            margin: 0.5rem 0rem 0rem 0rem;

            &:first-child {
                margin: 0rem;
            }
        }

        // Adding the light-grey background on hover
        a {
            &:hover {
                background: $lb-hover-bg;
            }
        }

        // Fix to inherit the width from the col (originally fixed at 280px in the dropdown)
        .navbar-dropdown-element {
            width: auto;
        }
    }

    //CONTACTS PAGE END


    // ------------------------------------ SCREEN SIZE DIFFERENCE STYLING STARTS ------------------------------------
    @include media-breakpoint-up(xs) {
    }


    @include media-breakpoint-up(sm) {

        .navbar {
            .nav-link {
                float: none;
                margin-left: 0;
            }
        }

        //Footer
        .navbar-fixed-bottom {
            position: initial;
        }

        //FRONT PAGE START

        //FRONT PAGE END

        //SIGNUP PAGE START

        //SIGNUP PAGE END


        //DOCUMENTS PAGE START
        .lb-documents {
            padding: 0.5rem !important;
        }
        //DOCUMENTS PAGE END

        //LABNOTES PAGE START
        // Has to be nested twice because it is nested before (if not nested - won't have the priority on the smaller device)
        .lb-search {
            .input-group {
                .lb-search-input {
                    padding: 0rem 2.322rem 0rem 0.5rem;
                }
            }
        }


        .lb-labnote-wrapper {

            //All these changes are to fit the header in one line on mobile
            .lb-labnote-header {
                #dateLong, #dateShort, #title, #editBtn, #cancelBtn, #okBtn, #dbSyncBtn, .dropdown {
                    margin-left: 2rem;
                }

                span {
                    font-size: 1.2rem;
                }

                #title {
                    //min-width: : 100%;
                    width: 50%;
                    max-width: 100%;
                }

                #dateShort {
                    margin-left: 1rem;
                }

            }

        }

        //Decrease lnr icons in labnote header
        .lnr {
            font-size: 17px;
        }

        //LABNOTES PAGE END
    }

    // deprecated: @screen-tablet, or @screen-sm
    @include media-breakpoint-up(md) {
        .navbar {
            button > span {
                display: inline;
            }
        }


        .cke_toolbox {
            display: block !important;
        }

        //FRONT PAGE START

        //FRONT PAGE END

        //SIGNUP PAGE START

        //SIGNUP PAGE END

        //SETTINGS PAGE START

        //SETTINGS PAGE END

        //LABNOTES PAGE START

        //LABNOTES PAGE END
    }

    // deprecated: @screen-desktop, or @screen-md
    @include media-breakpoint-up(lg) {

        //FRONT PAGE START

        //FRONT PAGE END

        //SIGNUP PAGE START

        //SIGNUP PAGE END

        //SETTINGS PAGE START

        //SETTINGS PAGE END

        //LABNOTES PAGE START

        //LABNOTES PAGE END
    }

    // deprecated: @screen-lg-desktop, or @screen-lg
    @include media-breakpoint-up(xl) {


        //FRONT PAGE START

        //FRONT PAGE END

        //SIGNUP PAGE START

        //SIGNUP PAGE END

        //SETTINGS PAGE START

        //SETTINGS PAGE END

        //LABNOTES PAGE START

        //LABNOTES PAGE END
    }

    @media print {

        body {
            padding-top: 100px;
        }
        .dropdown-menu {
            display: none !important;
        }
        #title {
            font-size: 1rem;
            border: 0;
            background: inherit;
            color: $lb-text-color;
            max-width: 8rem;
            overflow: hidden;
            text-overflow: ellipsis;
        }

    }

    // ------------------------------------ SCREEN SIZE DIFFERENCE STYLING ENDS ------------------------------------


    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        opacity: 0;
    }

</style>
