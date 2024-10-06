'use strict';

const coinName = 'btc';
// console.log(`${coinName} worker log -> `)
const parserEvent = require("./Parser");

process.on('message', (coinName) => {
	console.log('GOT A MESSAGE from the primary process', coinName);

	parserEvent.emit('getList', coinName);
	parserEvent.emit('getBalance');
	parserEvent.emit('pay');
	parserEvent.emit('finish')
	process.send(`${coinName} parser was done at ${new Date().toLocaleString()}`);

})




