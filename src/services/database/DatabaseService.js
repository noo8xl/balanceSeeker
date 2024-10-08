'use strict'
const DatabaseCore = require("./DatabaseCore");

class DatabaseService extends DatabaseCore {

	constructor() {
		super();
	}

	async getWalletList(coinName) {

		const sql = `
			SELECT wallet_list.id, wallet_list.coin_name, wallet_list.address, wallet_list.customer_id
			FROM wallet_list
			JOIN wallet_params
			ON wallet_list.id = wallet_params.wallet_id
			WHERE wallet_list.coin_name = ?
			AND wallet_params.is_checked = false
			AND wallet_params.is_used = false
			AND wallet_params.created_at 
			BETWEEN NOW() - INTERVAL 3 DAY 
			AND NOW()
		`;

		return await super._selectData(sql,[coinName])
	}

	async updateWalletStatus(walletId, balance, isChecked, isUsed, ) {

		const balSql = `
			UPDATE wallet_list
			SET balance = ? 
			WHERE id = ?
		`;

		const sql = `
      UPDATE wallet_params 
      SET is_used=?, is_checked=? 
      WHERE wallet_id=?
    `;

		await super._updateData(balSql,[ balSql, walletId ])
		await super._updateData(sql,[ isUsed, isChecked, walletId ])
	}


}

module.exports = DatabaseService;