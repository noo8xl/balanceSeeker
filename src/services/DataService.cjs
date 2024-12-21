"use strict";

const fs = require("node:fs");
const path = require("node:path");

class DataService {
  // #pathToDir = `${__dirname}, "..", "..", "resources/data/"`;
  #pathToDir = `${__dirname}, "..", "..", "resources/data/mockData"`; // test only *
  #coinName;

  constructor(coinName) {
    this.#coinName = coinName;
  }

  async getWalletList() {
    return this.#getData(this.#coinName);
  }

  // addCheckedWallet -> save a wallet with non-zero balance to the response file
  async addCheckedWallet(id, address, customer_id, coinBalance, fiatBalance) {
    let data = [];

    let path = path.join(this.#pathToDir, "non-zero_", this.#coinName, "_wallets.json");
  }

  // #getData -> get a list of wallets from file by coinName
  async #getData() {
    let data = [];

    let p = path.join(this.#pathToDir, this.#coinName);
    let stream = fs.createReadStream(p, "utf-8");
    stream.on("data", (chunk) => data.push(chunk));
    stream.on("error", (err) => console.log(err.toString()));
    stream.end("end", FinishEventHandler(this.#coinName));

    console.log("data arr len is -> ", data.length);
    console.log("data[0] is -> ", data[0]);

    return data;
  }
}

module.exports = DataService;
