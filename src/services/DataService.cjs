"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");

class DataService {
  // #pathToDir = path.join(`${__dirname}`, "../", "../", "src/resources/data");
  #pathToDir = path.join(__dirname, "../", "../", "src/resources/mockData"); // test only *
  #pathToNonZero = path.join(__dirname, "../", "../", "src/resources/non-zero-wallets");
  #coinName;

  constructor(coinName) {
    this.#coinName = coinName;
  }

  async getWalletList() {
    return await this.#getData();
  }

  async getListToPay() {
    return await this.#getNonZeroList();
  }

  // #getData -> get a list of wallets from file by coinName
  async #getData() {
    let p = path.join(this.#pathToDir, this.#coinName, "list.json");
    try {
      return JSON.parse(await fs.readFile(p, "utf-8"));
    } catch (err) {
      console.error(`Error reading JSON file: ${err}`);
      process.exit(1);
    }
  }

  // addCheckedWallet -> save a wallet with non-zero balance to the json file
  // dto = id, address, customer_id, coinBalance, fiatBalance
  async addCheckedWallet(dto) {
    // let folderName = `non-zero-wallets`;
    let fileName = `${this.#coinName}.json`;

    // let p = path.join(this.#pathToNonZero, folderName);
    let filePath = path.join(this.#pathToNonZero, fileName);

    try {
      await fs.access(this.#pathToNonZero).catch(async (e) => {
        if (e.code === "ENOENT")
          await fs.mkdir(this.#pathToNonZero).catch((e) => console.error("mkdir err -> ", e));
      });
      await fs.access(filePath).catch(async (e) => {
        if (e.code === "ENOENT") await fs.writeFile(filePath, "[]", "utf-8");
      });
      await this.#addData(filePath, dto);
    } catch (e) {
      console.error("Unhandled Error is -> ", e);
      process.exit(1);
    }

    return;
  }

  async #addData(path, payload) {
    await fs
      .readFile(path)
      .then(async (data) => {
        let arr = JSON.parse(data);
        if (Array.isArray(arr)) arr.push(JSON.stringify(payload));
        await fs.writeFile(path, JSON.stringify(arr));
      })
      .catch((err) => {
        throw new Error("#addData err" + err.message);
      });
  }

  async #getNonZeroList() {
    let p = path.join(this.#pathToNonZero, `${this.#coinName}.json`);
    try {
      return JSON.parse(await fs.readFile(p, "utf-8"));
    } catch (err) {
      console.error(`Error reading JSON file: ${err.message}`);
      process.exit(1);
    }
  }
}

module.exports = DataService;
