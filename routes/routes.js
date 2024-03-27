const express = require('express');
const router = express.Router();

const authToken = require('../middlewares/authToken');
const adminController = require('../controllers/admin')
const productController = require('../controllers/products');
const distributorController = require('../controllers/distributor');
const orderController = require('../controllers/orders');

router.post("/admin-register", adminController.adminRegister);
router.post("/admin-login",adminController.adminLogin );

router.post("/dist-register", distributorController.registerDistributor);
router.post("/dist-login", distributorController.loginDistributor );

router.post("/addProduct", productController.addProducts);
router.get("/getAllProducts",productController.getAllProducts);

router.get('/adminInventory', productController.adminInventory);
router.post("/updateStock/:productId", productController.updateStock);

router.get('/getDistributors', adminController.getDistributors);
router.post('/updateDistributorStatus/:distributorId', adminController.updateDistributorStatus);

router.get('/orders', authToken.authToken, productController.ordersView);
router.post('/placeOrder', authToken.authToken,orderController.placeOrders );

router.get('/getAllOrders', orderController.getAllOrders);
router.post('/updateOrders', orderController.updateOrders);

router.get('/history', authToken.authToken, orderController.history);
module.exports = router;