import Api from "@/services/Api";

export default {
    index (search) {
        return Api().get("ftp/accounts", {
            params: {
                search: search
            }
        });
    },
    show (accountId) {
        return Api().get(`ftp/accounts/${accountId}`);
    },
    folders (who) {
        return Api().get(`ftp/directories/${who}`);
    },
    unban (ip) {
        return Api().get(`ftp/unban/${ip}`);
    },
    projects () {
        return Api().get("ftp/projects");
    },
    submit (account) {
        return Api().post("ftp/submit", account);
    },
    update(account) {
      return Api().put("ftp/submit", account);
    },
    stats () {
        return Api().get("ftp/stats");
    },
    logs() {
        return Api().get("ftp/logs");
    },
    remove(unic_id) {
        return Api().delete(`ftp/${unic_id}`);
    },
};
