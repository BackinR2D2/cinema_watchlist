const crypto = require('crypto');

module.exports = function () {
    return crypto.randomBytes(3).toString('hex');
}