const sequelize = require('../utils/database');
const {Sequelize, Datatypes} = require('sequelize');
const queryInterface = sequelize.getQueryInterface();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const dotenv = require('dotenv');
const config = dotenv.config();

const secretKey = process.env.SECRET_KEY;
const Distributor = require('../models/distributors');

exports.registerDistributor = async (req, res, next) => {
    try {
        const { distFirstName, distLastName, distLocation, distEmail, distPassword } = req.body;
        const existingDistributor = await Distributor.findOne({ where: { email: distEmail } });

        if (existingDistributor) {
            if (existingDistributor.status === 'reject') {
                return res.status(403).json({ message: 'You are not allowed to register.' });
            } else {
                return res.status(400).json({ message: 'Distributor already exists.' });
            }
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(req.body.distPassword, salt);
            req.body.distPassword = hashPassword;
            const newDistributor = await Distributor.create({
                firstName: distFirstName,
                lastName: distLastName,
                email: distEmail,
                password: hashPassword,
                location: distLocation,
                status: 'pending'
            });
            return res.status(201).json({ message: 'Distributor registered successfully.', distributor: newDistributor });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.loginDistributor = async (req, res, next) => {
    let transaction = await sequelize.transaction();
    try {
        const {distEmailLogin} = req.body;
        const {distLoginPassword} = req.body;

        const isExistingDist = await Distributor.findOne( {where: {email: distEmailLogin}}, transaction );
        if(!isExistingDist) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Distributor not found.' });
        } else {
            const validPassword = await bcrypt.compare(distLoginPassword, isExistingDist.password );
            if(!validPassword) {
                console.log("Incorrect Password");
                await transaction.rollback();
                return res.status(401).json({message: 'Incorrect Password'});
            };
            if(isExistingDist.status === 'accept') {
                const tempId = isExistingDist.id;
                const token = jwt.sign({id:isExistingDist.id}, secretKey);
                const responsePayload = {
                    id: isExistingDist.id,
                    distFirstName: isExistingDist.firstName,
                    distLastName:isExistingDist.lastName,
                    distEmail:isExistingDist.email,
                    distLocation:isExistingDist.location,
                    token: token
                }
                
                await transaction.commit();
                return res.status(200).json(responsePayload);
            } else {
                await transaction.rollback();
                return res.status(403).json({ message: 'Login not allowed. Distributor status is not accepted.' });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

