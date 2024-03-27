const sequelize = require('../utils/database');
const {DataTypes} = require('sequelize');
const Distributor = require('./distributors');
const Product = require('./products');

const Orders = sequelize.define('Orders', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    requestedQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'accept', 'reject'),
        defaultValue: 'pending'
    },
    createdAt:{
        type:DataTypes.DATE
    },
    updatedAt:{
        type: DataTypes.DATE
    },
}, {
    sequelize,
    tableName: 'orders',
    modelName: "Orders"
});

Orders.belongsTo(Distributor, { foreignKey: 'distributorId' });
Orders.belongsTo(Product, { foreignKey: 'productId' });

module.exports = Orders;