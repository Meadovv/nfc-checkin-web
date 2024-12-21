const models = require('../models');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const {
    NOT_FOUND_ERROR,
    UNAUTHENTICATED_ERROR
} = require('../core/response.core');
const configs = require('../.configs');
const jwt = require('jsonwebtoken');
const utils = require('../utils');

class UserService {
    static nfcCheckIn = async ({ nfc_id_jwt_encrypted }) => {

        const nfc_id = await utils.Auth.decodeJWT(nfc_id_jwt_encrypted);
        const user = await models.UserModel.findOne({ nfc_id });

        return {
            nfc_id_jwt_encrypted
        }
    }
}

module.exports = UserService;