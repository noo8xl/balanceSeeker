'use strict';
const {stdout, stderr} = require('node:process')
const EventEmitter  = require('node:vents');
const DatabaseService = require("../services/database/DatabaseService");
const child_process = require("node:child_process");
const path = require("node:path");

class BalanceSeeker {
	coinName
	#walletList
	#listToPay //


	#databaseService
	#cryptoService

	// stats ->
	foundedCrypto = 0.0
	currencyName = 'USD'
	fiatAmount = 0
	checkedWallets = 0

	// get rate b4 the start of a parser
	rate = 55_000

	constructor(coinName) {
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

		// create a child
		const logWorkerPath = path.join(__dirname, 'workers/logWorker.js');
		const updateStatusWorkerPath = path.join(__dirname, 'workers/statusUpdaterWorker.js');

		let list = this.#walletList
		// balance seeker loop:
		for (let i = 0; i < list.length; i++) {
			let balance = 0;

			let logWorker = child_process.fork(logWorkerPath)
			let updateWorker = child_process.fork(updateStatusWorkerPath)

			logWorker
				.on('message', message => {
					stdout.write(`got a message from <_ logWorker ${logWorker.pid} _>: ` + message + '\n')
				})
				.on('error', err => { stderr.write(err.toString()) })
				.on('exit', code => {
					stdout.write(`logWorker process ${logWorker.pid} done with code ` + code + '\n')
					logWorker.kill('SIGINT')
				})

			updateWorker
				.on('message', message => {
					stdout.write(`got a message from <_ updateWorker ${updateWorker.pid} _>: ` + message + '\n')
				})
				.on('error', err => { stderr.write(err.toString()) })
				.on('exit', code => {
					stdout.write(`updateWorker process ${updateWorker.pid} done with code ` + code + '\n')
					logWorker.kill('SIGINT')
				})


			// ----------- for the TEST ONLY! ------------ #
			if (list[i].id === 16) balance = 0.2; // ----- #
			// ------------------------------------------- #
			try {
				// balance = await this.#cryptoService.getBalance(list[i].address)
				let updateWalletObj = {
					walletId: list[i].id,
					balance: balance,
					isChecked: true,
					isUsed: false
				}

				if(balance === 0) {
					updateWorker.send(updateWalletObj)
				} else {
					let walletData = {
						userId: list[i].customer_id,
						coinName: list[i].coin_name,
						address: list[i].address
					}

					updateWalletObj.isUsed = true
					updateWorker.send(updateWalletObj)

					this.#listToPay.push(walletData)

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

	// getCoinsFromWallet -> create a list of child processes which equals to this.#listToPay
	// and send a task to each one
	async getCoinsFromWallet() {
		// wallet obj is -> {	userId: string, coinName: string, address: string }

		let childList = []
		let list = this.#listToPay;
		const workerPath = path.join(__dirname, 'workers/senderWorker.js');

		while (childList.length !== list.length) {
			let child = child_process.fork(workerPath)

			child
			.on('message', message => {
				stdout.write(`got a message from <_ senderWorker ${child.pid} _>: ` + message + '\n')
			})
			.on('error', err => {
				stderr.write(err.toString())
				process.exit(1)
			})
			.on('exit', code => {
				stdout.write(`senderWorker process ${child.pid} done with code ` + code + '\n')
				child.kill('SIGINT')
			})

			childList.push(child)
		}

		for (let i = 0; i < list.length; i++) {
			childList[i].send(list[i])
		}
		// end of getCoinsFromWallet method
	}


}

module.exports = BalanceSeeker;