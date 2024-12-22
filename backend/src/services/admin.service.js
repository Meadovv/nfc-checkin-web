const models = require('../models');
const bcrypt = require('bcrypt');
const utils = require('../utils');
const constants = require('../constants');
const {
    BAD_REQUEST_ERROR, NOT_FOUND_ERROR
} = require('../core/response.core')

class AdminService {
    static createSuperUser = async ({ username, fullname, password }) => {
        const foundUser = await models.UserModel.findOne({ username });
        if (foundUser) {
            throw new Error('User already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        if (!username.startsWith(`${constants.prefix.app_prefix}${constants.prefix.admin_code_prefix}`)) {
            throw new BAD_REQUEST_ERROR(`Username must start with [${constants.prefix.app_prefix}] and code must start with [${constants.prefix.admin_code_prefix}]`);
        }
        const newUser = new models.UserModel({
            username,
            fullname,
            nfc_id: `0000000${username.split('optimus0')[1]}`,
            password: hashedPassword,
            role: constants.role.ROLE.ADMIN
        });
        await newUser.save();
        return utils.Lodash.getFields({
            fields: ['username', 'fullname', 'role'],
            object: newUser.toObject()
        });
    }

    static createUser = async ({ username, nfc_id, fullname, password }) => {
        const foundUser = await models.UserModel.findOne({
            $or: [
                { username },
                { nfc_id }
            ]
        });
        if (foundUser?.username === username) {
            throw new Error('User already exists');
        }
        if (foundUser?.nfc_id === nfc_id) {
            throw new Error('NFC ID already in use');
        }
        if (nfc_id && nfc_id.length < 8) {
            throw new BAD_REQUEST_ERROR('NFC ID must be at least 8 characters');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        if (!username.startsWith(`${constants.prefix.app_prefix}${constants.prefix.user_code_prefix}`)) {
            throw new BAD_REQUEST_ERROR(`Username must start with [${constants.prefix.app_prefix}] and code must start with [${constants.prefix.user_code_prefix}]`);
        }
        const newUser = new models.UserModel({
            username,
            fullname,
            nfc_id,
            password: hashedPassword,
            role: constants.role.ROLE.USER
        });
        await newUser.save();
        return utils.Lodash.getFields({
            fields: ['username', 'fullname', 'fullname_slug', 'role'],
            object: newUser.toObject()
        });
    }

    static getUsers = async ({ page = 1, limit = 10, search = null }) => {
        let query = { role: { $ne: constants.role.ROLE.ADMIN } };

        if (search) {
            query = {
                ...query,
                $or: [
                    { username: { $regex: search, $options: 'i' } }, // 'i' for case-insensitive
                    { fullname_slug: { $regex: search, $options: 'i' } },
                    { nfc_id: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const [users, total] = await Promise.all([
            models.UserModel
                .find(query)
                .skip((page - 1) * Number(limit))
                .limit(Number(limit) + 1)
                .select('username fullname fullname_slug role nfc_id activated')
                .lean(),
            models.UserModel
                .countDocuments(query)
        ]);

        const hasMore = users.length > Number(limit);
        if (hasMore) {
            users.pop();
        }

        return {
            users,
            hasMore,
            total
        };
    };

    static updateForbiddenInformation = async ({ _id, username, nfc_id, fullname_slug }) => {
        const foundUser = await models.UserModel.findOne({
            $or: [
                { username },
                { nfc_id },
                { fullname_slug },
            ]
        })
        if (foundUser?._id.toString() !== _id) {
            if (foundUser?.username === username) {
                throw new BAD_REQUEST_ERROR('Username already in use');
            }
            if (foundUser?.nfc_id === nfc_id) {
                throw new BAD_REQUEST_ERROR('NFC ID already in use');
            }
            if (foundUser?.fullname_slug === fullname_slug) {
                throw new BAD_REQUEST_ERROR('Fullname slug already in use');
            }
        }
        if (!username.startsWith(`${constants.prefix.app_prefix}${constants.prefix.user_code_prefix}`)) {
            throw new BAD_REQUEST_ERROR(`Username must start with [${constants.prefix.app_prefix}] and code must start with [${constants.prefix.user_code_prefix}]`);
        }
        if (!fullname_slug) {
            throw new BAD_REQUEST_ERROR('Fullname slug is required');
        }
        if (nfc_id && nfc_id.length < 8) {
            throw new BAD_REQUEST_ERROR('NFC ID must be at least 8 characters');
        }
        const user = await models.UserModel.findByIdAndUpdate(
            utils.Auth.mongoID(_id),
            {
                username,
                nfc_id,
                fullname_slug
            },
            { new: true }
        ).lean();
        if (!user) {
            throw new NOT_FOUND_ERROR('User not found');
        }
        return utils.Lodash.getFieldsExcept({
            fields: ['password'],
            object: user
        });
    }

    static getGates = async ({ page = 1, limit = 10, search = null }) => {
        let query = {};
    
        if (search) {
            query = {
                ...query,
                $or: [
                    { gate_id: { $regex: search, $options: 'i' } }, // 'i' for case-insensitive
                    { gate_name: { $regex: search, $options: 'i' } },
                ]
            };
        }
    
        const [gates, total] = await Promise.all([
            models.GateModel
                .find(query)
                .skip((page - 1) * Number(limit))
                .limit(Number(limit) + 1)
                .select('gate_id gate_name gate_secret activated')
                .lean(),
            models.GateModel
                .countDocuments(query)
        ]);
    
        const hasMore = gates.length > Number(limit);
        if (hasMore) {
            gates.pop();
        }
    
        return {
            gates,
            hasMore,
            total
        };
    };

    static createGate = async ({ gate_id, gate_name, gate_secret }) => {
        const foundGate = await models.GateModel.findOne({ gate_id });
        if (foundGate) {
            throw new BAD_REQUEST_ERROR('Gate already exists');
        }
        const newGate = new models.GateModel({
            gate_id,
            gate_name,
            gate_secret
        });
        await newGate.save();
        return utils.Lodash.getFields({
            fields: ['gate_id', 'gate_name'],
            object: newGate.toObject()
        });
    }

    static updateGate = async ({ _id, gate_id, gate_name, gate_secret }) => {
        const foundGate = await models.GateModel.findOne({
            $or: [
                { gate_id },
                { gate_name },
            ]
        })
        if (foundGate?._id.toString() !== _id) {
            if (foundGate?.gate_id === gate_id) {
                throw new BAD_REQUEST_ERROR('Gate ID already in use');
            }
            if (foundGate?.gate_name === gate_name) {
                throw new BAD_REQUEST_ERROR('Gate name already in use');
            }
        }
        const gate = await models.GateModel.findByIdAndUpdate(
            utils.Auth.mongoID(_id),
            {
                gate_id,
                gate_name,
                gate_secret
            },
            { new: true }
        ).lean();
        if (!gate) {
            throw new NOT_FOUND_ERROR('Gate not found');
        }
        return utils.Lodash.getFields({
            fields: ['gate_id', 'gate_name'],
            object: gate
        });
    }

    static switchUserActivation = async ({ username }) => {
        const user = await models.UserModel.findOne({ username });
        if (!user) {
            throw new NOT_FOUND_ERROR('User not found');
        }
        const activated = !user.activated;
        await models.UserModel.findByIdAndUpdate(
            user._id,
            { activated }
        );
        return { activated };
    }

    static switchGateActivation = async ({ gate_id }) => {
        const gate = await models.GateModel.findOne({ gate_id });
        if (!gate) {
            throw new NOT_FOUND_ERROR('Gate not found');
        }
        const activated = !gate.activated;
        await models.GateModel.findByIdAndUpdate(
            gate._id,
            { activated }
        );
        return { activated };
    }
}

module.exports = AdminService;