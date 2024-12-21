const {
    SUCCESS
} = require('../core/response.core');
const utils = require('../utils');
const service = require('../services');

class GlobalController {
    static login = async (req, res) => {
        const data = {
            ...utils.Lodash.verifyJSONFields({
                fields: ['username', 'password'],
                object: req.body
            }),
            ip: req.client_ip
        }

        return new SUCCESS({
            message: 'Login successful',
            metadata: await service.GlobalService.login(data)
        }).send(req, res);
    }

    static verifyToken = async (req, res) => {
        return new SUCCESS({
            message: 'Token verified',
            metadata: await service.GlobalService.verifyToken({
                id: req.caller.user_id
            })
        }).send(req, res);
    }
}

module.exports = GlobalController;