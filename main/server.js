const express = require('express'); /** Express module */
const bodyParser = require('body-parser'); /** Body parser module */
const cors = require('cors'); /** Cors module */
const program = require('./functions'); /** Importing functions from "functions.js" */
var mysql = require('mysql'); /** MySQL module */

/** Creating connection */
var con = mysql.createConnection({
    
    host: "localhost",
    user: "root",
    password: "",
    database: "restock"
});

/** Initializing express object */
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/** Querying the DB for the product list */
app.get('/query-product', function(req, res) {

    let query = "SELECT * FROM product";

    con.query(query, function (err, result) {

        if (err) throw err;

        res.send(result);
    });
});

/** Querying the DB for a certain product and quanity, parameters are passed from "jQueryScript.js" */
app.get('/query/:productID/:nPcs', function(req, res) {

    let orderProductID = req.params.productID;
    let orderNumPcs = req.params.nPcs;

    let query = "SELECT sub.* " +
        "FROM( " +
        "SELECT supplier.supplierName, supplier.shipmentDays, product.productName, stock.price, discount.percentageDate, discount.startDate, discount.finishDate, discount.percentagePrice, discount.startPrice, discount.percentagePcs, discount.pcsStart, discount.productID, discount.active " +
        "FROM supplier " +
        "JOIN stock ON supplier.supplierID = stock.supplierID " +
        "JOIN product ON product.productID = stock.productID " +
        "LEFT JOIN discount ON (discount.supplierID = supplier.supplierID AND discount.productID = stock.productID) " +
        "WHERE stock.productID = " + mysql.escape(orderProductID) + " AND stock.pcs >= " + mysql.escape(orderNumPcs) +
        ")sub " +
        "WHERE (sub.active = 1 || sub.active IS NULL)";

    con.query(query, function (err, result) {

        if (err) throw err;

        /** Calculating the cheapest supplier */
        let output = program.bestOrder(result, orderNumPcs);

        res.send(output);
    });
});

/** Querying the DB for lat, lng and stock pcs */
app.get('/query-map/:productID', function (req, res) {

    let orderProductID = req.params.productID;

    let query = "SELECT supplier.latitude, supplier.longitude, stock.pcs " +
        "FROM supplier " +
        "JOIN stock ON supplier.supplierID = stock.supplierID " +
        "WHERE stock.productID = " + mysql.escape(orderProductID);

    con.query(query, function (err, result) {

        if (err) throw err;

        res.send(result);
    });
});

/** Default route */
app.get('/', function(req, res) {

});

/** Starting the server on port 3000 */
app.listen(3000, function() {

    console.log('Server running on port 3000');
});