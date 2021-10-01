module.exports = {

    /**
     * @param  {} result
     * @param  {} nPcs
     */
    checkStock: function(result, nPcs) {

        for(let i=0; i<result.length; i++) {

            if (result[i].pcs >= nPcs) {

                /** console.log("Item is in stock!"); */

                return nPcs;
            }
        }

        return false;
    },

    /**
     * @param  {} result
     */
    supplierWithItem: function (result) {

        if(result.length > 0) {

            /** console.log("The following suppliers have your item in stock:"); */

            for (let i = 0; i < result.length; i++) {

                /** console.log(result[i].supplierName); */
            }

            return true;
        }

        return false;
    },

    /**
     * @param  {} result
     */
    supplierWithItemPrice: function (result) {

        if (result.length > 0) {

            /** console.log("This is the pricing for your item:"); */

            for (let i = 0; i < result.length; i++) {

                /** console.log(result[i].supplierName + " " + result[i].price); */
            }

            return result[0].price;
        }

        return false;
    },

    /**
     * @param  {} result
     */
    supplierWithItemShipment: function (result) {

        if (result.length > 0) {

            /** console.log("Shipment days by supplier:"); */

            for (let i = 0; i < result.length; i++) {

                /** console.log(result[i].supplierName + " " + result[i].price + " | Shipment days: " + result[i].shipmentDays); */
            }

            return result[0].shipmentDays;
        }

        return false;
    },

    /**
     * @param  {} result
     */
    supplierDiscountOnItem: function (result) {

        if (result.length > 0) {

            /** console.log("Supplier's discount on item:"); */

            for (let i = 0; i < result.length; i++) {

                /** console.log(result[i].supplierName + " | " + result[i].productName + " | Date sale: " + result[i].percentageDate + "% Starts: " + result[i].startDate + " Finishes: " + result[i].finishDate + " | Price sale: " + result[i].percentagePrice + "% Starts: " + result[i].startPrice + " | Pcs sale: " + result[i].percentagePcs + "% Starts: " + result[i].pcsStart); */
            }

            return result[0].active;
        }

        return false;
    },

    /**
     * @param  {} result
     * @param  {} nPcs
     */
    orderPrice: function (result, nPcs) {

        if (result.length > 0) {

            /** console.log("This is the pricing for your order:"); */

            for (let i = 0; i < result.length; i++) {

                result[i].orderPrice = result[i].price * nPcs;

                /** console.log(result[i].supplierName + " | Order price: " + result[i].orderPrice); */
            }

            return result[0].orderPrice;
        }

        return false;
    },

    /**
     * @param  {} result
     * @param  {} nPcs
     * @param  {} orderPrice
     */
    discountedPrice: function (result, nPcs, orderPrice) {

        if (result.length > 0) {

            let percDate = result[0].percentageDate;
            let startDate = result[0].startDate;
            let finishDate = result[0].finishDate;
            let percPrice = result[0].percentagePrice;
            let startPrice = result[0].startPrice;
            let percPcs = result[0].percentagePcs;
            let startPcs = result[0].pcsStart;
            let newPrice = orderPrice;
            let date = new Date();
            
            if (percDate !== null) {

                if ((date.getTime() <= finishDate.getTime() && date.getTime() >= startDate.getTime())){

                    let discount = percDate / 100;                    

                    discount *= newPrice;

                    newPrice -= discount;

                    /** console.log("SCONTO DATA: " + newPrice); */
                }                                
            }

            if (percPrice !== null) {

                if (orderPrice >= startPrice) {

                    let discount = percPrice / 100;

                    discount *= newPrice;

                    newPrice -= discount;

                    /** console.log("SCONTO PREZZO: " + newPrice); */
                }
            }

            if(percPcs !== null) {

                if(nPcs >= startPcs){

                    let discount = percPcs / 100;

                    discount *= newPrice;

                    newPrice -= discount;

                    /** console.log("SCONTO PEZZI: " + newPrice); */
                }
            }

            /** console.log("Supplier: " + result[0].supplierName + " | Item: " + result[0].productName + " | Discounted price: € " + newPrice.toFixed(2)); */

            return newPrice;
        }
    },

    /**
     * @param  {} result
     * @param  {} orderNumPcs
     */
    bestOrder: function(result, orderNumPcs) {

        for (let i = 0; i < result.length; i++) {

            let orderPrice = result[i].price * orderNumPcs;

            result[i].orderPrice = orderPrice;


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

                        /** console.log("SCONTO DATA: " + newPrice); */
                    }
                }

                if (percPrice !== null) {

                    if (orderPrice >= startPrice) {

                        let discount = percPrice / 100;

                        discount *= newPrice;

                        newPrice -= discount;

                        /** console.log("SCONTO PREZZO: " + newPrice); */
                    }
                }

                if (percPcs !== null) {

                    if (orderNumPcs >= startPcs) {

                        let discount = percPcs / 100;

                        discount *= newPrice;

                        newPrice -= discount;

                        /** console.log("SCONTO PEZZI: " + newPrice); */
                    }
                }

                /** console.log("Supplier: " + result[i].supplierName + " | Item: " + result[i].productName + " | Discounted price: € " + newPrice.toFixed(2)); */

                var n = newPrice.toFixed(2);

                result[i].discountedPrice = parseFloat(n);
            } else {

                result[i].discountedPrice = orderPrice;
            }
        }
        /** for end */

        /** Sorting array by final price (Discounted) */
        result.sort((a, b) => (a.discountedPrice > b.discountedPrice) ? 1 : -1);

        /** Deleting unneeded attributes */
        for (let i = 0; i < result.length; i++) {

            delete result[i].productName;
            delete result[i].price;
            delete result[i].percentageDate;
            delete result[i].startDate;
            delete result[i].finishDate;
            delete result[i].startPrice;
            delete result[i].percentagePrice;
            delete result[i].percentagePcs;
            delete result[i].pcsStart;
            delete result[i].productID;
            delete result[i].active;
            delete result[i].orderPrice;           
        }

        /** Returning the final result object (Just the 3 wanted attributes) */
        return(result);
    }
};