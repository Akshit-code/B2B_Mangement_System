const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const config = dotenv.config();
const helmet = require("helmet");
const uuid = require('uuid');

app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded( {extended:false} ));
app.use(express.json());
app.use(express.static(path.join( __dirname, "public" )));

const router = require("./routes/routes");
const sequelize = require('./utils/database');
const Admin = require("./models/admin");
const Distributor = require("./models/distributors");
const Products = require("./models/products");
const Orders = require('./models/orders');

app.use("/admin", router);
app.use("/dist", router);

app.use("/adminPanel", router);
app.use("/adminPanel",  (_req, res, _next) => {
    res.sendFile(path.join(__dirname, 'views', 'admin.html' ));
});

app.use("/distPanel", router);
app.use("/distPanel", (req, res, next) => {
    res.sendFile(path.join(__dirname, 'views', 'distributor.html'));
})
app.use("/homepage", (_req, res, _next) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.use("/", (_req, res, _next) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

sequelize.sync()
    .then( res => {
        const port = process.env.PORT || 3000;
        app.listen(port, ()=> console.log(`Server is running on Port : ${port}`));
    })
    .catch(err => console.log(err));