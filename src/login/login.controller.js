'use strict';

const bcrypt = require('bcrypt');
const model = require('../user/user.model');

async function validate(req, res) {
  try {
    const { username, password } = req.body;
    const user = await model.getByUsername( {username} );
    const isPasswordValid = await bcrypt.compare(password, user.password);
    return res.status(200).json(isPasswordValid);
  } catch (error) {
    return res.status(error.status).json(error.body);
  }
}

module.exports = {
  validate
};
