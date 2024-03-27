const sequelize = require('../utils/database');
const {DataTypes} = require('sequelize');

const Distributor = sequelize.define('Distributor', {
    id: {
        type:DataTypes.UUID,
        allowNull:false,
        primaryKey: true,
        defaultValue:DataTypes.UUIDV4
    },
    firstName: {
        type:DataTypes.STRING,
        allowNull:false
    },
    lastName: {
        type:DataTypes.STRING,
        allowNull:false
    },
    email: {
        type: DataTypes.STRING,
        allowNull:false,
        validate: {
            isEmail:true
        },
        unique:true
    },
    password: {
        type: DataTypes.STRING,
        allowNull:false
    },
    location: {
        type:DataTypes.STRING,
        allowNull:false
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
    tableName:'distributor',
    modelName: "Distributor",
});

module.exports = Distributor;