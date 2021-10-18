/** Setting parameters for the random date */
const startDate = new Date(2019, 0, 1);
const endDate = new Date();

let output;

$('#output').hide();

$(document).ready(function () {

    $("#submit").click(function () {

        let qnt = $("#quantity").val(); /** Fetching quantity from form */

        fetch('http://localhost:3000/query-randClient') /** Fetching client number */
        .then(response => response.json())
        .then(client => {

            for (let i=0; i<qnt; i++) {
        
                fetch('http://localhost:3000/query-stock') /** Fetching stocks */
                .then(response => response.json())
                .then(stock => {
        
                    /** Selecting random stock */
                    let stockLength = stock.length;
                    let randStock = Math.floor(Math.random() * stockLength);
        
                    /** Getting stock data */
                    let supplierID = stock[randStock].supplierID;
                    let productID = stock[randStock].productID;
                    let pcs = stock[randStock].pcs;
        
                    /** Selecting random pcs */
                    let randPcs = Math.floor(Math.random() * (pcs)) + 1;
        
                    /** Calculating order price */
                    fetch('http://localhost:3000/query/' + productID + '/' + randPcs) /** Fetching orderPrice */
                    .then(response => response.json())
                    .then(orderPrice => {
                        
                        let index = orderPrice.findIndex(element => element.supplierID === supplierID);
        
                        let price = orderPrice[index].discountedPrice;
                        let clientID = Math.floor(Math.random() * client[0].numClients) + 1;
                        let randDate = randomDate(startDate, endDate);
                        let month = randDate.getUTCMonth() + 1; /** months from 1-12 */
                        let day = randDate.getUTCDate();
                        let year = randDate.getUTCFullYear();
                        let date = year + "-" + month + "-" + day;
        
        
                        let obj = {
        
                            date: date,
                            price: price.toFixed(2),
                            pcs: randPcs,
                            clientID: clientID,
                            supplierID: supplierID,
                            productID: productID
                        };
        
                        /** Inserting order into DB */
                        fetch('http://localhost:3000/query-insertOrder/' + JSON.stringify(obj))
                        .then(response => response.json())
                        .then(order => {

                            output = order.message;

                            /** Showing output */
                            $('#output').show();

                            $('#output').text(output);
                        });
                    });
                });
            };
        });
    });
});

/**
 * @param  {} start
 * @param  {} end
 */
function randomDate(start, end) {

    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

/** Quantity filter function */
(function ($) {
    $.fn.inputFilter = function (inputFilter) {
        return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    };
}(jQuery));

$("#quantity").inputFilter(function (value) {
    return /^\d*$/.test(value) && (value === "" || parseInt(value) >= 0);
});