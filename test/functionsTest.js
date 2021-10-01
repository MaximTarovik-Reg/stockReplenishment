var mysql = require('mysql'); /** MySQL module */
const { assert } = require('chai'); /** Assert library */
const testing = require('../main/functions'); /** Importing functions */

/** Creating connection */
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "restock"
});

describe('Testing!' , function() {
    
    describe('Stock Check', function () {
        
        /** Asserting that there are pcs in stock */
        it('Pcs are in stock', function() {

            let productID = 3;
            let nPcs = 10;

            let query = 'SELECT pcs FROM stock WHERE productID = ' + mysql.escape(productID);
            con.query(query, function (err, result) {

                if (err) throw err;
                
                let output = testing.checkStock(result, nPcs);

                assert.equal(output, nPcs);
                
            });        
        });

        /** Asserting that the function returns a number */
        it('Pcs in stock should be a number', function () {

            let productID = 3;
            let nPcs = 10;

            let query = 'SELECT pcs FROM stock WHERE productID = ' + mysql.escape(productID);
            con.query(query, function (err, result) {

                if (err) throw err;

                let output = testing.checkStock(result, nPcs);

                assert.isNumber(output);

            });
        });

        /** Asserting that there are suppliers with the selected item in stock */
        it('Suppliers with selected item in stock', function() {

            let productID = 4;
            let nPcs = 15;

            let query = 'SELECT supplier.supplierName FROM supplier JOIN stock ON supplier.supplierID = stock.supplierID WHERE stock.productID = ' + mysql.escape(productID) + ' AND stock.pcs >= ' + mysql.escape(nPcs);

            con.query(query, function (err, result) {

                if (err) throw err;

                let output = testing.supplierWithItem(result);

                assert.isTrue(output);

            });
        });

        /** Asserting that the prices for an item are numbers */
        it('Prices for selected item', function() {

            let productID = 4;

            let query = "SELECT supplier.supplierName, stock.price FROM supplier JOIN stock ON supplier.supplierID = stock.supplierID WHERE stock.productID = " + mysql.escape(productID);

            con.query(query, function (err, result) {

                if (err) throw err;

                let output = testing.supplierWithItemPrice(result);

                assert.isNumber(output);
            });
        });

        /** Asserting that shipmnet days are a number */
        it('Shipment days', function () {

            let productID = 4;

            let query = "SELECT supplier.supplierName, stock.price, supplier.shipmentDays FROM supplier JOIN stock ON supplier.supplierID = stock.supplierID WHERE stock.productID = " + mysql.escape(productID);

            con.query(query, function (err, result) {

                if (err) throw err;

                let output = testing.supplierWithItemShipment(result);

                assert.isNumber(output);
            });
        });

        /** Asserting that the total price is higher that the single price for the item */
        it('Total price for order', function () {

            let productID = 4;
            let nPcs = 15;

            let query = "SELECT supplier.supplierName, stock.price FROM supplier JOIN stock ON supplier.supplierID = stock.supplierID WHERE stock.productID = " + mysql.escape(productID);

            con.query(query, function (err, result) {

                if (err) throw err;

                let output = testing.orderPrice(result, nPcs);

                assert.isAbove(output, result[0].price);
            });
        });
    });

    describe('Discounts', function() {

        /** Asserting that there are discounts present */
        it('Should print discounts', function() {

            let productID = 4;

            let query = "SELECT supplier.supplierName, product.productName, discount.percentageDate, discount.startDate, discount.finishDate, discount.percentagePrice, discount.startPrice, discount.percentagePcs, discount.pcsStart, discount.active FROM supplier JOIN discount ON supplier.supplierID = discount.supplierID JOIN product ON product.productID = discount.productID WHERE product.productID = " + mysql.escape(productID) + " AND discount.active = 1";

            con.query(query, function (err, result) {

                if (err) throw err;

                let output = testing.supplierDiscountOnItem(result);

                assert.equal(output, 1);                
            });
        });

        /** Asserting that discountedPrice function works */
        it('Should return discounted price', function() {

            let supplierID = 1;
            let productID = 4;
            let nPcs = 15;
            let orderPrice = 1499;

            let query = "SELECT supplier.supplierName, product.productName, discount.percentageDate, discount.startDate, discount.finishDate, discount.percentagePrice, discount.startPrice, discount.percentagePcs, discount.pcsStart FROM supplier JOIN discount ON supplier.supplierID = discount.supplierID JOIN product ON product.productID = discount.productID WHERE product.productID = " + mysql.escape(productID) + " AND supplier.supplierID = " + mysql.escape(supplierID) + " AND discount.active = 1";

            con.query(query, function (err, result) {

                if (err) throw err;

                let output = testing.discountedPrice(result, nPcs, orderPrice);
                
                assert.equal(output, 1367.65762);
            });
        });

        /** Test from examples */
        it('Should return cheapest supplier', function() {

            let orderProductID = 1;
            let orderNumPcs = 12;

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

                let output = testing.bestOrder(result, orderNumPcs);

                assert.equal(output[0].discountedPrice, 1459.2);
            });
        });

        /** Asserting that bestOrder returns a number */
        it('Cheapest supplier should be a number', function () {

            let orderProductID = 1;
            let orderNumPcs = 12;

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

                let output = testing.bestOrder(result, orderNumPcs);

                assert.isNumber(output[0].discountedPrice);

                con.end();
            });
        });
    });
});