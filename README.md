# Stock Replenishment

The aim of this project is to create a system that allows your shop to restock supplies; the price at which you sell your items is fixed, but you should be able to buy these items from different suppliers based on the order price and shipment days.

The system requires an input, you need to specify the item and the number of pieces you wish to order, the system will then print a table highlighting the cheapest option.
You'll still be able to see other suppliers in case you decide that a shorter shipment time is worth the higher price.

## Technologies used

This project was built mainly using node.js, the database used was created using XAMPP and it's a relational MySQL DB.
The front-end spectrum of the application was created with a simple HTML page that communicates with node using a jQuery script.

Also, the following node modules were used:
- Mocha
- Chai
- MySQL
- Prompt
- Colors
- Express
- Nodemon
- Body-Parser
- Cors

## :hammer_and_wrench: Installation

First, you need to clone the project:<br>
`git clone https://github.com/MaximTarovik-Reg/stockReplenishment.git`

All of the dependencies are already installed so your next step should be the installation of the database.
You can use whatever service you want, once you are ready simply create the database:<br>
`CREATE DATABASE restock`

Once created, import the tables with the provided SQL file.

One last step is to install vscode live server to run the HTML file, you can do that simply by searching "Live Server" in the extension tab of vscode.