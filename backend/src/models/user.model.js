const {
    model, Schema
} = require('mongoose');
const constants = require('../constants');
const collection_name = 'users';

const schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 12
    },
    nfc_id: {
        type: String,
        required: false,
        unique: true,
        minlength: 8
    },
    fullname: {
        type: String,
        required: true
    },
    fullname_slug: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: constants.role.roles,
        default: constants.role.ROLE.NONE
    },
    activated: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false,
});

// Function to remove diacritics
function removeDiacritics(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Middleware to convert fullname to uppercase and create fullname_slug
schema.pre('validate', function(next) {
    if (this.fullname) {
        this.fullname = this.fullname.toUpperCase();
        const noDiacriticsFullname = removeDiacritics(this.fullname);
        const nameParts = noDiacriticsFullname.split(' ');
        const lastName = nameParts.pop();
        const initials = nameParts.map(name => name[0]).join('');
        this.fullname_slug = `${lastName}.${initials}`;
    }
    next();
});

module.exports = model(collection_name, schema);