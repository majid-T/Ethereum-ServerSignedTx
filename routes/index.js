var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", async function (req, res, next) {
  // making a Web3 object
  const Web3 = require("web3");

  //making a transaction object
  var Tx = require("ethereumjs-tx").Transaction;

  //connecting to an ethereum network --- here is ganache GUI
  const web3 = new Web3(
    new Web3.providers.HttpProvider("http://localhost:7545")
  );

  //Getting the account on the network
  var accounts = await web3.eth.getAccounts();
  console.log("Accounts:", accounts);

  res.render("index", { title: "Express" });
});

module.exports = router;
