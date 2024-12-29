const { addressToSend } = require("../../config/config.js");
const CryptoService = require("../../services/CryptoService.cjs");
const DataService = require("../../services/DataService.cjs");

process.on("message", async (coinName) => {
  console.log("--- sender worker called ");

  try {
    const cryptoService = new CryptoService(coinName);
    const dataService = new DataService(coinName);

    let list = await dataService.getListToPay();
    for (let i = 0; i < list.length; i++) {
      let item = { address: JSON.parse(list[i]).address, amount: JSON.parse(list[i]).cryptoAmount };
      await cryptoService.sendTransaction(item).catch((e) => console.error("send transaction err: ", e));
    }
  } catch (err) {
    console.error("sender worker error => ", err);
    process.exit(1);
  }
});
