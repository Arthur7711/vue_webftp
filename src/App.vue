<template>
    <v-app toolbar>
        <PageHeader app></PageHeader>
        <v-content>
            <router-view></router-view>
        </v-content>
    </v-app>
</template>

<script>
    import PageHeader from "@/components/Header";

    export default {
        name: 'App',
        components: {
            PageHeader
        },
        data() {
            return {
                //
            }
        }
    }
</script>
