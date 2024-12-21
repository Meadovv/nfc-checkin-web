const models = require('../models');
const bcrypt = require('bcrypt');
const {
    NOT_FOUND_ERROR,
    UNAUTHENTICATED_ERROR
} = require('../core/response.core');
const configs = require('../.configs');
const jwt = require('jsonwebtoken');
const utils = require('../utils');

class GlobalService {
    static login = async ({ username, password, ip }) => {
        const foundUser = await models.UserModel
            .findOne({ username });
        if (!foundUser) {
            throw new NOT_FOUND_ERROR('User not found');
        }

        const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);
        if (!isPasswordCorrect) {
            throw new UNAUTHENTICATED_ERROR('Password is incorrect');
        }

        const secret = await utils.Auth.newSecret(foundUser._id);

        const token = jwt.sign({
            user_id: foundUser._id,
            role: foundUser.role,
            ip
        }, secret, { expiresIn: configs.jwt.expired });

        return {
            ...utils.Lodash.getFields({
                object: foundUser,
                fields: ['_id', 'username', 'role']
            }),
            token,
        }
    }

    static verifyToken = async ({ id }) => {
        const foundUser = await models.UserModel
            .findById(id).lean();
        if (!foundUser) {
            throw new NOT_FOUND_ERROR('User not found');
        }

        return utils.Lodash.getFieldsExcept({
            object: foundUser,
            fields: ['password', 'createdAt', 'updatedAt']
        });
    }
}

module.exports = GlobalService;