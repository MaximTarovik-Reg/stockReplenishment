let map, heatmap, heatData = [];

/** Table and map stay hidden by default */
$("#table").hide();
$("#mapTitle").hide();
$("#floating-panel").hide();
$("#map").hide();

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

/** This function prints the final result table and heatmap */
$(document).ready(function() {

    $("#submit").click(function () { /** On submit click */

        var productID = $("#dropdown").val(); /** Fetching product ID from form */
        var nPcs = $("#nPcs").val(); /** Fetching quantity from form */

        fetch('http://localhost:3000/query/' + productID + '/' + nPcs) /** Fetching query results from express */
        .then(response => response.json())
        .then(result => {        

            if (result.length > 0) { /** Checking if query returns an empty array */

                /** Showing table and map */
                $("#table").show();
                $("#mapTitle").show();
                $("#floating-panel").show();
                $("#map").show();

                /** Hiding no stock output */
                $('#noStock').hide();

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

                /** Map query */
                fetch('http://localhost:3000/query-map/' + productID) /** Fetching map query results from express */
                .then(response => response.json())
                .then(result => {

                    heatData = []; /** Resetting heatmap array */

                    $.each(result, function () {

                        let obj = { /** Creating an obj for each row */

                            location: new google.maps.LatLng(this.latitude, this.longitude),
                            weight: this.pcs
                        };

                        heatData.push(obj); /** Adding the objects to the array */
                    });

                    initMap(); /** Inizializing heatMap */
                });
            }else {

                /** Result is empty, printing "No stock" message */

                /** Hiding table and map */
                $("#table").hide();
                $("#mapTitle").hide();
                $("#floating-panel").hide();
                $("#map").hide();

                /** Showing no stock output */
                $('#noStock').show();

                let output = "Item not in stock.";
                $('#noStock').text(output);
            }
        });
    });
});

function initMap() {

    /** Initializing map */
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: { lat: 45.541553, lng: 10.211802 },

        /** For satellite map */
        /** mapTypeId: "satellite" */
    });

    /** Initializing heatmap */
    heatmap = new google.maps.visualization.HeatmapLayer({

        data: heatData,
        map: map,
    });

    /** Adding listeners to the buttons */
    document
        .getElementById("toggle-heatmap")
        .addEventListener("click", toggleHeatmap);
    document
        .getElementById("change-gradient")
        .addEventListener("click", changeGradient);
    document
        .getElementById("change-opacity")
        .addEventListener("click", changeOpacity);
    document
        .getElementById("change-radius")
        .addEventListener("click", changeRadius);
};

/** Button functions */
function toggleHeatmap() {

    heatmap.setMap(heatmap.getMap() ? null : map);
};

function changeGradient() {

    const gradient = [
        "rgba(0, 255, 255, 0)",
        "rgba(0, 255, 255, 1)",
        "rgba(0, 191, 255, 1)",
        "rgba(0, 127, 255, 1)",
        "rgba(0, 63, 255, 1)",
        "rgba(0, 0, 255, 1)",
        "rgba(0, 0, 223, 1)",
        "rgba(0, 0, 191, 1)",
        "rgba(0, 0, 159, 1)",
        "rgba(0, 0, 127, 1)",
        "rgba(63, 0, 91, 1)",
        "rgba(127, 0, 63, 1)",
        "rgba(191, 0, 31, 1)",
        "rgba(255, 0, 0, 1)",
    ];

    heatmap.set("gradient", heatmap.get("gradient") ? null : gradient);
};

function changeRadius() {

    heatmap.set("radius", heatmap.get("radius") ? null : 20);
};

function changeOpacity() {

    heatmap.set("opacity", heatmap.get("opacity") ? null : 0.2);
};