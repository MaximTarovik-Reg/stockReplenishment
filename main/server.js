const express = require('express'); /** Express module */
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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/** Product list query */
app.get('/query-product', function(req, res) {

    let query = "SELECT * FROM product";

    con.query(query, function (err, result) {

        if (err) throw err;

        res.send(result);
    });
});

/** Supplier list query */
app.get('/query-supplier', function (req, res) {

    let query = "SELECT supplierID, supplierName FROM supplier";

    con.query(query, function (err, result) {

        if (err) throw err;

        res.send(result);
    });
});

/** Gender list query */
app.get('/query-gender', function (req, res) {

    let query = "SELECT DISTINCT client.gender FROM client";

    con.query(query, function (err, result) {

        if (err) throw err;

        res.send(result);
    });
});

/** Country list query */
app.get('/query-country', function (req, res) {

    let query = "SELECT DISTINCT client.countryfull FROM client";

    con.query(query, function (err, result) {

        if (err) throw err;

        res.send(result);
    });
});

/** Zodiac list query */
app.get('/query-zodiac', function (req, res) {

    let query = "SELECT DISTINCT client.tropicalzodiac FROM client";

    con.query(query, function (err, result) {

        if (err) throw err;

        res.send(result);
    });
});

/** Blood type list query */
app.get('/query-blood', function (req, res) {

    let query = "SELECT DISTINCT client.bloodtype FROM client";

    con.query(query, function (err, result) {

        if (err) throw err;

        res.send(result);
    });
});

// app.get('/query-client/:qnt', function (req, res) {

//     let qnt = req.params.qnt;

//     let query = "SELECT clientID FROM client WHERE clientID <= " + mysql.escape(qnt);

//     con.query(query, function (err, result) {

//         if (err) throw err;

//         res.send(result);
//     });
// });

/** Counting the number of clients for the random function */
app.get('/query-randClient', function (req, res) {

    let query = "SELECT COUNT(clientID) AS numClients FROM client";

    con.query(query, function (err, result) {

        if (err) throw err;

        res.send(result);
    });
});

/** Inserting order */
app.get('/query-insertOrder/:obj', function (req, res) {

    let obj = JSON.parse(req.params.obj);
    let output = {message: "Error"};

    let query = "INSERT INTO `order`(`date`, `price`, `pcs`, `clientID`, `supplierID`, `productID`) VALUES ('" + obj.date + "', " + obj.price + ", " + obj.pcs + ", " + obj.clientID + ", " + obj.supplierID + ", " + obj.productID + ")";

    con.query(query, function (err, result) {

        if (err) throw err;

        output.message = "Orders inserted correctly.";

        res.send(output);
    });

});

/** Selecting stocks in order to later select a random one */
app.get('/query-stock', function (req, res) {

    let query = "SELECT * FROM stock";

    con.query(query, function (err, result) {

        if (err) throw err;

        res.send(result);
    });
});

/** Ufiltered client heatMap */
app.get('/query-clientMap', function (req, res) {

    let query = "SELECT client.latitude, client.longitude, COUNT(order.orderID) AS orders " +
                "FROM client " +
                "JOIN `order` ON client.clientID = `order`.clientID " +
                "GROUP BY client.clientID";

    con.query(query, function (err, result) {

        if (err) throw err;

        res.send(result);
    });
});

/** Filtered client Map */
app.get('/query-clientMap-filter/:query', function (req, res) {

    let query = req.params.query;

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
        "SELECT supplier.supplierID, supplier.supplierName, supplier.shipmentDays, product.productName, stock.price, discount.percentageDate, discount.startDate, discount.finishDate, discount.percentagePrice, discount.startPrice, discount.percentagePcs, discount.pcsStart, discount.productID, discount.active " +
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