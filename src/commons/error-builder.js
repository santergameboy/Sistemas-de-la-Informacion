'use strict';

let build = (errorName, error) => {
  let status = null;
  let body = null;
  switch (errorName) {
    case 'ajv':
      status = 400;
      body = {
        name: 'schema',
        message: error[0].message
      };
      break;
    case 'MySQL':
      status = 400;
      body = {
        name: `database - ${error.name}`,
        message: error.message
      };
      break;
    case 'configure':
      status = 400;
      body = {
        name: error.name,
        message: error.message
      };
      break;
    case 'configure-status':
      status = error.status;
      body = {
        name: error.name,
        message: error.message
      };
      break;
    case 'default':
      status = 400;
      body = error.message;
      break;
  }
  return {
    body,
    status
  };
};

module.exports = {
  build
};
