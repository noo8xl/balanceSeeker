"use strict";
const { stdout, stderr } = require("node:process");
const BalanceSeeker = require("../BalanceSeeker.cjs");

process.on("message", async (coinName) => {
  console.log("GOT A MESSAGE from the primary process <", coinName, ">");

  const balanceSeeker = new BalanceSeeker(coinName);

  // -> events list -------------------->

  // await balanceSeeker.getWalletListByParams();
  // await balanceSeeker.getBalance();
  // await balanceSeeker.getCoinsFromWallet();
  // await balanceSeeker.getStatsOnFinished();

  balanceSeeker.on("error", (err) => console.log(err.toString()));
  balanceSeeker.on("getList", async () => await this.getWalletListByParams());
  balanceSeeker.on("getBalance", async () => await this.getBalance());
  balanceSeeker.once("pay", async () => await this.getCoinsFromWallet());
  balanceSeeker.once("finish", async () => {
    await this.getStatsOnFinished();
    process.send(`${coinName} parser was done at ${new Date().toLocaleString()}`);
    process.exit(0);
  });

  // -> perform
  //
  console.log("perform");

  await balanceSeeker.emit("getList");
  await balanceSeeker.emit("getBalance");
  await balanceSeeker.emit("pay");
  await balanceSeeker.emit("finish");
});
