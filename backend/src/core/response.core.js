const {
    httpCode,
    httpReason,
} = require('../constants');
const moment = require('moment');

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class SuccessResponse {
    constructor({ message, status = httpCode.OK, reasonStatusCode = httpReason.OK, metadata = undefined}) {
        this.message = message || reasonStatusCode;
        this.status = status;
        this.metadata = metadata;
    }

    send(req, res, headers = {}) {
        res.set(headers);
        return res.status(this.status).json({
            ...this,
            ip: req.client_ip,
            time: moment().format('DD-MM-YYYY HH:mm:ss'),
        });
    }
}

// ERROR RESPONSE

class BAD_REQUEST_ERROR extends ErrorResponse {
    constructor(message = httpReason.BAD_REQUEST, status = httpCode.BAD_REQUEST) {
        super(message, status);
    }
}

class UNAUTHORIZED_ERROR extends ErrorResponse {
    constructor(message = httpReason.UNAUTHORIZED, status = httpCode.UNAUTHORIZED) {
        super(message, status);
    }
}

class UNAUTHENTICATED_ERROR extends ErrorResponse {
    constructor(message = httpReason.UNAUTHENTICATED, status = httpCode.UNAUTHENTICATED) {
        super(message, status);
    }
}

class NOT_FOUND_ERROR extends ErrorResponse {
    constructor(message = httpReason.NOT_FOUND, status = httpCode.NOT_FOUND) {
        super(message, status);
    }
}

class TOKEN_EXPIRED_ERROR extends ErrorResponse {
    constructor(message = httpReason.TOKEN_EXPIRED, status = httpCode.UNAUTHORIZED) {
        super(message, status);
    }
}

class FORBIDDEN_ERROR extends ErrorResponse {
    constructor(message = httpReason.FORBIDDEN, status = httpCode.FORBIDDEN) {
        super(message, status);
    }
}

class INTERNAL_SERVER_ERROR extends ErrorResponse {
    constructor(message = httpReason.INTERNAL_SERVER_ERROR, status = httpCode.INTERNAL_SERVER_ERROR) {
        super(message, status);
    }
}

// SUCCESS RESPONSE

class OK extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata });
    }
}

class CREATED extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, status: httpCode.CREATED, reasonStatusCode: httpReason.CREATED, metadata });
    }
}

class SUCCESS extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata });
    }
}

class WELCOME extends SuccessResponse {
    constructor({ message }) {
        super({ message });
    }
}

module.exports = {
    WELCOME,
    OK,
    CREATED,
    SUCCESS,
    BAD_REQUEST_ERROR,
    UNAUTHORIZED_ERROR,
    UNAUTHENTICATED_ERROR,
    NOT_FOUND_ERROR,
    TOKEN_EXPIRED_ERROR,
    FORBIDDEN_ERROR,
    INTERNAL_SERVER_ERROR,
};
