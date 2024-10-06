'use strict';
const {dbConfig} = require("../../config");
const mysql = require('mysql2')

class DatabaseCore {
	#db;

	constructor() {}


	async _selectData(sqlString, valuesArray) {

		await this.#initConnection()

		let query =  new Promise((resolve, reject) => {
			this.#db.query(
				sqlString,
				valuesArray,
				async (err, result, fields) => {
				if(err) reject()
				// console.log("result -> ", result);
				resolve(result)
			}
		)
		})

		query
			.catch(err => console.error('query error -> ', err))
			.finally(async () => {await this.#closeConnection()})

		return query;
	}

	async _updateData(sqlString, valuesArray) {

		return new Promise((resolve, reject) => {
			this.#db.query(
				sqlString,
				valuesArray,
				async (err, result, fields) => {
				if(err) reject()
				console.log('result => ',result);
				resolve()
			}
		)
		})
	}

	// initConnection -> init mysql connection
	async #initConnection() {

		// console.log('dbObj vals is => ', Object.values(dbConfig));
		this.#db = mysql.createConnection(dbConfig)

		this.#db.connect(async (err) => {
			if(err) console.log('DATABASE connection error -> ', err)
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
