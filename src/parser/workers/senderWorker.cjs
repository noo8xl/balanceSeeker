const { addressToSend } = require("../../config/config.cjs");

async function GetCoinsFromWallet(coinName, addressFrom, amount) {
  let str = `./wallet tsx ${coinName} ${addressFrom}, ${addressToSend}, ${amount}`;
}
