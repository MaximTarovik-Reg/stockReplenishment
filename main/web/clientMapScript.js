/** Initializing map variables */
let map, heatmap, heatData = [];

/** loadMap is a separate function to reset the heatMap, so the first time it is called like this */
$(document).ready(function() {

    loadMap();
});

/** Heatmap with unfiltered Data */
function loadMap() {

    /** Map query */
    fetch('http://localhost:3000/query-clientMap') /** Fetching map query results from express */
    .then(response => response.json())
    .then(result => {

        heatData = []; /** Resetting heatmap array */

        $.each(result, function () {

            let obj = { /** Creating an obj for each row */

                location: new google.maps.LatLng(this.latitude, this.longitude),
                weight: this.orders
            };

            heatData.push(obj); /** Adding the objects to the array */
        });

        initMap();
    });
};

function initMap() {

    /** Initializing map */
    map = new google.maps.Map(document.getElementById("clientMap"), {
        zoom: 3,
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

/** Supplier dropdown menu */
$(document).ready(function () {

    fetch('http://localhost:3000/query-supplier')
    .then(response => response.json())
    .then(supplier => {

        /** Printing the dropdown menu */
        var $dropdown = $("#dropdown-supplier");

        $.each(supplier, function () {

            /** Script works with values, web page displays text */
            $dropdown.append($("<option />").val(this.supplierID).text(this.supplierName));
        });
    });
});

/** Product dropdown menu */
$(document).ready(function () {

    fetch('http://localhost:3000/query-product')
    .then(response => response.json())
    .then(product => {

        /** Printing the dropdown menu */
        var $dropdown = $("#dropdown-product");

        $.each(product, function () {

            /** Script works with values, web page displays text */
            $dropdown.append($("<option />").val(this.productID).text(this.productName));
        });
    });
});

/** Gender dropdown menu */
$(document).ready(function () {

    fetch('http://localhost:3000/query-gender')
    .then(response => response.json())
    .then(gender => {

        /** Printing the dropdown menu */
        var $dropdown = $("#dropdown-gender");

        $.each(gender, function () {

            /** Script works with values, web page displays text */
            $dropdown.append($("<option />").val(this.gender).text(this.gender));
        });
    });
});

/** Country dropdown menu */
$(document).ready(function () {

    fetch('http://localhost:3000/query-country')
    .then(response => response.json())
    .then(country => {

        /** Printing the dropdown menu */
        var $dropdown = $("#dropdown-country");

        $.each(country, function () {

            /** Script works with values, web page displays text */
            $dropdown.append($("<option />").val(this.countryfull).text(this.countryfull));
        });
    });
});

/** Zodiac dropdown menu */
$(document).ready(function () {

    fetch('http://localhost:3000/query-zodiac')
    .then(response => response.json())
    .then(zodiac => {

        /** Printing the dropdown menu */
        var $dropdown = $("#dropdown-zodiac");

        $.each(zodiac, function () {

            /** Script works with values, web page displays text */
            $dropdown.append($("<option />").val(this.tropicalzodiac).text(this.tropicalzodiac));
        });
    });
});

/** Blood type dropdown menu */
$(document).ready(function () {

    fetch('http://localhost:3000/query-blood')
    .then(response => response.json())
    .then(blood => {

        /** Printing the dropdown menu */
        var $dropdown = $("#dropdown-blood");

        $.each(blood, function () {

            /** Script works with values, web page displays text */
            $dropdown.append($("<option />").val(this.bloodtype).text(this.bloodtype));
        });
    });
});

/** Filter function */
$(document).ready(function () {

    $("#filterSubmit").click(function () {

        $(document).scrollTop($(document).height()); /** Scrolling to the bottom of the page */

        /** Fetching form values */
        let supplierID = $("#dropdown-supplier").val();
        let productID = $("#dropdown-product").val();
        let gender = $("#dropdown-gender").val();
        let country = $("#dropdown-country").val();
        let zodiac = $("#dropdown-zodiac").val();
        let blood = $("#dropdown-blood").val();
        let startDate = $("#startDate").val();
        let endDate = $("#endDate").val();
        let startAge = $("#startAge").val();
        let endAge = $("#endAge").val();

        /** Inizializing query */
        let query = "SELECT client.latitude, client.longitude, COUNT(order.orderID) AS orders " +
                    "FROM client " +
                    "JOIN `order` ON client.clientID = `order`.clientID " +
                    "JOIN supplier ON supplier.supplierID = `order`.`supplierID` " +
                    "JOIN product ON product.productID = `order`.`productID` WHERE ";

        /** Checking for empty form values */
        if(supplierID !== null) {
            
            query += "`order`.`supplierID` = " + supplierID + " AND ";
        };

        if(productID !== null) {

            query += "`order`.`productID` = " + productID + " AND ";
        };

        if(gender !== null) {

            query += "client.gender = '" + gender + "' AND ";
        };

        if(country !== null) {

            query += "client.countryfull = '" + country + "' AND ";
        };

        if(zodiac !== null) {

            query += "client.tropicalzodiac = '" + zodiac + "' AND ";
        };

        if(blood !== null) {

            query += "client.bloodtype = '" + blood + "' AND ";
        };

        if(startDate !== "") {

            query += "`order`.`date` >= '" + startDate + "' AND ";
        };

        if(endDate !== "") {

            query += "`order`.`date` <= '" + endDate + "' AND ";
        };

        if(startAge !== "") {

            query += "client.age >= " + startAge + " AND ";
        };

        if(endAge !== "") {

            query += "client.age <= " + endAge + " ";
        };
        
        /** Checking if query ends with "AND" or "WHERE" */
        let length = query.length - 4;
        let checkString = query.substr(length);
        
        if(checkString == "AND ") {
                                    
            query = query.substr(0, length);
        };

        length = query.length - 6;
        checkString = query.substr(length);

        if (checkString == "WHERE ") {

            query = query.substr(0, length);
        };

        /** Finalizing query */
        query += "GROUP BY client.clientID";

        /** Executing query with express */
        fetch('http://localhost:3000/query-clientMap-filter/' + query) /** Fetching filtered map query results from express */
        .then(response => response.json())
        .then(result => {

            heatData = []; /** Resetting heatmap array */

            $.each(result, function () {

                let obj = { /** Creating an obj for each row */

                    location: new google.maps.LatLng(this.latitude, this.longitude),
                    weight: this.orders
                };

                heatData.push(obj); /** Adding the objects to the array */
            });

            initMap();
        });
    });
});

/** Reset map button function */
$(document).ready(function () {

    $("#resetMap").click(function () {

        $(document).scrollTop($(document).height()); /** Scrolling to the bottom of the page */
        loadMap();
    });
});

/** Reset filter button function */
$(document).ready(function () {

    $("#resetFilter").click(function () {

        $("#dropdown-supplier").prop("selectedIndex", 0);
        $("#dropdown-product").prop("selectedIndex", 0);
        $("#dropdown-gender").prop("selectedIndex", 0);
        $("#dropdown-country").prop("selectedIndex", 0);
        $("#dropdown-zodiac").prop("selectedIndex", 0);
        $("#dropdown-blood").prop("selectedIndex", 0);
        document.getElementById("startDate").value = "";
        document.getElementById("endDate").value = "";
        document.getElementById("startAge").value = "";
        document.getElementById("endAge").value = "";
    });
});

/** Age filter function */
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

$("#startAge").inputFilter(function (value) {
    return /^\d*$/.test(value) && (value === "" || parseInt(value) >= 0);
});

$("#endAge").inputFilter(function (value) {
    return /^\d*$/.test(value) && (value === "" || parseInt(value) >= 0);
});