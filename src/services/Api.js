import axios from "axios";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
export default() => {
    return axios.create({
        baseURL: "https://webftp-api.saber3d.net/"
    });
};
