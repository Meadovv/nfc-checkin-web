const {
    model, Schema
} = require('mongoose');
const configs = require('../.configs');

const collection_name = 'gates';

const schema = new Schema({
    gate_id: {
        type: String,
        required: true
    },
    gate_name: {
        type: String,
        required: true
    },
    gate_secret: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = model(collection_name, schema);