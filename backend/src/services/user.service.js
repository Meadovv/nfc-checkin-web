const models = require('../models');
const {
    NOT_FOUND_ERROR,
    UNAUTHENTICATED_ERROR
} = require('../core/response.core');
const utils = require('../utils');
const moment = require('moment-timezone');
class UserService {
    static nfcCheckIn = async ({ gate_id, nfc_id_jwt_encrypted }) => {

        const gate = await models.GateModel.findOne({ gate_id }).lean();
        if (!gate) {
            throw new NOT_FOUND_ERROR('Gate not found');
        }
        if (!gate.active) {
            throw new UNAUTHENTICATED_ERROR('Gate not active');
        }

        const jwt_decoded = utils.Auth.decodeJWT({
            encrypted: nfc_id_jwt_encrypted,
            secret: gate.gate_secret
        });
        if (Number(jwt_decoded.expired) * 1000 < Date.now()) {
            throw new UNAUTHENTICATED_ERROR('JWT expired');
        }
        const user = await models.UserModel.findOne({ nfc_id: jwt_decoded.id.toUpperCase() }).lean();
        if (!user) {
            throw new NOT_FOUND_ERROR('User not found');
        }
        if (!user.activated) {
            throw new UNAUTHENTICATED_ERROR('User not activated');
        }

        const newRecord = new models.RecordModel({
            user: user._id,
            gate: gate._id,
            time: Date.now()
        });
        await newRecord.save();

        return {
            user: user.fullname_slug
        }
    }

    static getTrackingTime = async ({ user, startDate, endDate }) => {
        const startUTC = moment(startDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
            .utc()
            .toDate();
        
        const endUTC = moment(endDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
            .utc()
            .toDate();
    
        const records = await models.RecordModel
            .find({
                user,
                time: {
                    $gte: startUTC,
                    $lte: endUTC
                }
            })
            .populate('user')
            .populate('gate')
            .sort({ time: 1 })
            .lean();
    
        return records.map(record => ({
            _id: record._id,
            user: record.user.fullname_slug,
            gate: record.gate.gate_id,
            time: record.time
        }));
    }
}

module.exports = UserService;