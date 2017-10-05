const https = require('https');
const qs = require('querystring');

const defaults = {
  host: 'api.kraken.com',
  method: 'POST',
};

/**
 * Sending raw request to server
 * @param {Object} opts - Request options
 * @param {Object} opts.headers - Request headers
 * @param {string} opts.path - Request path
 * @param {number} opts.timeout - Request timeout
 * @param {Object} opts.body - Request body
 * @param {Function} callback
 */
module.exports = (opts, callback) => {
  const {
    headers, path, timeout, body,
  } = opts;
  const options = Object.assign({}, defaults, { headers, path, timeout });
  const req = https.request(options, (res) => {
    res.setEncoding('utf8');
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      callback(null, data);
    });
  });
  req.on('error', (error) => {
    callback(error);
  });
  req.end(qs.stringify(body), 'utf8');
};
