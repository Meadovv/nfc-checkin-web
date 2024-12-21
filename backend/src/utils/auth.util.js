const models = require('../models');
const crypto = require('crypto');
const {
    BAD_REQUEST_ERROR,
    UNAUTHENTICATED_ERROR
} = require('../core/response.core');
const configs = require('../.configs');
const jwt = require('jsonwebtoken');

class AuthUtils {
    static newSecret = async (user_id) => {
        const secret = crypto.randomBytes(32).toString('hex'); // 64 characters
        const newKey = await models.KeyModel
            .findOneAndUpdate(
                { user_id },
                {
                    secret,
                    expiresAt: new Date(Date.now() + Number(configs.jwt.expired))
                },
                { upsert: true, new: true }
            );
        return newKey.secret;
    }

    static IP = (ip) => {
        const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:)$/;
        const result = ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
        if (!result) {
            throw new BAD_REQUEST_ERROR('Invalid IP Address');
        }
        return ip;
    }

    static decodeJWT = ({ encrypted, secret }) => {
        try {
            const decoded = jwt.verify(encrypted, secret);
            return decoded;
        } catch (error) {
            throw new UNAUTHENTICATED_ERROR('Invalid Token');
        }
    }

    static mongoID = (id) => {
        const pattern = /^[0-9a-fA-F]{24}$/;
        const result = pattern.test(id);
        if (!result) {
            throw new BAD_REQUEST_ERROR('Invalid ID');
        }
        return id;
    }
}

module.exports = AuthUtils;