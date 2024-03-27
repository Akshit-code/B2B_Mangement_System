const sequelize = require('../utils/database');
const {Sequelize, Datatypes} = require('sequelize');
const Products = require('../models/products');
const Admin = require("../models/admin");

exports.addProducts = async (req, res, next) => {
    let transaction = await sequelize.transaction();
    try {
        const product = await Products.create( {
            productName: req.body.productName,
            productImgLink: req.body.productImgLink,
            description: req.body.productDesc
        }, transaction );
        const responseData = {
            productID: product.id,
            productName: product.productName,
            productImgLink: product.productImgLink,
            productDesc: product.description
        }
        await transaction.commit();
        return res.status(201).json(responseData);
    } catch (error) {
        console.error(error);
        await transaction.rollback();
        res.status(500).send('Server Error');
    }
}

exports.getAllProducts = async (req, res, next) => {

    try {
        const allProducts = await Products.findAll();
        return res.status(200).json(allProducts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

exports.adminInventory = async (req, res, next) => {
    let transaction = await sequelize.transaction();
    try {
        const inventory = await Products.findAll();
        return res.status(200).json(inventory);
    } catch (error) {
        console.error(error);
        await transaction.rollback();
        res.status(500).send('Server Error');
    }
}

exports.ordersView = async(req, res, next) => {
    try {
        const inventory = await Products.findAll();
        return res.status(200).json(inventory);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

exports.updateStock = async (req, res, next) => {
    const { productId } = req.params;
    const { action, quantity } = req.body;

    try {
        const product = await Products.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (action === 'increase') {
            await product.increment('quantity', { by: quantity });
            console.log("Stock increased successfully");
            return res.status(200).json({ message: 'Stock increased successfully' });
        } else if (action === 'decrease') {
            await product.decrement('quantity', { by: quantity });
            console.log("Stock decreased successfully");
            return res.status(200).json({ message: 'Stock decreased successfully' });
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }
    } catch (error) {
        console.error("Error updating stock:", error);
        return res.status(500).send('Server Error');
    }
};

