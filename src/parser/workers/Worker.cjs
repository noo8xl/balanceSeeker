"use strict";
const { stdout, stderr } = require("node:process");
const BalanceSeeker = require("../BalanceSeeker.cjs");

process.on("message", async (coinName) => {
  // console.log("GOT A MESSAGE from the primary process <", coinName, ">");

  try {
    const balanceSeeker = new BalanceSeeker(coinName);

    await balanceSeeker.getWalletListByParams();
    await balanceSeeker.getBalance();
    await balanceSeeker.getCoinsFromWallet();
    await balanceSeeker.getStatsOnFinish();
    //
  } catch (err) {
    console.error("main worker error => ", err);
    process.exit(1);
  }
});
