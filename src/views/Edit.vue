<template>
        <v-dialog v-model="dialog" persistent max-width="700px">
            <!-- <v-btn slot="activator" color="primary" dark>Open Dialog</v-btn> -->
        <v-card>
            <v-card-title>
                <span class="headline">User Profile</span>
            </v-card-title>
            <v-card-text>
                <v-form>
                    <v-text-field
                        label="Username"
                        prepend-icon="person"
                        v-model="name"
                        @input="$v.name.$touch()"
                        @blur="$v.name.$touch()"
                        :error-messages="nameErrors"
                        :counter="20"
                        required
                    ></v-text-field>
                    <v-text-field
                        label="Password"
                        v-model="password"
                        prepend-icon="lock"
                        :append-icon="'autorenew'"
                        @click:append="() => genPass()"
                        @input="$v.password.$touch()"
                        @blur="$v.password.$touch()"
                        :error-messages="passwordErrors"
                        required
                    ></v-text-field>
                    <v-select
                        label="Project"
                        v-model="project"
                        :items="projects"
                        @input="$v.project.$touch()"
                        @blur="$v.project.$touch()"
                        :error-messages="projectErrors"
                        required
                    ></v-select>
                    <v-layout>
                        <!--<v-flex xs2>-->
                            <!--<v-checkbox-->
                            <!--label="Create Folder"-->
                            <!--v-model="createFolder"-->
                            <!--&gt;</v-checkbox>-->
                        <!--</v-flex>-->
                        <v-flex xs3>
                            <v-checkbox
                            label="Outsource"
                            v-model="outsource"
                            ></v-checkbox>
                        </v-flex>
                        <v-flex xs7>
                            <v-text-field
                            v-if="createFolder || !outsource && outsource"
                            label="Folder"
                            v-model="folder"
                            ></v-text-field>
                            <v-select
                            v-if="!outsource && !createFolder"
                            label="Folder"
                            v-model="folder"
                            :items="folders"
                            @input="$v.folder.$touch()"
                            @blur="$v.folder.$touch()"
                            :error-messages="folderErrors"
                            required
                            ></v-select>
                            <v-select
                            v-if="outsource && !createFolder"
                            label="Folder"
                            v-model="folder"
                            :items="foldersOut"
                            @input="$v.folder.$touch()"
                            @blur="$v.folder.$touch()"
                            :error-messages="folderErrors"
                            required
                            ></v-select>
                        </v-flex>
                    </v-layout>
                </v-form>
                <v-responsive>
                <p>Logins: <v-chip>{{ login_count }}</v-chip></p>
                <p>Last seen IP: <v-chip>{{ last_ip }}</v-chip></p>
                <p>Last login: <v-chip>{{ last_login }}</v-chip></p>
                <hr>
                <p>Bad logins: <v-chip label color="pink" text-color="white">{{ err_login_count }}</v-chip></p>
                <p>Last bad login: <v-chip label color="pink" text-color="white">{{ last_err_login }}</v-chip></p>
                <hr>

                <p>Updated: {{ updatedAt }}</p>
                <p>Created: {{ createdAt }}</p>
                </v-responsive>
            </v-card-text>

            <v-card-actions>


                <v-dialog v-model="remove_dialog" persistent max-width="290">
                <v-btn slot="activator" color="error" dark>remove</v-btn>
                <v-card>
                    <v-card-title class="headline">Really remove?</v-card-title>
                    <v-card-text>Think twice.</v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" flat @click="remove(unic_id)">Yes</v-btn>
                    <v-btn color="green darken-1" flat @click.native="remove_dialog = false">No</v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>

                <v-spacer></v-spacer>
                <v-btn dark @click="submit()">Save</v-btn>
                <v-btn @click="close()">Cancel</v-btn>
            </v-card-actions>

        </v-card>
    </v-dialog>
</template>

<script>
    import {mapGetters} from "vuex";
    import FtpAccountsService from "@/services/FtpAccountsService";
    import { validationMixin } from 'vuelidate'
    import { required, minLength, maxLength } from 'vuelidate/lib/validators'

    export default {
        mixins: [validationMixin],

        computed: {
            ...mapGetters({
                editId: "EditId",
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

        validations: {
            name: { required, maxLength: maxLength(10) },
            password: { required },
            project: { required },
            folder: { required },
        },

        data () {
            return {
                dialog: false,
                valid: false,
                name: "",
                password: "",
                outsource: false,
                folder: null,
                createFolder: false,
                folders: [],
                foldersOut: [],
                project: null,
                projects: [],
                success: null,
                err_login_count: 0,
                last_err_login: 0,
                last_ip: null,
                last_login: 0,
                login_count: 0,
                updatedAt: null,
                createdAt: null,
                unic_id: 0,
                remove_dialog: false,
            };
        },

        methods: {
            async submit () {
                this.$v.$touch()
                if (this.$v.$invalid) {
                    console.log('ERROR')
                } else {
                    let account = {};
                    account.unic_id = this.unic_id;
                    account.name = this.name;
                    account.password = this.password;
                    account.project = this.project;
                    account.createFolder = this.createFolder;
                    account.homedir = this.outsource
                                ? `/raid/ftp/outsource/${this.folder}`
                                : `/raid/ftp/${this.folder}`;
                    await FtpAccountsService.update(account);
                    this.$store.dispatch("setResult", "Account Saved");
                }
                this.close();
            },
            clear () {
                this.$refs.form.reset();
            },
            genPass () {
                const length = 11;
                const charset = "!@_#$abcdfhjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
                let retVal = "";
                for (var i = 0, n = charset.length; i < length; ++i) {
                    retVal += charset.charAt(Math.floor(Math.random() * n));
                }
                this.password = retVal;
            },
            close() {
                this.$store.dispatch("setEditId", false);
                this.dialog = false;
            },
            async remove(unic_id) {
                console.log(unic_id);
                await FtpAccountsService.remove(unic_id);
                this.remove_dialog = false;
                this.dialog = false;
                this.$store.dispatch("setResult", "Account Deleted");
            }
        },

        watch: {
            "editId": {
                async handler (val) {
                    if (val) {
                        let account = (await FtpAccountsService.show(val)).data[0];
                        this.unic_id = account["unic_id"];
                        this.name = account["username"];
                        this.password = account["password"];
                        this.project = account["project"];
                        this.folder= account["homedir"].split("/")[account["homedir"].split("/").length - 1];
                        this.outsource = account["homedir"].includes("outsource")
                                        ? true
                                        : false;
                        this.err_login_count = account["err_login_count"];
                        this.last_err_login = t2s(account["last_err_login"]);
                        this.last_ip = account["last_ip"];
                        this.last_login = t2s(account["last_login"]);
                        this.login_count = account["login_count"];


                        if (account["updatedAt"]) this.updatedAt = account["updatedAt"].split("T")[0];
                        if (account["createdAt"]) this.createdAt = account["createdAt"].split("T")[0];

                        this.folders = (await FtpAccountsService.folders("")).data;
                        this.foldersOut = (await FtpAccountsService.folders("outsource")).data;
                        this.projects = (await FtpAccountsService.projects()).data;

                        this.dialog = true;
                    }
                }
            }
        }

    };

    function t2s(ts) {
        let d = new Date((ts) * 1000);
        return d.toLocaleString("ru-RU");
}
</script>

<style>

</style>
