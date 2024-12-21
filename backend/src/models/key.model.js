const {
    model, Schema
} = require('mongoose');
const configs = require('../.configs');
const collection_name = 'keys';

const schema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    secret: {
        type: String,
        length: 64,
        required: true
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + Number(configs.jwt.expired))
    }
}, {
    timestamps: true,
    versionKey: false,
});

// Create TTL index on expiresAt field
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = model(collection_name, schema);