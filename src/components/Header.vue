<template>
    <v-toolbar
            dark
            dense
            fixed
            app
    >
        <a href="/#/index"><img :src="require('@/assets/logo.png')"></a>

        <v-toolbar-title class="mr-4">
            FTP Account Manager
        </v-toolbar-title>

        <v-btn dark :to="{name: 'add'}">New Account</v-btn>
        <v-btn dark :to="{name: 'stats'}">Status</v-btn>
        <v-spacer></v-spacer>
        <v-text-field
                v-if="this.$route.path === '/index'"
                clearable
                @click:append="() => {}"
                placeholder="Search..."
                solo
                append-icon="search"
                color="white"
                v-model="search"
        ></v-text-field>

        </v-layout>
    </v-toolbar>
</template>

<script>
    import _ from "lodash";

    export default {

        data() {
            return {
                search: null,
                path: this.$route.path
            };
        },

        methods: {},

        watch: {

            search: _.debounce(async function (val) {
                const route = {
                    name: "index"
                };
                if (this.search !== " ") {
                    route.query = {
                        search: this.search
                    };
                }
                if (this.$route.path === '/index') this.$router.push(route);
            }, 700),

            "$route.query.search": {
                immediate: true,
                handler(val) {
                    this.search = val;
                }
            }
        }
    };
</script>

<style scoped>
</style>
