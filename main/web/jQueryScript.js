/** The table stays hidden by default */
$("#table").hide();

/** This function prints all of the products in the dropdown menu */
$(document).ready(function () {

    fetch('http://localhost:3000/query-product') /** Fetching query results from express */
    .then(response => response.json())
    .then(result => {

        /** Printing the dropdown menu */
        var $dropdown = $("#dropdown");

        $.each(result, function () {

            /** .val() assigns the value of the option to be the productID */
            $dropdown.append($("<option />").val(this.productID).text(this.productName));
        });
    });
});

/** This function prints the final resutl table */
$(document).ready(function() {

    $("#submit").click(function () { /** On submit click */

        var productID = $("#dropdown").val(); /** Fetching product ID from form */
        var nPcs = $("#nPcs").val(); /** Fetching quantity from form */

        fetch('http://localhost:3000/query/' + productID + '/' + nPcs) /** Fetching query results from express */
        .then(response => response.json())
        .then(result => {        

            if (result.length > 0) { /** Checking if query returns an empty array */

                $("#table").show(); /** Showing the table */
                $('#noStock').hide(); /** Hiding no stock output */

                /** Printing table with query result data */

                $('#table tr').not(':first').remove(); /** Removing any existing rows except of the header */

                let html = '';

                /** First row has yellow background */
                html += '<tr style = "background-color: yellow"><td>' + result[0].supplierName +
                        '<td>' + result[0].shipmentDays +
                        '<td> € ' + result[0].discountedPrice.toFixed(2) + '</td></tr>';

                /** Printing the remaining rows */
                for (let i = 1; i < result.length; i++)
                    html += '<tr><td>' + result[i].supplierName +
                            '<td>' + result[i].shipmentDays +
                            '<td> € ' + result[i].discountedPrice.toFixed(2) +'</td></tr>';
                
                $('#table tr').first().after(html);
            }else {

                /** Result is empty, printing "No stock" message */
                $("#table").hide(); /** Hiding the table */
                $('#noStock').show(); /** Showing no stock output */

                let output = "Item not in stock.";
                $('#noStock').text(output);
            }
        });
    });
});