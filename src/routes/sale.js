'use strict';

const express = require('express');
const saleController = require('../sale/sale.controller');

const router = express.Router();

router
  .get('/', saleController.get)
  .get('/:id', saleController.getById)
  .post('/', saleController.save)
  .delete('/:id', saleController.remove)
  .put('/:id', saleController.put);

module.exports = router;
