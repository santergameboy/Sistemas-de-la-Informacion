'use strict';

const saleDB = require('./sale.db');

function save(data) {
  return saleDB.save(data);
}

function getAll() {
  return saleDB.getAll();
}

function getById(id) {
  return saleDB.getById(id);
}

function put(id, data) {
  return saleDB.put(id, data);
}

function remove(id) {
  return saleDB.remove(id);
}

module.exports = {
  save,
  getAll,
  getById,
  put,
  remove
};
