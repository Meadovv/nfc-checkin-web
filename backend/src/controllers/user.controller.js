const {
    SUCCESS
} = require('../core/response.core');
const utils = require('../utils');
const service = require('../services');

class UserController {
    static nfcCheckIn = async (req, res) => {
        return new SUCCESS({
            message: 'Check In Success',
            metadata: await service.UserService.nfcCheckIn({
                ...utils.Lodash.verifyJSONFields({
                    fields: ['gate_id', 'nfc_id_jwt_encrypted'],
                    object: req.query
                })
            })
        }).send(req, res);
    }

    static getTrackingTime = async (req, res) => {
        return new SUCCESS({
            message: 'Get Tracking Time Success',
            metadata: await service.UserService.getTrackingTime({
                user: req.caller.user_id,
                ...utils.Lodash.verifyJSONFields({
                    fields: ['startDate', 'endDate'],
                    object: req.query
                })
            })
        }).send(req, res);
    }
}

module.exports = UserController;