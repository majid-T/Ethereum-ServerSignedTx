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
  console.log("Accounts on Ganache:", accounts);

  // Getting addresses and keys from ganache network
  // These vairables will vary on each deployment so make sure to use your own addresses and keys

  // Import ABI which you will get after compiling - here from Remix
  const ABI = require("./contractAbi.json");

  // Deploy on ganache first and grab it from there
  const contractAddress = "0xfe2Fca6b9e2358840CeC8849dB0064a6539B8941";

  // Since we uses a require on contract for only owner, make sure to grab the deployer address here
  const account = "0x9416BE1747f767C504B6D41Cebbeac1E0BBC746e";

  // Private key for the above account
  const privateKey = Buffer.from(
    "992c22d78677b2e6a65acbe74d7e741ba64c8ce99efed34fa408a29f74d84d9b",
    "hex"
  );

  // A second address who you want to change the owner too
  const newAddress = "0x5427bedc03E5ffB8747A534d0C8F945631F4FC77";

  // Grabing Test contract from the network by ABI and address
  let TestContract = new web3.eth.Contract(ABI, contractAddress);

  // ABI encoding the function call
  const _data = TestContract.methods.setOwner(newAddress).encodeABI();

  //Grabing nonce which is count of transactions on the account specified
  _nonce = await web3.eth.getTransactionCount(account);

  // making the transaction json object - you can grab below info from your ganache console
  let rawTx = {
    nonce: _nonce,
    gasPrice: "0x20000000000",
    gasLimit: "0x27511",
    to: contractAddress,
    value: 0,
    data: _data,
  };

  // Making a transaction object and signing it with the account private key
  let tx = new Tx(rawTx);
  tx.sign(privateKey);
  var serializedTx = tx.serialize();

  //Executing and Grabing the receipt of the transaction
  var _receipt = await web3.eth.sendSignedTransaction(
    "0x" + serializedTx.toString("hex")
  );
  console.log("Receipt: ", _receipt);

  res.render("index", { title: "Express", receipt: JSON.stringify(_receipt) });
});

module.exports = router;
