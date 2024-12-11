'use strict';

const productDB = require('./product.db');

function save(data) {
  return productDB.save(data);
}

function getAll() {
  return productDB.getAll();
}

function getById(id) {
  return productDB.getById(id);
}

function put(id, data) {
  return productDB.put(id, data);
}

function remove(id) {
  return productDB.remove(id);
}

module.exports = {
  save,
  getAll,
  getById,
  put,
  remove
};
