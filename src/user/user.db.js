'use strict';

const User = require('./user.schema');
const errorBuilder = require('../commons/error-builder');

const MY_SQL = 'MySQL';

async function save(data) {
  try {
    return await User.create(data);
  } catch (error) {
    throw errorBuilder.build(MY_SQL, error);
  }
}

async function getAll() {
  try {
    return await User.findAll();
  } catch (error) {
    throw errorBuilder.build(MY_SQL, error);
  }
}

async function getById(id) {
  try {
    const res = await User.findByPk(id);
    if (res)
      return res;
    throw errorBuilder.build('configure-status', {name: 'database - findById', message: 'not found user id', status: 404});
  } catch (error) {
    if (error.status === 404)
      throw error;
    throw errorBuilder.build(MY_SQL, error);
  }
}

async function find(data) {
  try {
    const user = await User.findOne({ where: data });
    if (user) {
      return user
    }
    const err = errorBuilder.build('configure-status', {name: 'database - find', message: 'not found user', status: 404});
    throw err;
  } catch (error) {
    throw errorBuilder.build(MY_SQL, error);
  }
}

async function put(id, data) {
  try {
    const [updated] = await User.update(data, {
      where: { id }
    });
    if (updated) {
      return await User.findByPk(id);
    }
    const err = errorBuilder.build('configure-status', {name: 'database - update', message: 'not found user id', status: 404});
    throw err;
  } catch (error) {
    if (error.status === 404)
      throw error;
    throw errorBuilder.build(MY_SQL, error);
  }
}

async function remove(id) {
  try {
    const deleted = await User.destroy({
      where: { id }
    });
    if (deleted) {
      return true;
    }
    throw errorBuilder.build('configure-status', {name: 'database - delete', message: 'not found user id', status: 404});
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
  find,
  put,
  remove
};
