const axios = require('axios');
const { getConfigData } = require('.');
const Config = require("../models/config");
const { setuSandboxURL, setuProdURL } = require('../../config/urls')

module.exports = async () => {
    const config = await getConfigData();
    console.log(config);
    // if (config.setu_access_token) {
    //     return config.setu_access_token
    // }
    const body = {
        "clientID": config.setu_client_id,
        "secret": config.setu_secret_key,
    }
    const API_URL = process.env.DEVELOPMENT ? setuSandboxURL : setuProdURL;
    console.log(API_URL)
    const response = await axios.post(`${API_URL}/v2/auth/token`, body)
    console.log(response.data)
    await Config.findOneAndUpdate({ setu_client_id: config.setu_client_id }, { setu_access_token: response.data.data.token }).exec();
    return response.data.data.token;
}
