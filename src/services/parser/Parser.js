'use strict';
const {stdout} = require('node:process')
const EventEmitter  = require('events');
const DatabaseService = require("../database/DatabaseService");


// get a wallet list,
// set it as an internal class variable,
// get the balance of the wallet,
// update wallet params is checked,
// if balance != 0 -> save it to the redis store by this.coinName key
// -> remove item from a wallet list
// else -> remove item and go further

class Parser extends EventEmitter {
	coinName
	#walletList
	#databaseService
	#cryptoService
	#cacheService

	foundedCrypto = 0
	currencyName = 'USD'
	fiatAmount = 0

	constructor(coinName) {
		super({captureRejections: true})
		this.coinName = coinName;
		this.#databaseService = new DatabaseService();
		// this.#cryptoService = new CryptoService();
		// this.#cacheService = new CacheService();
	}

	async getWalletListByParams() {
		this.#walletList = await this.#databaseService.getWalletList(this.coinName)
		stdout.write('this.#walletList -> ' + this.#walletList.length.toString() + '\n')
	}

	async getBalance() {
		if (!this.#walletList) return;

		let balance = 0.2;
		let list = this.#walletList.length

		// balance seeker loop:
		for (let i = 0; i < list; i++) {
			try {
				// let cacheItem = { coinName: this.coinName, address: list[i].address}
				// balance = this.#cryptoService.getBalance(list[i].address)
				if(balance > 0) {
					// await this.#updateWalletStatus(list[i].id, balance, list[i].is_checked, false)
					// await this.#cacheService.setWalletItem(cacheItem)
				}

			} catch (e) {
				throw new Error(e)
			}
		}
	}

	async getStatsOnFinished(){
		// create a file
		// save a stat ?*
		let msg = `-> parser was finished with:\n` +
		`coinName: ${this.coinName}\n` +
		`totalCryptoAmount: ${this.foundedCrypto}\n` +
		`totalFiatAmount: ${this.fiatAmount} \n` +
		`currencyName: ${this.currencyName}\n` +
			'----------------------------------\n'

		stdout.write(msg.toString());

	}

	async #updateWalletStatus(id, balance, isChecked, isUsed){
		await this.#databaseService.updateWalletStatus(id, isUsed, isChecked)

	}


}

module.exports = Parser;