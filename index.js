const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const sequelize = require('./src/config/database');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const port = process.env.PORT || 3000;

require('./src/routes')(app);

sequelize.sync()
  .then(() => {
    app.listen(port , () => {
      console.log(`server listening on port ${port}`);
    });
  })
  .catch(err => console.error('Error with sync Data Base', err));
