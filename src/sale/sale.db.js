'use strict';

const Sale = require('./sale.schema');
const errorBuilder = require('../commons/error-builder');

const MY_SQL = 'MySQL';

async function save(data) {
  try {
    return await Sale.create(data);
  } catch (error) {
    throw errorBuilder.build(MY_SQL, error);
  }
}

async function getAll() {
  try {
    return await Sale.findAll();
  } catch (error) {
    throw errorBuilder.build(MY_SQL, error);
  }
}

async function getById(id) {
  try {
    const res = await Sale.findByPk(id);
    if (res)
      return res;
    throw errorBuilder.build('configure-status', {name: 'database - findById', message: 'not found sale id', status: 404});
  } catch (error) {
    if (error.status === 404)
      throw error;
    throw errorBuilder.build(MY_SQL, error);
  }
}

// async function find(data) {
//   try {
//     return await User.find(data);
//   } catch (error) {
//     throw errorBuilder.build(MY_SQL, error);
//   }
// }

async function put(id, data) {
  try {
    const [updated] = await Sale.update(data, {
      where: { id }
    });
    if (updated) {
      return await Sale.findByPk(id);
    }
    const err = errorBuilder.build('configure-status', {name: 'database - update', message: 'not found sale id', status: 404});
    throw err;
  } catch (error) {
    if (error.status === 404)
      throw error;
    throw errorBuilder.build(MY_SQL, error);
  }
}

async function remove(id) {
  try {
    const deleted = await Sale.destroy({
      where: { id }
    });
    if (deleted) {
      return true;
    }
    throw errorBuilder.build('configure-status', {name: 'database - delete', message: 'not found sale id', status: 404});
  } catch (error) {
    if (error.status === 404)
      throw error;
    throw errorBuilder.build(MY_SQL, error);
  }
}
module.exports = {
  save,
  getAll,
  getById,
  // find,
  put,
  remove
};
