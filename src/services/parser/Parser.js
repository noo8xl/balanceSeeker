'use strict';
const EventEmitter  = require('events');
const DatabaseService = require("../database/DatabaseService");

class Parser extends EventEmitter {
	coinName
	#walletList
	#databaseService

	totalCryptoAmount = 0
	currencyName = 'USD'
	totalFiatAmount = 0

	range

	constructor() {
		super({captureRejections: true})
		this.#databaseService = new DatabaseService();
	}

	// getWalletListByParams -> get a list of wallets for parser
	async getWalletListByParams(coinName) {
		console.log(`call with __${coinName}__`)
		this.coinName = coinName;

		this.#walletList = await this.#databaseService.getWalletList(coinName)
		console.log('this.#walletList.length -> ', this.#walletList.length)
		this.range = await this.#walletList.length
	}

	// getCoinsFromWallet -> run through the <this.balances> and call <sendTransaction> here to send the coins from wallet to owner
	async getCoinsFromWallet(){
		console.log("test this -> ", this.coinName)
		console.log("balance array length is -> ", this.#walletList.length);
		//
		// try	{
		// 	while (this.#balances.length !== 0) {
		// 		// await cryptoService.sendTransactionAutomatically({coinName: this.coinName, address: this.balances[0].address})
		// 		this.#balances.shift()
		// 		await this.getCoinsFromWallet()
		// 	}
		// } catch (err) {
		// 	console.error('got an err -> ', err)
		// 	// throw await ErrorInterceptor.ServerError(`
    //   //   getCoinsFromWallet was failed. The wallet was:
    //   //   coinName: ${this.balances[0].coinName},
    //   //   address: ${this.balances[0].address}
    //   //   `)
		// }
	}


}


// event handlers ------------>

const parserEvent = new Parser();

const parserList = []

parserList.push(parserEvent);

const getWalletList = async (coinName) => {
	await parserEvent.getWalletListByParams(coinName)
}

const getBalances = async () => {
	await parserEvent.getCoinsFromWallet()
}

const sendTransaction = async () => {}

const finishParser = () => {
	let coins = `${parserEvent.totalCryptoAmount} ${parserEvent.coinName} `;
	let fiat = `(${parserEvent.totalFiatAmount} ${parserEvent.currencyName})`;
	console.log(`total payed: ${coins}, ${fiat}`);
	console.log('parser finished.')
}

parserEvent.on("error", (err) => {
	console.error('got a worker error -> ', err)
})

// events list -------------------->

parserEvent.on("getList", getWalletList)
parserEvent.on("getBalance", getBalances)
parserEvent.on("pay", sendTransaction)
parserEvent.on("finish", finishParser)


module.exports = parserEvent;