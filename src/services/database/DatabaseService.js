'use strict'

const {
	btcWallets,
	ethWallets,
	trxWallets,
	tonWallets
} = require('../../mockData/walletList');

class DatabaseService {

	async getWalletList(coinName) {
		return this.#getArrByList(coinName)
	}

	updateWalletStatus(walletId, balance, isChecked, isUsed ) {
		return true
	}

	async #getArrByList(coinName) {
		switch (coinName) {
			case "btc":
				return btcWallets;
			case "eth":
				return ethWallets;
			case "trx":
				return trxWallets;
			case "ton":
				return tonWallets;
			default:
				console.log('unknown coinName-')
				break;
		}
	}

}

module.exports = DatabaseService;