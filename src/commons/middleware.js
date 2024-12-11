'use strict';

const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = '../config/global';

const METHOD = ['PUT', 'POST'];
const PASSWORD = 'password';
const IGNORE = [PASSWORD, 'username', 'email', 'externalId'];

function findValue(array, string) {
  return array.find(value => value === string);
}

function encrypt(res, request, next) {
  if (findValue(METHOD, request.req.method)) {
    for (const prop in request.req.body) {
      if (prop === PASSWORD) {
        const salt = bcrypt.genSaltSync(SALT_ROUNDS);
        const hash = bcrypt.hashSync(request.req.body[prop], salt);
        request.req.body[prop] = hash;
      }
    }
  }
  next();
}

module.exports = {
  encrypt
};
