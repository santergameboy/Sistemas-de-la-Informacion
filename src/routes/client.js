'use strict';

const express = require('express');
const clientController = require('../clientUser/client.controller');

const router = express.Router();

router
  .get('/', clientController.get)
  .get('/:id', clientController.getById)
  .post('/', clientController.save)
  .delete('/:id', clientController.remove)
  .put('/:id', clientController.put);

module.exports = router;
