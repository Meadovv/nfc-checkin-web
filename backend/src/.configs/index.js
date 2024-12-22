'use strict'

const dev = {
    port: process.env.DEV_PORT || 8080,
    databases: {
        mongodb: {
            url: process.env.DEV_MONGODB_URI
        },
        mysql: {
            
        }
    },
    jwt: {
        expired: process.env.DEV_JWT_EXPIRED,
        nfc_secret: process.env.DEV_NFC_SECRET
    },
    cors: {
        whitelist_domain: [
            'http://localhost:5173', // For development
            'http://owl-eternal-nearly.ngrok-free.app', // For device
            'https://meadowpham.id.vn/', // For client
        ]
    }
};

const prod = {
    port: process.env.PROD_PORT || 8080,
    databases: {
        mongodb: {
            url: process.env.PROD_MONGODB_URI
        },
        mysql: {
            
        }
    },
    jwt: {
        expired: process.env.PROD_JWT_EXPIRED,
        nfc_secret: process.env.PROD_NFC_SECRET
    },
    cors: {
        whitelist_domain: [
            'http://owl-eternal-nearly.ngrok-free.app', // For device
            'https://meadowpham.id.vn/', // For client
        ]
    }
};

const config = { dev, prod };
const env = process.env.NODE_ENV || 'dev';
const export_config = {
    ...config[env],
    env,
};
module.exports = export_config;