'use strict';
const dbConfig = require("../../config");
const mysql = require('mysql2')

class DatabaseCore {
	#db;

	constructor() {}


	async _selectData(sqlString, valuesArray) {

		try {
			await this.#initConnection()

			return await this.#db.query(sqlString, valuesArray, async (err, result, fields) => {
				if(err) console.error('db query error -> ', err);
				console.log("result -> ", result);
				return result;
			})
		} catch (err) {
			console.error('got an err -> ', err)
			// throw await ErrorInterceptor.ServerError(`db selection was failed at <getWalletList> with err\n${e}`)
		} finally {
			await this.#closeConnection()
		}
	}

	async _updateData(sqlString, valuesArray) {

		return new Promise((resolve, reject) => {
			this.#db.query(
				sqlString,
				valuesArray,
					(err, result, fields) => {
				if(err) reject()
				console.log('result => ',result);
				resolve()
			}
		)
		})
	}

	// initConnection -> init mysql connection
	async #initConnection() {

		this.#db = mysql.createConnection(dbConfig)

		this.#db.connect(async (err) => {
			// if (err) throw await ErrorInterceptor.ServerError("wallet database connection was failed.")
			console.log('mysql database was connected.')
		})

	}

	async #closeConnection() {
		return new Promise((resolve, reject) => {
			resolve(this.#db.destroy())
		})
	}

}

module.exports = DatabaseCore;
