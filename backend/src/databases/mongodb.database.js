'use strict'
const mongoose = require('mongoose');

class Databases {

    constructor() {

    }

    connect(url) {
        mongoose.connect(url, {
            maxPoolSize: 100, // Maximum number of connection in the pool
        })
        .then( database => {
            console.log(`[app - database] database ${database.connection.name} connected`);
        })
        .catch( error => {
            console.log('Error connecting to database', error);
        });
    }

    static getInstance() {
        if(!this.instance) {
            this.instance = new Databases();
        }
        return this.instance;
    }
}

const instanceMongodb = Databases.getInstance();
module.exports = instanceMongodb;
