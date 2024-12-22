const {
    SUCCESS, BAD_REQUEST_ERROR
} = require('../core/response.core');
const utils = require('../utils');
const services = require('../services');
const config = require('../.configs');

class AdminController {

    static createSuperUser = async (req, res) => {
        if(config.env !== 'dev') {
            return new BAD_REQUEST_ERROR({
                message: 'This endpoint is only available in development environment'
            }).send(req, res)
        }
        return new SUCCESS({
            message: 'Super user created successfully',
            metadata: await services.AdminService.createSuperUser({
                ...utils.Lodash.verifyJSONFields({
                    fields: ['username', 'fullname', 'password'],
                    object: req.body
                })
            })
        }).send(req, res)
    }

    static createUser = async (req, res) => {
        return new SUCCESS({
            message: 'User created successfully',
            metadata: await services.AdminService.createUser({
                ...utils.Lodash.verifyJSONFields({
                    fields: ['username', 'nfc_id', 'fullname', 'password'],
                    object: req.body
                })
            })
        }).send(req, res)
    }

    static getUsers = async (req, res) => {
        const options = req.query;
        return new SUCCESS({
            message: 'Users retrieved successfully',
            metadata: await services.AdminService.getUsers({
                page: options?.page, // page number
                limit: options?.limit, // records per page
                search: options?.search // search query
            })
        }).send(req, res)
    }

    static updateForbiddenInformation = async (req, res) => {
        return new SUCCESS({
            message: 'User updated',
            metadata: await services.AdminService.updateForbiddenInformation({
                ...utils.Lodash.verifyJSONFields({
                    fields: ['_id', 'username', 'nfc_id', 'fullname_slug'],
                    object: req.body
                })
            })
        }).send(req, res);
    }

    static createGate = async (req, res) => {
        return new SUCCESS({
            message: 'Gate created successfully',
            metadata: await services.AdminService.createGate({
                ...utils.Lodash.verifyJSONFields({
                    fields: ['gate_id', 'gate_name', 'gate_secret'],
                    object: req.body
                })
            })
        }).send(req, res)
    }

    static getGates = async (req, res) => {
        const options = req.query;
        return new SUCCESS({
            message: 'Gates retrieved successfully',
            metadata: await services.AdminService.getGates({
                page: options?.page, // page number
                limit: options?.limit, // records per page
                search: options?.search // search query
            })
        }).send(req, res)
    }

    static updateGate = async (req, res) => {
        return new SUCCESS({
            message: 'Gate updated',
            metadata: await services.AdminService.updateGate({
                ...utils.Lodash.verifyJSONFields({
                    fields: ['_id', 'gate_id', 'gate_name', 'gate_secret'],
                    object: req.body
                })
            })
        }).send(req, res);
    }

    static switchUserActivation = async (req, res) => {
        return new SUCCESS({
            message: 'User updated',
            metadata: await services.AdminService.switchUserActivation({
                ...utils.Lodash.verifyJSONFields({
                    fields: ['username'],
                    object: req.body
                })
            })
        }).send(req, res);
    }

    static switchGateActivation = async (req, res) => {
        return new SUCCESS({
            message: 'Gate updated',
            metadata: await services.AdminService.switchGateActivation({
                ...utils.Lodash.verifyJSONFields({
                    fields: ['gate_id'],
                    object: req.body
                })
            })
        }).send(req, res);
    }
}

module.exports = AdminController;