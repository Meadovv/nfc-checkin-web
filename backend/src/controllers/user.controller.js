const {
    SUCCESS
} = require('../core/response.core');
const utils = require('../utils');
const service = require('../services');

class UserController {
    static nfcCheckIn = async (req, res) => {
        return new SUCCESS({
            message: 'NFC Check In Success',
            metadata: await service.UserService.nfcCheckIn({
                ...utils.Lodash.verifyJSONFields({
                    fields: ['nfc_id_jwt_encrypted'],
                    object: req.query
                })
            })
        }).send(req, res);
    }
}

module.exports = UserController;