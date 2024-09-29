'use strict';
const port = 63135
const host = '127.0.0.1'
const dbConfig = {
	dbHost: process.env.DB_HOST,
	dbUser: 'noo8xl',
	dbPassword: '1',
	dbName: process.env.DB_NAME,
}

const coinList= [ 'btc', 'eth', 'trx', 'ton' ] // , 'sol'

module.exports = {
	port,
	host,
	dbConfig,

	coinList
}