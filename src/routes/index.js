'use strict';

const product = require('./product');
const user = require('./user');
const login = require('./login');
const client = require('./client');
const sale = require('./sale');

function routes(app) {
    app.use('/api/product', product);
    app.use('/api/user', user);
    app.use('/api/login', login);
    app.use('/api/sale', sale);
    app.use('/api/client', client);
  }
  
  module.exports = routes;