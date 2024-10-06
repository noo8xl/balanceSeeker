'use strict'
const DatabaseCore = require("./DatabaseCore");

class DatabaseService extends DatabaseCore {

	constructor() {
		super();
	}

	async getWalletList(coinName) {

		let list = `wallet_list.coin_name, wallet_list.address, wallet_list.balance, wallet_list.customer_id`;
		let params = `wallet_params.is_used, wallet_params.is_checked`;

		const sql = `
			SELECT ${list}, ${params}
			FROM wallet_list
			JOIN wallet_params
			ON wallet_list.id = wallet_params.wallet_id
			WHERE wallet_list.coin_name = ?
			AND wallet_params.is_checked = false
			AND wallet_params.is_used = false
			AND wallet_params.created_at 
			BETWEEN NOW() + INTERVAL 3 DAY 
			AND NOW() + INTERVAL 1 DAY
	`;

		return await super._selectData(sql,[coinName])
	}

	async updateWalletStatus(walletId, isUsed, isChecked) {

		const sql = `
      UPDATE wallet_params 
      SET is_used=?, is_checked=? 
      WHERE wallet_id=?
    `;
		await this._updateData(sql,[ isUsed, isChecked, walletId ])
	}


}

module.exports = DatabaseService;