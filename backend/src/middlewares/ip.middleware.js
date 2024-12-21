const utils = require('../utils');

class IPMiddleware {
    static validateIP = (req, _res, next) => {
        const ip = utils.Auth.IP(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
        req.client_ip = ip;
        next();
    }
}

module.exports = IPMiddleware;