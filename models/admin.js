const sequelize = require('../utils/database');
const {DataTypes} = require('sequelize');

const Admin = sequelize.define('Admin', {
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
    createdAt:{
        type:DataTypes.DATE
    },
    updatedAt:{
        type: DataTypes.DATE
    },
}, {
    sequelize,
    tableName:'admin',
    modelName: "Admin",
});

module.exports = Admin;