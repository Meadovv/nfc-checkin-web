const { UNAUTHORIZED_ERROR } = require('../core/response.core');
const models = require('../models');
const constants = require('../constants');
const HEADER = {
    USER_ID: 'x-user-id',
    TOKEN: 'x-api-key',
}
const utils = require('../utils');

class AuthenticationMiddleware {
    static authentication = (enabled_roles = constants.role.roles) => {
        return async (req, _res, next) => {
            const token = req.headers[HEADER.TOKEN];
            if (!token) throw new UNAUTHORIZED_ERROR('Token not found');

            const user_id = req.headers[HEADER.USER_ID];
            if (!user_id) throw new UNAUTHORIZED_ERROR('User ID not found');

            const foundKey = await models.KeyModel.findOne({ user_id });
            if (!foundKey) throw new UNAUTHORIZED_ERROR('Secret key not found');

            const foundUser = await models.UserModel.findById(user_id);
            if (!foundUser) throw new UNAUTHORIZED_ERROR('User not found');

            const jwtDecoded = utils.Auth.decodeJWT({ encrypted: token, secret: foundKey.secret });
            if (enabled_roles.length > 0 && !enabled_roles.includes(jwtDecoded.role)) {
                throw new UNAUTHORIZED_ERROR('Role is invalid');
            }
            if(jwtDecoded.user_id !== user_id) throw new UNAUTHORIZED_ERROR('User ID is invalid');
            if(jwtDecoded.ip !== req.client_ip) throw new UNAUTHORIZED_ERROR('Unauthorized IP');
            req.caller = jwtDecoded;
            next();
        };
    };
}

module.exports = AuthenticationMiddleware;