<template>
    <v-layout align-center justify-center>
        <v-flex xs12 sm12 md11>
            <v-card class="elevation-12">
                <v-card-text>
                    <v-layout align-center justify-center>
                        <v-flex xs6>
                            <div id="failed">
                                <h2>Failed</h2>
                                <ul>
                                    <li>
                                        <span class="name">Currently</span>
                                        <span class="number">{{cf}}</span>
                                    </li>
                                    <li>
                                        <span class="name">Total</span>
                                        <span class="number">{{tf}}</span>
                                    </li>
                                </ul>
                            </div>
                        </v-flex>

                        <v-flex xs6>
                            <div id="banned">
                                <h2>Banned</h2>
                                <ul>
                                    <li>
                                        <span class="name">Currently</span>
                                        <span class="number">{{cb}}</span>
                                    </li>
                                    <li>
                                        <span class="name">Total</span>
                                        <span class="number">{{tb}}</span>
                                    </li>
                                </ul>
                            </div>
                        </v-flex>
                    </v-layout>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                </v-card-actions>

            </v-card>

            <v-card v-if="banned != 'None'" class="elevation-12 mt-2">
                <v-card-title>
                    <span class="headline">Banned</span>
                </v-card-title>
                <v-card-text>
                    <v-card>
                        <v-layout row wrap v-for="(item, index) in banned" :key="index">
                            <v-flex xs6>
                                <v-chip color="red" text-color="white" class="mt-2" label>{{item}}</v-chip>
                            </v-flex>

                            <v-flex xs6>
                                <v-btn @click="unban(item)">Unban</v-btn>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-card-text>
            </v-card>

            <v-card class="elevation-12 mt-2">
                <v-card-text>
                    <h3>Last log</h3>
                    <div v-for="(item, index) in logs" :key="index">
                        <!-- {{item}} -->
                        <v-card class="elevation-2">
                            <v-card-text>
                                <v-layout row wrap>
                                    <v-flex xs12 md4>
                                        Username:
                                        <v-chip label>{{item.username}}</v-chip>
                                    </v-flex>
                                    <v-flex xs12 md4>
                                        IP:
                                        <v-chip label>{{item.ip}}</v-chip>
                                    </v-flex>
                                    <v-flex xs12 md4>
                                        Datetime:
                                        <v-chip label>{{item.datetime}}</v-chip>
                                    </v-flex>
                                </v-layout>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                            </v-card-actions>

                        </v-card>
                    </div>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                </v-card-actions>

            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    import FtpAccountsService from "@/services/FtpAccountsService";

    export default {
        data() {
            return {
                cf: 0,
                tf: 0,
                cb: 0,
                tb: 0,
                banned: false,
                logs: []
            };
        },
        computed: {},
        methods: {
            async unban(ip) {
                (await FtpAccountsService.unban(ip)).data;

                let stats = (await FtpAccountsService.stats()).data;
                this.cf = stats[0]["num"];
                this.tf = stats[1]["num"];
                this.cb = stats[2]["num"];
                this.tb = stats[3]["num"];

                this.banned = stats[4]["num"].split(",");

                this.logs = (await FtpAccountsService.logs()).data;
            }
        },
        async mounted() {
            let stats = (await FtpAccountsService.stats()).data;
            this.cf = stats[0]["num"];
            this.tf = stats[1]["num"];
            this.cb = stats[2]["num"];
            this.tb = stats[3]["num"];

            this.banned = stats[4]["num"].split(",");
            console.log(this.banned);
            this.logs = (await FtpAccountsService.logs()).data;
        }
    };
</script>

<style scoped>
    #failed {
        background: rgb(243, 192, 51);
        box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.2);
        margin-bottom: 30px;
        padding: 10px 20px;
    }

    #failed ul {
        padding: 0;
    }

    #failed li {
        display: inline-block;
        margin-right: 10px;
        margin-top: 10px;
        padding: 20px;
        background: rgba(255, 255, 255, 0.7);
    }

    #banned {
        background: rgb(243, 73, 51);
        box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.2);
        margin-bottom: 30px;
        padding: 10px 20px;
    }

    #banned ul {
        padding: 0;
    }

    #banned li {
        display: inline-block;
        margin-right: 10px;
        margin-top: 10px;
        padding: 20px;
        background: rgba(255, 255, 255, 0.7);
    }

    .number {
        font-weight: bold;
        color: #860ce8;
        display: block;
    }
</style>
