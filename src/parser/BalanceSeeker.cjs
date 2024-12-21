"use strict";
const { stdout, stderr } = require("node:process");
const EventEmitter = require("node:events");
const DataService = require("../services/DataService.cjs");
const CryptoService = require("../services/CryptoService.cjs");
const child_process = require("node:child_process");
const path = require("node:path");
const { GetRate } = require("./http/getData.cjs");

class BalanceSeeker extends EventEmitter {
  coinName;
  #walletList;
  #listToPay; //

  #dataService;
  #cryptoService;

  // stats ->
  foundedCrypto = 0.0;
  currencyName = "USD";
  fiatAmount = 0;
  checkedWallets = 0;

  // get rate b4 the start of a parser
  rate = 55_000;

  constructor(coinName) {
    this.coinName = coinName;
    this.#dataService = new DataService(coinName);
    this.#cryptoService = new CryptoService(coinName);
  }

  async getWalletListByParams() {
    this.#walletList = await this.#dataService.getWalletList(this.coinName);
    // get coin rate here ? *
    this.rate = await GetRate(this.coinName, this.currencyName);
    stdout.write(`${this.coinName} #walletList -> ` + this.#walletList.length.toString() + "\n");
  }

  async getBalance() {
    if (!this.#walletList) return;

    // create a child
    const logWorkerPath = path.join(__dirname, "workers/logWorker.js");
    const updateStatusWorkerPath = path.join(__dirname, "workers/statusUpdaterWorker.js");

    let list = this.#walletList;
    // balance seeker loop:
    for (let i = 0; i < list.length; i++) {
      let balance = 0;

      let logWorker = child_process.fork(logWorkerPath);
      let updateWorker = child_process.fork(updateStatusWorkerPath);

      logWorker
        .on("error", (err) => console.log(err.toString()))
        .on("message", (message) => {
          stdout.write(`got a message from <_ updateWorker ${logWorker.pid} _>: ` + message + "\n");
        })
        .on("exit", (code) => {
          stdout.write(`cluster with id ${logWorker.id} done with code ` + code + " \n");
          stdout.write("worker state -> " + logWorker.state + "\n");
        });

      updateWorker
        .on("error", (err) => console.log(err.toString()))
        .on("message", (message) => {
          stdout.write(`got a message from <_ updateWorker ${updateWorker.pid} _>: ` + message + "\n");
        })
        .on("exit", (code) => {
          stdout.write(`cluster with id ${updateWorker.id} done with code ` + code + " \n");
          stdout.write("worker state -> " + updateWorker.state + "\n");
        });

      // ----------- for the TEST ONLY! ------------ #
      if (list[i].id === 16) balance = 0.2; // ----- #
      // ------------------------------------------- #
      try {
        // balance = await this.#cryptoService.getBalance(list[i].address)
        let updateWalletObj = {
          walletId: list[i].id,
          balance: balance,
          isChecked: true,
          isUsed: false,
        };

        if (balance === 0) {
          updateWorker.send(updateWalletObj);
        } else {
          let walletData = {
            userId: list[i].customer_id,
            coinName: list[i].coin_name,
            address: list[i].address,
          };

          updateWalletObj.isUsed = true;
          updateWorker.send(updateWalletObj);

          this.#listToPay.push(walletData);

          this.foundedCrypto += balance;
          this.fiatAmount = balance * this.rate;
          balance = 0;
        }
      } catch (e) {
        throw new Error(e);
      } finally {
        this.checkedWallets += 1;
      }
    }
  }

  async getStatsOnFinish() {
    const stats = {
      CoinName: this.coinName,
      TotalCryptoAmount: this.foundedCrypto,
      TotalFiatAmount: this.fiatAmount,
      CurrencyName: this.currencyName,
      CheckedWalletsAmount: this.checkedWallets,
    };

    console.table([stats]);
  }
}

module.exports = BalanceSeeker;
