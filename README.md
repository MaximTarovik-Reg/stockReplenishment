# Stock Replenishment

The aim of this project is to create a system that allows your shop to restock supplies; the price at which you sell your items is fixed, but you should be able to buy these items from different suppliers based on the order price and shipment days.

The system requires an input, you need to specify the item and the number of pieces you wish to order, the system will then print a table highlighting the cheapest option.
You'll still be able to see other suppliers in case you decide that a shorter shipment time is worth the higher price.

Table of contents:
  - [:computer: Technologies used](#computer-technologies-used)
  - [:hammer_and_wrench: Installation](#hammer_and_wrench-installation)
  - [:notebook_with_decorative_cover: Usage](#notebook_with_decorative_cover-usage)
  - [:heavy_check_mark: Tests](#heavy_check_mark-tests)

## :computer: Technologies used

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

First, you need to clone the project:

`git clone https://github.com/MaximTarovik-Reg/stockReplenishment.git`

All of the dependencies are already installed so your next step should be the installation of the database.
You can use whatever service you want, once you are ready simply create the database:

`CREATE DATABASE restock`

Once created, import the tables with the provided SQL file.

One last step is to install vscode live server to run the HTML file, you can do that simply by searching "Live Server" in the extension tab of vscode.

## :notebook_with_decorative_cover: Usage

You can run this project in two ways:
1. Through vscode live server by running "index.html"
2. Running app.js in the terminal

Let's start with the first option, open the project in vscode, and start the express server by running the following command:

`npm run dev`

The reason we run this command and not `node server.js` is because of nodemon, which allows us to update the page on file save without pressing F5.

Now all that's left to do is right click "index.html" and run it with vscode live server, the web app should now be running.

The second option is to run the app in the terminal, to do that simply run the following command in the project terminal:

`node app.js`

This runs the application in the terminal, the product list will be printed out and the app will wait for your inputs.
To run the app again simply rerun the command.

## :heavy_check_mark: Tests

A number of unit tests are implemented inside the project, they are stored in "functionsTest.js" and can be run with the following command in the project terminal:

`npm run test`

