const axios = require('axios');
const { getConfigData } = require('.');

module.exports = async (configData = null) => {
    if (configData === null) {
        const config = await getConfigData({});
        console.log(config);
        configData = config;
    }
    const body = {
        "clientID": configData.setu_client_id,
        "secret": configData.setu_secret_key,
    }
    console.log(body)
}
