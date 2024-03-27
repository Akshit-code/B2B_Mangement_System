const sequelize = require('../utils/database');
const {Sequelize, Datatypes} = require('sequelize');
const queryInterface = sequelize.getQueryInterface();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const dotenv = require('dotenv');
const config = dotenv.config();

const secretKey = process.env.SECRET_KEY;
const Admin = require('../models/admin');
const Distributor = require('../models/distributors');
const Orders = require('../models/orders');
const Products = require('../models/products');

exports.adminRegister = async (req, res, next) => {
    let transaction = await sequelize.transaction();
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.adminPassword, salt);

        req.body.admminPassword = hashPassword;
        const isExistingAdmin = await Admin.findOne( {where: {email: req.body.adminEmail}}, {transaction} );
        if(!isExistingAdmin) {
            const admin = await Admin.create( {
                firstName: req.body.adminFirstName,
                lastName: req.body.adminLastName,
                email: req.body.adminEmail,
                password: req.body.admminPassword
            }, {transaction} );
            console.log("New Admin Added");
            transaction.commit();
            return res.status(201).json({message: "Admin Added"});
        } else {
            await transaction.rollback();
            console.log("Admin Already Exits");
            return res.status(200).json({message: "Admin Exits !!!"});
        }
    } catch (error) {
        console.error(error);
        transaction.rollback();
        res.status(500).json('Internal Server Error');
    }
}

exports.adminLogin = async (req, res, next) => {
    let transaction = await sequelize.transaction();
    try {
        const isExistingAdmin = await Admin.findOne( {where: {email: req.body.adminLoginEmail}}, {transaction} );
        if(!isExistingAdmin) {
            console.log("No user found");
            return res.status(404).json({ message: "User not found" });
        } else {
            const validPassword = await bcrypt.compare(req.body.adminLoginPassword, isExistingAdmin.password );
            if(!validPassword) {
                console.log("Incorrect Password");
                return res.status(401).json({message: 'Incorrect Password'});
            };
            const tempId = isExistingAdmin.id;
            const token = jwt.sign({email: isExistingAdmin.email},secretKey );
            console.log("Token", token);
            await transaction.commit();
            console.log("Admin Logged In");
            const responsePayload = {
                adminID: isExistingAdmin.id,
                adminFirstName: isExistingAdmin.firstName,
                adminLastName: isExistingAdmin.lastName,
                adminEmail: isExistingAdmin.email,
                adminToken: token
            }
            return res.status(200).json(responsePayload);
        }
    } catch (error) {
        console.error(error);
        transaction.rollback();
        res.status(500).json('Internal Server Error');
    }
}

exports.getDistributors = async (req, res, next) => {
    try {
        const distList = await Distributor.findAll( {where: {status: "pending"}} );
        console.log(distList);
        return res.status(200).json(distList);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
}

exports.updateDistributorStatus = async (req, res, next) => {
    const { distributorId } = req.params;
    const { action } = req.body;

    try {
        const distributor = await Distributor.findByPk(distributorId);
        
        if (!distributor) {
            return res.status(404).json({ message: 'Distributor not found' });
        }

        if (action === 'accept') {
            distributor.status = 'accept';
        } else if (action === 'reject') {
            distributor.status = 'reject';
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }
        await distributor.save();

        return res.status(200).json({ message: 'Distributor status updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

