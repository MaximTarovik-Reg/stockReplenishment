const prompt = require('prompt'); /** Prompt for terminal input */
const colors = require('colors'); /** Colors for terminal output */
var mysql = require('mysql'); /** MySQL module */

/** Creating connection */
var con = mysql.createConnection({
    
    host: "localhost",
    user: "root",
    password: "",
    database: "restock"
});

/** Run program */
printProducts();
input();

/**
 * Main function that calculates the cheapest order
 * @param  {} orderProductID
 * @param  {} orderNumPcs
 */
function bestOrder(orderProductID, orderNumPcs) {    

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

        /** Exiting the program if result returns no data */
        if(result.length == 0){

            console.log("Product inexistent or not in stock.");

            process.exit();
        }

        /** Calculating dicounts */
        for (let i = 0; i < result.length; i++) {

            let orderPrice = result[i].price * orderNumPcs;

            result[i].orderPrice = orderPrice;

            /** Discount is only calculated on rows where active = 1 */
            if (result[i].active !== null) {

                let percDate = result[i].percentageDate;
                let startDate = result[i].startDate;
                let finishDate = result[i].finishDate;
                let percPrice = result[i].percentagePrice;
                let startPrice = result[i].startPrice;
                let percPcs = result[i].percentagePcs;
                let startPcs = result[i].pcsStart;
                let newPrice = orderPrice;
                let date = new Date();

                if (percDate !== null) {

                    if ((date.getTime() <= finishDate.getTime() && date.getTime() >= startDate.getTime())) {

                        let discount = percDate / 100;

                        discount *= newPrice;

                        newPrice -= discount;
                    }
                }

                if (percPrice !== null) {

                    if (orderPrice >= startPrice) {

                        let discount = percPrice / 100;

                        discount *= newPrice;

                        newPrice -= discount;
                    }
                }

                if (percPcs !== null) {

                    if (orderNumPcs >= startPcs) {

                        let discount = percPcs / 100;

                        discount *= newPrice;

                        newPrice -= discount;
                    }
                }

                let n = parseFloat(newPrice);

                result[i].discountedPrice = n.toFixed(2);
            } else {

                result[i].discountedPrice = orderPrice;
            }
        }
        /** for end */

        /** Sorting array by final price (Discounted) */
        result.sort((a, b) => (a.discountedPrice > b.discountedPrice) ? 1 : -1);

        for (let i = 0; i < result.length; i++) {

            /** First line has yellow background */
            if (i == 0) {

                let output = "The cheapest supplier is: " + result[i].supplierName + " | Shipment days: " + result[i].shipmentDays + " | Order Price: € " + parseFloat(result[i].discountedPrice).toFixed(2);

                console.log(colors.bgYellow.black(output));

                if(result.length > 1){

                    console.log("Other suppliers: ");
                }
            }else {

                let output = "Supplier: " + result[i].supplierName + " | Shipment days: " + result[i].shipmentDays + " | Order Price: € " + parseFloat(result[i].discountedPrice).toFixed(2);

                console.log(output);
            }            
        }

        process.exit();
    });
};

/** This function prints the product list */
function printProducts() {

    let query = "SELECT * FROM product";

    con.query(query, function (err, result) {

        if (err) throw err;

        console.log("Product List:");

        for (let i = 0; i < result.length; i++) {

            console.log("Product id: " + result[i].productID + " | Product Name: " + result[i].productName);
        }
    });
};

/** Function for prompt error */
function onErr(err) {
    console.log(err);
    return 1;
};

/** Prompt input function */
function input () {    

    prompt.start();

    prompt.get(['orderProductID', 'orderNumPcs'], function (err, result) {
        if (err) { return onErr(err); }

        console.log('Command-line input received:');
        console.log('Product ID: ' + result.orderProductID);
        console.log('N° Pcs: ' + result.orderNumPcs);

        let orderProductID = result.orderProductID;
        let orderNumPcs = result.orderNumPcs;

        bestOrder(orderProductID, orderNumPcs);
    });
};