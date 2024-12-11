'use strict';

const express = require('express');
const loginController = require('../login/login.controller');

const router = express.Router();

router
  .post('/', 
    loginController.validate
  )

module.exports = router;
