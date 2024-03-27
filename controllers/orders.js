const sequelize = require('../utils/database');
const {Sequelize, Datatypes} = require('sequelize');
const Products = require('../models/products');
const Distributor = require("../models/distributors");
const Orders = require('../models/orders');

exports.placeOrders = async (req, res, next) => {
    try {
        const { productId, requestedQuantity, id: distributorId } = req.body;

        const distributor = await Distributor.findByPk(distributorId);
        if (!distributor) {
            return res.status(404).json({ error: 'Distributor not found' });
        }

        const product = await Products.findByPk(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (requestedQuantity <= 0 || requestedQuantity > product.quantity) {
            return res.status(400).json({ error: 'Invalid requested quantity' });
        }

        const order = await Orders.create({
            productId: productId,
            distributorId: distributorId,
            requestedQuantity: requestedQuantity,
            status: 'pending'
        });

        return res.status(201).json(order);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getAllOrders = async (req, res, next) => {
    try {
        
        const orders = await Orders.findAll({
            where: {
                status: 'pending'
            },
            include: [
                {
                    model: Distributor,
                    attributes: ['firstName', 'lastName', 'location'] 
                },
                {
                    model: Products,
                    attributes: ['productName', 'quantity'] 
                }
            ]
        });

        const formattedOrders = orders.map(order => ({
            id: order.id,
            distributorFirstName: order.Distributor.firstName,
            distributorLastName: order.Distributor.lastName,
            distributorLocation: order.Distributor.location,
            productName: order.Product.productName,
            requestedQuantity: order.requestedQuantity,
            currentQuantity: order.Product.quantity
        }));

        return res.status(200).json(formattedOrders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

exports.updateOrders = async (req, res, next) => {
    try {
        const { id, status } = req.body;
        const order = await Orders.findByPk(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        await order.update({ status: status });
        if (status === 'accept') {
            const product = await Products.findByPk(order.productId);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            const newQuantity = product.quantity - order.requestedQuantity;
            await product.update({ quantity: newQuantity });
        }
        return res.status(200).json({message: "Order Updated"});
    } catch (error) {
        console.error('Error updating orders:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

exports.history = async (req, res, next) => {
    try {
        const {id}  = req.body;
        const distHistory = await Orders.findAll( {
            where: {distributorId : id},
            include: [
                {
                    model: Products,
                    attributes: ['productName']
                }
            ]
        } );

        const formattedHistory = distHistory.map(order => ({
            id: order.id,
            productName: order.Product.productName,
            requestedQuantity: order.requestedQuantity,
            status: order.status
        }));

        return res.status(200).json(formattedHistory);
    } catch (error) {
        console.error('Error fetching distributor history:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}