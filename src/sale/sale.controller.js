'use strict';

const model = require('./sale.model');

async function save(req, res) {
  try {
    const sale = await model.save(req.body);
    return res.status(200).json(sale);
  } catch (error) {
    return res.status(error.status).json(error.body);
  }
}

async function get(req, res) {
  try {
    const sale = await model.getAll();
    return res.status(200).json(sale);
  } catch (error) {
    return res.status(error.status).json(error.body);
  }
}

async function getById(req, res) {
  try {
    let sale = await model.getById(req.params.id);
    return res.status(200).json(sale);

  } catch (error) {
    return res.status(error.status).json(error.body);
  }
}

async function put(req, res) {
  try {
    const sale = await model.put(req.params.id, req.body);
    return res.status(200).json(sale);
  } catch (error) {
    console.log('error', error);
    return res.status(error.status).json(error.body);
  }
}

async function remove(req, res) {
  try {
    const sale = await model.remove(req.params.id);
    return res.status(200).json(sale);
  } catch (error) {
    return res.status(error.status).json(error.body);
  }
}

module.exports = {
  save,
  get,
  getById,
  put,
  remove
};
