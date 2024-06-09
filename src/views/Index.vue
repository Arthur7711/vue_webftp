<template>
    <v-layout>
        <v-flex xs12>
            <!-- <v-alert success dismissible v-model="alert" type="success">{{jobRes}}</v-alert> -->

            <v-snackbar
                    v-model="alert"
                    :timeout="3000"
                    :multi-line="true"
                    :bottom="true">

                {{ jobRes }}

            </v-snackbar>

            <v-alert error v-if="error">{{error}}</v-alert>
            <v-data-table
                    :loading="loading"
                    class="elevation-1"
                    hide-actions
                    :headers="headers"
                    :pagination.sync="pagination"
                    :items="accounts">

                <template slot="items" slot-scope="props">
                    <td class="text-xs-right">{{props.item.unic_id}}</td>
                    <td class="text-xs-right">{{props.item.username}}</td>
                    <td class="text-xs-right">{{props.item.password}}</td>

                    <td class="text-xs-right">
                        <v-chip class="green white--text">
                            {{props.item.project}}
                        </v-chip>
                    </td>

                    <td class="text-xs-right">{{props.item.homedir}}</td>
                    <td class="text-xs-right">{{props.item.last_ip}}</td>
                    <td class="text-xs-right" v-if="props.item.last_err_login != '01.01.1970, 3:00:00'">
                        {{props.item.last_err_login}}
                    </td>
                    <td class="text-xs-right" v-else> ...</td>
                    <td class="text-xs-right" v-if="props.item.err_login_count">{{props.item.login_count}} / <strong
                            style="color:red;">{{props.item.err_login_count}}</strong></td>
                    <td class="text-xs-right" v-else> {{props.item.login_count}} / <strong
                            style="color:green;">0</strong></td>

                    <td class="text-xs-right">
                        <v-btn
                                flat
                                icon
                                @click="loadData(props.item.unic_id)">
                            <v-icon>
                                edit
                            </v-icon>
                        </v-btn>
                    </td>

                </template>

            </v-data-table>
        </v-flex>
        <Edit></Edit>
    </v-layout>
</template>

<script>
    import {mapState, mapGetters} from "vuex";
    import {validationMixin} from 'vuelidate'
    import {required, minLength, maxLength} from 'vuelidate/lib/validators'

    import FtpAccountsService from "@/services/FtpAccountsService";
    import Edit from "@/views/Edit";

    function t2s(ts) {
        let d = new Date((ts) * 1000);
        return d.toLocaleString("ru-RU");
    }

    export default {

        components: {
            Edit
        },

        computed: {
            ...mapState([
                "display",
                "success"
            ]),
            ...mapGetters({
                jobRes: "JobRes",
            }),
            projectErrors () {
                const errors = []
                if (!this.$v.project.$dirty) return errors
                !this.$v.project.required && errors.push('Item is required')
                return errors
            },
            folderErrors () {
                const errors = []
                if (!this.$v.folder.$dirty) return errors
                !this.$v.folder.required && errors.push('Item is required')
                return errors
            },
            passwordErrors () {
                const errors = []
                if (!this.$v.password.$dirty) return errors
                !this.$v.password.required && errors.push('Password is required.')
                return errors
            },
            nameErrors () {
                const errors = []
                if (!this.$v.name.$dirty) return errors
                !this.$v.name.maxLength && errors.push('Name must be at most 20 characters long')
                !this.$v.name.required && errors.push('Name is required.')
                return errors
            }
        },

        mixins: [validationMixin],

        validations: {
            name: { required, maxLength: maxLength(10) },
            password: { required },
            project: { required },
            folder: { required },
        },

        data() {
            return {
                headers: [
                    {
                        text: "ID",
                        value: "unic_id"
                    },
                    {
                        text: "Username",
                        value: "username"
                    },
                    {
                        text: "Password",
                        value: "password"
                    },
                    {
                        text: "Project",
                        value: "project"
                    },
                    {
                        text: "Directory",
                        value: "homedir"
                    },
                    {
                        text: "Last IP",
                        value: "last_ip"
                    },
                    {
                        text: "Last Bad Login",
                        value: "last_err_login"
                    },
                    {
                        text: "Logins / Bad Logins",
                        value: "err_login_count"
                    },
                    {
                        text: "Edit",
                        value: ""
                    }
                ],
                pagination: {
                    sortBy: "unic_id",
                    descending: false,
                    rowsPerPage: 1000
                },
                accounts: [],
                error: null,
                alert: false,
                username: null,
                loading: false,
            };
        },

        methods: {
            loadData (id) {
                this.$store.dispatch("setEditId", id);
            },
        },

        async mounted () {
            this.loading = true;
            this.search = this.$route.query.search;
            this.accounts = (await FtpAccountsService.index()).data;
            this.accounts.map(account => {
                let d = new Date((account.last_err_login) * 1000);
                account.last_err_login = d.toLocaleString("ru-RU");

                let dir = account.homedir.split("/").splice(-1);
                account.homedir = dir.toString();
            });
            this.loading = false;

            if (this.jobRes) {
                this.alert = this.jobRes;
            }
        },

        watch: {
            "alert": {
                async handler (val) {
                    console.log(val);
                    if (val === false) {
                        this.$store.dispatch("setResult", false);
                    }
                }
            },
            "jobRes": {
                async handler (val) {
                    if (typeof(val) !== "boolean") {
                        this.alert = val;
                        this.search = this.$route.query.search;
                        try {
                            this.accounts = (await FtpAccountsService.index(this.search)).data;
                            this.accounts.map(account => {
                                let d = new Date((account.last_err_login) * 1000);
                                account.last_err_login = d.toLocaleString("ru-RU");

                                let dir = account.homedir.split("/").splice(-1);
                                account.homedir = dir.toString();
                            });
                        } catch (err) {
                            this.error = "Getting data error(API connect fail).";
                        }
                    }
                }
            },
            "$route.query.search": {
                immediate: true,
                async handler (val) {
                    this.loading = true;
                    this.search = val;
                    try {
                        this.accounts = (await FtpAccountsService.index(val)).data;
                        this.accounts.map(account => {
                            let d = new Date((account.last_err_login) * 1000);
                            account.last_err_login = d.toLocaleString("ru-RU");

                            let dir = account.homedir.split("/").splice(-1);
                            account.homedir = dir.toString();
                        });
                    } catch (err) {
                        this.error = "Getting data error(API connect fail).";
                    } finally {
                        this.loading = false;
                    }
                }
            }
        }
    };
</script>

<style scoped>

</style>
