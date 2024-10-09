'use strict';
const {stdout} = require('node:process')
const EventEmitter  = require('events');
const DatabaseService = require("../services/database/DatabaseService");

class Parser extends EventEmitter {
	coinName
	#walletList
	#databaseService
	#cryptoService

	foundedCrypto = 0.0
	currencyName = 'USD'
	fiatAmount = 0
	checkedWallets = 0

	rate = 55_000

	constructor(coinName) {
		super({captureRejections: true})
		this.coinName = coinName;
		this.#databaseService = new DatabaseService();
		// this.#cryptoService = new CryptoService();
	}

	async getWalletListByParams() {
		this.#walletList = await this.#databaseService.getWalletList(this.coinName)
		// get coin rate here ? *
		stdout.write(`${this.coinName} #walletList -> ` + this.#walletList.length.toString() + '\n')
	}

	async getBalance() {
		if (!this.#walletList) return;

		let list = this.#walletList
		// balance seeker loop:
		for (let i = 0; i < list.length; i++) {
			let balance = 0;

			// ----------- for the TEST ONLY! ------------ #
			if (list[i].id === 16) balance = 0.2; // ----- #
			// ------------------------------------------- #
			try {
				// balance = await this.#cryptoService.getBalance(list[i].address)
				if(balance === 0) {
					this.#databaseService.updateWalletStatus(list[i].id, 0, true, false)
				} else {
					let walletData = {
						userId: list[i].customer_id,
						coinName: list[i].coin_name,
						address: list[i].address
					}

					await this.#getCoinsFromWallet(walletData);
					this.#databaseService.updateWalletStatus(list[i].id, balance, true, true )

					this.foundedCrypto += balance;
					this.fiatAmount = balance * this.rate
					balance = 0;
				}
			} catch (e) {
				throw new Error(e);
			} finally {
				this.checkedWallets += 1;
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
		`checkedWalletsAmount: ${this.checkedWallets}\n` +
		'----------------------------------\n'

		stdout.write(msg);
	}

	// #####################################################################################

	async #getCoinsFromWallet(wallet) {
		// wallet obj is -> {	userId: string, coinName: string, address: string }
		// ----------------------------------------- #
		// await this.#cryptoService.sendTransaction()
		// send notification
		// save log *

		console.log('payed -> ', wallet)
	}

}

module.exports = Parser;