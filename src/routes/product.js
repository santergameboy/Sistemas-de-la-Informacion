'use strict';

const express = require('express');
const productController = require('../product/product.controller');
const middleware = require('../product/product.middleware');

const router = express.Router();

router
  .get('/', productController.get)
  .get('/:id', productController.getById)
  .post('/', 
    middleware.upload.single('image'),
    productController.save
  )
  .delete('/:id', productController.remove)
  .put('/:id', productController.put);

module.exports = router;
