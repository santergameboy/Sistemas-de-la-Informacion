'use strict';

const express = require('express');
const userController = require('../user/user.controller');
const middleware = require('../user/user.middleware');
const middlewareEncrypt = require('../commons/middleware');

const router = express.Router();

router
  .get('/', userController.get)
  .get('/:id', userController.getById)
  .post('/', 
    middleware.upload.single('photo'),
    middlewareEncrypt.encrypt,
    userController.save
  )
  .delete('/:id', userController.remove)
  .put('/:id', userController.put);

module.exports = router;
