const {
    model, Schema
} = require('mongoose');
const configs = require('../.configs');

const collection_name = 'records';

const schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    gate: {
        type: Schema.Types.ObjectId,
        ref: 'gates',
        required: true
    },
    time: {
        type: Date,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = model(collection_name, schema);