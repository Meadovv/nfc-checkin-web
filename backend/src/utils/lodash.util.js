const lodash = require('lodash');
const {
    BAD_REQUEST_ERROR
} = require('../core/response.core');

class LodashUtils {
    static verifyJSONFields = ({ fields, object }) => {
        const pickedObject = lodash.pick(object, fields);
        const extraFields = lodash.difference(lodash.keys(object), fields);
        const missingFields = lodash.difference(fields, lodash.keys(object));

        if (extraFields.length > 0 || missingFields.length > 0) {
            let errorMessage = '';
            if (missingFields.length > 0) {
                errorMessage += ` Missing fields: ${missingFields.join(', ')}.`;
            }
            if (extraFields.length > 0) {
                errorMessage += ` Extra fields: ${extraFields.join(', ')}.`;
            }
            throw new BAD_REQUEST_ERROR(errorMessage);
        }

        return pickedObject;
    }

    static getFields = ({ fields, object }) => {
        return lodash.pick(object, fields);
    }

    static getFieldsExcept = ({ fields, object }) => {
        return lodash.omit(object, fields);
    }
}

module.exports = LodashUtils;