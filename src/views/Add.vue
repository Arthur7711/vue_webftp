<template>
    <v-layout align-center justify-center>
        <v-flex xs12 md6>
            <v-card class="elevation-12">

                <v-card-text>
                    <v-form>
                        <v-text-field
                                label="Username"
                                prepend-icon="person"
                                v-model="name"
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
                        <v-autocomplete
                                label="Project"
                                v-model="project"
                                :items="projects"
                                @input="$v.project.$touch()"
                                @blur="$v.project.$touch()"
                                :error-messages="projectErrors"
                                required
                        ></v-autocomplete>
                        <v-layout row wrap>
                            <!--<v-flex xs6 md2>-->
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
                            <v-flex xs9>
                                <v-text-field
                                        v-if="createFolder || !outsource && outsource"
                                        label="Folder"
                                        v-model="folder"
                                ></v-text-field>
                                <v-autocomplete
                                        v-if="!outsource && !createFolder"
                                        label="Folder"
                                        v-model="folder"
                                        :items="folders"
                                        @input="$v.folder.$touch()"
                                        @blur="$v.folder.$touch()"
                                        :error-messages="folderErrors"
                                        required
                                ></v-autocomplete>
                                <v-autocomplete
                                        v-if="outsource && !createFolder"
                                        label="Folder"
                                        v-model="folder"
                                        :items="foldersOut"
                                        @input="$v.folder.$touch()"
                                        @blur="$v.folder.$touch()"
                                        :error-messages="folderErrors"
                                        required
                                ></v-autocomplete>
                            </v-flex>
                        </v-layout>
                    </v-form>
                </v-card-text>

                <v-card-actions>
                    <!-- <v-btn @click="submit()">Create</v-btn> -->
                    <v-spacer></v-spacer>
                    <v-btn dark @click="submit()">Create</v-btn>
                    <!-- <v-btn color="error" :to="{name: 'index'}">Cancel</v-btn> -->
                </v-card-actions>

            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    import FtpAccountsService from "@/services/FtpAccountsService";
    import {validationMixin} from 'vuelidate'
    import {required, minLength, maxLength} from 'vuelidate/lib/validators'

    export default {
        mixins: [validationMixin],
        validations: {
            name: {required, maxLength: maxLength(10)},
            password: {required},
            project: {required},
            folder: {required},
        },
        data() {
            return {
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
                success: null
            };
        },
        computed: {
            projectErrors() {
                const errors = [];
                if (!this.$v.project.$dirty) return errors;
                !this.$v.project.required && errors.push('Item is required');
                return errors;
            },
            folderErrors() {
                const errors = [];
                if (!this.$v.folder.$dirty) return errors;
                !this.$v.folder.required && errors.push('Item is required');
                return errors;
            },
            passwordErrors() {
                const errors = [];
                if (!this.$v.password.$dirty) return errors;
                !this.$v.password.required && errors.push('Password is required.');
                return errors;
            },
            nameErrors() {
                const errors = [];
                if (!this.$v.name.$dirty) return errors;
                !this.$v.name.maxLength && errors.push('Name must be at most 20 characters long');
                !this.$v.name.required && errors.push('Name is required.');
                return errors;
            }
        },
        methods: {
            async submit() {
                // this.$v.$touch()
                // if (this.$v.$invalid) {
                //     console.log('ERROR')
                // } else {
                let account = {};
                account.name = this.name;
                account.password = this.password;
                account.project = this.project;
                account.createFolder = this.createFolder;
                account.homedir = this.outsource
                    ? `/raid/ftp/outsource/${this.folder}`
                    : `/raid/ftp/${this.folder}`;
                await FtpAccountsService.submit(account);
                this.$store.dispatch("setResult", "Account Created");
                this.$router.push({
                    name: 'index',
                })
                // }
            },
            clear() {
                this.$refs.form.reset();
            },
            genPass() {
                const length = 11;
                const charset = "!@_#$abcdfhjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
                let retVal = "";
                for (let i = 0, n = charset.length; i < length; ++i) {
                    retVal += charset.charAt(Math.floor(Math.random() * n));
                }
                this.password = retVal;
            }
        },
        async mounted() {
            try {
                this.folders = (await FtpAccountsService.folders("")).data;
                this.foldersOut = (await FtpAccountsService.folders("outsource")).data;
                this.projects = (await FtpAccountsService.projects()).data;
            } catch (err) {
                console.log(err);
            }
        }
    };
</script>

<style>

</style>
