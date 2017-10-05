const request = require('./libs/request');
const { makeSignature, isFunction } = require('./libs/helpers');
const { privateMethods, publicMethods } = require('./libs/methods');

/**
 * Prepare body, headers and make request
 * @param {Object} options - Options for making request
 * @param {Object} options.body - Options, taken from user(nonce, pairs, etc.)
 * @param {string} options.publicKey - Public API key
 * @param {string} options.secretKey - Private key for signing
 * @param {string} options.path - Request path
 * @param {string} options.otp - Two factor password(if provided)
 * @param {number} options.timeout - Request timeout
 * @param {Function} callback
 */
const makeRequest = (options, callback) => {
  const {
    body, publicKey, secretKey, path, otp, timeout,
  } = options;
  const headers = {};
  headers['User-Agent'] = 'Node Client';

  if (!{}.hasOwnProperty.call(body, 'nonce')) {
    body.nonce = new Date().getTime() * 100;
  } else {
    const nonce = +body.nonce;
    if (Number.isNaN(nonce) || !Number.isFinite(nonce)) {
      callback(new Error('Nonce value must be a number!'));
      return;
    }

    body.nonce = nonce;
  }


  if (otp) {
    body.otp = otp;
  }

  const isPrivateMethod = path.split('/')[2] === 'private';
  if (isPrivateMethod) {
    if (!publicKey) {
      callback(new Error('To use private methods you need provide public key!'));
      return;
    }

    if (!secretKey) {
      callback(new Error('To use private methods you need provide private key!'));
      return;
    }

    headers['API-Key'] = publicKey;
    headers['API-Sign'] = makeSignature(path, body, secretKey);
  }

  request({
    headers, path, timeout, body,
  }, (err, res) => {
    if (err) {
      callback(err);
      return;
    }

    let response;
    try {
      response = JSON.parse(res);
    } catch (e) {
      callback(e);
      return;
    }

    const { error, result } = response;

    if (error && error.length) {
      const message = error
        .map(item => item.substr(1))
        .join('\n');
      callback(new Error(`API response error! \n${message}`));
      return;
    }

    callback(null, result);
  });
};


/**
 * Creation of API wrapper
 * @param {string} [publicKey] - Public API key
 * @param {string} [secretKey] - Key for signing private requests
 * @returns {Object} - Api methods
 */
module.exports = (publicKey = '', secretKey = '') => {
  let otp = '';
  let timeout = 10000;
  let version = 0;
  const allApiMethods = [].concat(publicMethods, privateMethods);
  const apis = allApiMethods.reduce((prev, item) => {
    prev[item] = (body = {}, callback) => new Promise((resolve, reject) => {
      if (isFunction(body)) {
        callback = body;
        body = {};
      }
      const type = privateMethods.indexOf(item) !== -1 ? 'private' : 'public';
      const path = `/${version}/${type}/${item}`;
      const options = Object.assign({}, {
        path, body, publicKey, secretKey, timeout, otp,
      });

      makeRequest(options, (err, res) => {
        if (err) {
          callback && callback(err);
          return reject(err);
        }

        callback && callback(null, res);
        return resolve(res);
      });
    });
    return prev;
  }, {});

  apis.setPublicKey = (newKey) => {
    publicKey = newKey;
  };
  apis.setSecreteKey = (newKey) => {
    secretKey = newKey;
  };
  apis.setOtp = (newOtp) => {
    otp = newOtp;
  };
  apis.setRequestTime = (newTime) => {
    timeout = newTime;
  };
  apis.setApiVersion = (newVer) => {
    version = newVer;
  };

  return apis;
};
