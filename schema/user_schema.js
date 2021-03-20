const joi = require('@hapi/joi')

const username = joi.string().max(11).required();
const password = joi.string().pattern(/^[\S]{6,16}$/).required();

module.exports.register_schema = {
    body: {
        username,
        password
    }
}

module.exports.login_schema = {
    body: {
        username,
        password
    }
}