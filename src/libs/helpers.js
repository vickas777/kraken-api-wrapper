const crypto = require('crypto');
const qs = require('querystring');

/**
 * Method for generating sign signature
 * @param {string} path - Request path
 * @param {Object} body - Full request body
 * @param {string} secret - Secret key for signing
 * @returns {string} Sign signature
 */
const makeSignature = (path, body, secret) => {
  const strBody = qs.stringify(body);
  const secret64 = Buffer.from(secret, 'base64');
  const hash = crypto.createHash('sha256')
    .update(body.nonce + strBody)
    .digest('latin1');
  return crypto.createHmac('sha512', secret64)
    .update(path + hash, 'latin1')
    .digest('base64');
};

/**
 * Check if parameter is a function
 * @param {*} object - Test parameter
 * @returns {boolean}
 */
const isFunction = object => !!(object && object.constructor && object.call && object.apply);

module.exports = { makeSignature, isFunction };
