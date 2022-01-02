const mongoose = require('mongoose');

const configSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    setu_access_token: String,
    setu_client_id: String,
    setu_secret_key: String
});

module.exports = mongoose.model('config', configSchema);
