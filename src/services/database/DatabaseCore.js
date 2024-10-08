'use strict';
const {stdout, stderr} = require('node:process');
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
				if(err) reject(err)
				//
				// console.log('fields => ', fields)
				// console.log('result => ', result)
				resolve(result)
			})
		})

		query
			.catch(err => stderr.write('query error -> ' + err + '\n'))
			.finally(async () => {await this.#closeConnection()})

		return query;
	}

	async _updateData(sqlString, valuesArray) {

		let pr = new Promise((resolve, reject) => {
			this.#db.query(
				sqlString,
				valuesArray,
				async (err, result, fields) => {
				if(err) reject(err)
				//
				// console.log('fields => ', fields)
				// console.log('result => ', result)
				resolve(result)
			}
		)
		})

		pr
			.catch(err => stderr.write('query error -> ' + err +'\n'))
			.finally(async () => {await this.#closeConnection()})

	}

	// initConnection -> init mysql connection
	async #initConnection() {

		this.#db = mysql.createConnection(dbConfig)
		this.#db.connect((err) => {
			if(err) {
				stderr.write('DATABASE connection error -> ' + err)
				process.exit(1)
			}
			stdout.write('mysql database was connected.\n')
		})

	}

	async #closeConnection() {
		return new Promise((resolve, reject) => {
			stderr.write('db disconnected\n')
			resolve(this.#db.destroy())
		})
	}

}

module.exports = DatabaseCore;
