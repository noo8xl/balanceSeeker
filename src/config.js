'use strict';

require('dotenv').config();

const port = 63135
const host = '127.0.0.1'
const dbConfig = {
	host: process.env.DB_HOST,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
}

const coinList= [ 'btc', 'eth', 'trx', 'ton' ] // , 'sol'

module.exports = {
	port,
	host,
	dbConfig,

	coinList
}