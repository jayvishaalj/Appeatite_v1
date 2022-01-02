const Config = require("../models/config");

module.exports = async () => {
    const config = await Config.find().exec();
    return config[0];
};
