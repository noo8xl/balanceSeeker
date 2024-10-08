'use strict';
const {stdout, stderr} = require('node:process');
const Parser = require("./Parser");

process.on('message', (coinName) => {
	console.log('GOT A MESSAGE from the primary process <', coinName, '>');

	const parserEvent = new Parser(coinName)

	// -> events list -------------------->

	parserEvent.on("error", (err) => {
		stderr.write(`got a < ${coinName} > worker error -> ` + err + '\n')
		// save err log *
		process.exit(1)
	})

	parserEvent.on("getList", async () => {await parserEvent.getWalletListByParams()})
	parserEvent.on("getBalance", async () => {await parserEvent.getBalance()})
	parserEvent.on("pay", () => {
		stdout.write('send transaction')
	})
	parserEvent.on("finish", async () => {await parserEvent.getStatsOnFinished()})

	parserEvent.emit('getList');
	parserEvent.emit('getBalance');
	parserEvent.emit('pay');
	parserEvent.emit('finish')

	process.send(`${coinName} parser was done at ${new Date().toLocaleString()}`);

})




