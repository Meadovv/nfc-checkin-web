const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const cookie_parser = require('cookie-parser');
const config = require('./.configs');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(cookie_parser());
app.use(cors({
    origin: function (origin, callback) {
        if (config.cors.whitelist_domain.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            console.log(origin);
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
app.use('/', require('./routers'));
module.exports = app;