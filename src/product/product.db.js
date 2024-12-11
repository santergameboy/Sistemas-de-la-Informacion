'use strict';

const Product = require('./product.schema');
const errorBuilder = require('../commons/error-builder');

const MY_SQL = 'MySQL';

async function save(data) {
  try {
    return await Product.create(data);
  } catch (error) {
    throw errorBuilder.build(MY_SQL, error);
  }
}

async function getAll() {
  try {
    return await Product.findAll();
  } catch (error) {
    throw errorBuilder.build(MY_SQL, error);
  }
}

async function getById(id) {
  try {
    const res = await Product.findByPk(id);
    if (res)
      return res;
    throw errorBuilder.build('configure-status', {name: 'database - findById', message: 'not found product id', status: 404});
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
    const [updated] = await Product.update(data, {
      where: { id }
    });
    if (updated) {
      return await Product.findByPk(id);
    }
    const err = errorBuilder.build('configure-status', {name: 'database - update', message: 'not found product id', status: 404});
    throw err;
  } catch (error) {
    if (error.status === 404)
      throw error;
    throw errorBuilder.build(MY_SQL, error);
  }
}

async function remove(id) {
  try {
    const deleted = await Product.destroy({
      where: { id }
    });
    if (deleted) {
      return true;
    }
    throw errorBuilder.build('configure-status', {name: 'database - delete', message: 'not found product id', status: 404});
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
