const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('../user/user.schema');
const Product = require('../product/product.schema');
const Client = require('../clientUser/client.schema');

const Sale = sequelize.define('Sale', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  }
});

Sale.belongsTo(User, { foreignKey: 'userId' });
Sale.belongsTo(Product, { foreignKey: 'productId' });
Sale.belongsTo(Client, { foreignKey: 'clientId' });

module.exports = Sale;