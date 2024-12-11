'use strict';

const clientDB = require('./client.db');

function save(data) {
  return clientDB.save(data);
}

function getAll() {
  return clientDB.getAll();
}

function getById(id) {
  return clientDB.getById(id);
}

function put(id, data) {
  return clientDB.put(id, data);
}

function remove(id) {
  return clientDB.remove(id);
}

module.exports = {
  save,
  getAll,
  getById,
  put,
  remove
};
