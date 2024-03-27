const sequelize = require('../utils/database');
const {DataTypes} = require('sequelize');

const Products = sequelize.define( 'Products', {
    id: {
        type:DataTypes.UUID,
        allowNull:false,
        primaryKey: true,
        defaultValue:DataTypes.UUIDV4
    },
    productName: {
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    productImgLink: {
        type:DataTypes.STRING,
        allowNull:false,
    },
    description: {
        type:DataTypes.STRING,
        allowNull:false
    },
    quantity: {
        type:DataTypes.INTEGER,
        defaultValue:0
    }
}, {
    sequelize,
    tableName:'products',
    modelName: "Products"
});

module.exports = Products;