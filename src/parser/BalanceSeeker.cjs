"use strict";
const { stdout, stderr } = require("node:process");
const DataService = require("../services/DataService.cjs");
const CryptoService = require("../services/CryptoService.cjs");
const child_process = require("node:child_process");
const path = require("node:path");
const GetRate = require("./http/getData.cjs");

class BalanceSeeker {
  coinName;
  #walletList;

  #dataService;
  #cryptoService;

  // stats ->
  foundedCrypto = 0.0;
  currencyName = "usd";
  fiatAmount = 0;
  checkedWallets = 0;

  // get rate b4 the start of a parser
  rate = 0;

  constructor(coinName) {
    this.coinName = coinName;
    this.#dataService = new DataService(coinName);
    this.#cryptoService = new CryptoService(coinName);
  }

  async getWalletListByParams() {
    this.#walletList = await this.#dataService.getWalletList();
    // get coin rate here ? *
    this.rate = await GetRate(this.coinName, this.currencyName);
    console.log(this.coinName, " rate: ", this.rate);
    console.log(`${this.coinName} #walletList -> `, this.#walletList.length);
  }

  async getBalance() {
    if (!this.#walletList) return;

    // create a child
    // const logWorkerPath = path.join(__dirname, "workers/logWorker.js");
    // const updateStatusWorkerPath = path.join(__dirname, "workers/statusUpdaterWorker.js");

    let list = this.#walletList;
    // balance seeker loop:
    balanceSeekerLoop: for (let i = 0; i < list.length; i++) {
      let balance = 0;

      // let logWorker = child_process.fork(logWorkerPath);
      // let updateWorker = child_process.fork(updateStatusWorkerPath);

      // logWorker
      //   .on("error", (err) => console.log(err.toString()))
      //   .on("message", (message) => {
      //     stdout.write(`got a message from <_ updateWorker ${logWorker.pid} _>: ` + message + "\n");
      //   })
      //   .on("exit", (code) => {
      //     stdout.write(`cluster with id ${logWorker.id} done with code ` + code + " \n");
      //     stdout.write("worker state -> " + logWorker.state + "\n");
      //   });

      // updateWorker
      //   .on("error", (err) => console.log(err.toString()))
      //   .on("message", (message) => {
      //     stdout.write(`got a message from <_ updateWorker ${updateWorker.pid} _>: ` + message + "\n");
      //   })
      //   .on("exit", (code) => {
      //     stdout.write(`cluster with id ${updateWorker.id} done with code ` + code + " \n");
      //     stdout.write("worker state -> " + updateWorker.state + "\n");
      //   });

      // ----------- for the TEST ONLY! ------------ #
      if (list[i].id === 11) balance = 0.2; // ----- #
      if (list[i].id === 16) balance = 0.112; //---- #
      // ------------------------------------------- #

      try {
        // balance = await this.#cryptoService.getBalance(list[i].address, this.currencyName);

        if (balance === 0) {
          continue balanceSeekerLoop;
          // console.log(this.coinName, " balance not found");
        } else {
          let payItem = {
            id: list[i].id,
            address: list[i].address,
            customer_id: list[i].customer_id,
            fiatAmount: balance * this.rate,
            cryptoAmount: balance,
          };
          await this.#dataService.addCheckedWallet(payItem);

          this.foundedCrypto += balance;
          this.fiatAmount += balance * this.rate;
          balance = 0;
        }
      } catch (e) {
        throw new Error(e);
      } finally {
        this.checkedWallets += 1;
      }
    }
  }

  async getCoinsFromWallet() {
    if (!this.foundedCrypto) return;
    console.log("pay event was called");
    const workerPath = path.join(__dirname, "workers/senderWorker.cjs");
    let senderWorker = child_process.fork(workerPath);

    senderWorker
      .on("error", (err) => console.log(err.toString()))
      .on("message", (message) => {
        stdout.write(`got a message from <_ updateWorker ${senderWorker.pid} _>: ` + message + "\n");
      })
      .on("exit", (code) => {
        stdout.write(`cluster with id ${senderWorker.id} done with code ` + code + " \n");
        stdout.write("worker state -> " + senderWorker.state + "\n");
      });

    senderWorker.send(this.coinName);
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
