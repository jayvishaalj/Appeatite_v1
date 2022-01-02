const Config = require("../models/config");

module.exports = async (findCondition, updateCondition) => {
    const config = await Config.findOneAndUpdate(findCondition, updateCondition).exec();
    return config[0];
};
