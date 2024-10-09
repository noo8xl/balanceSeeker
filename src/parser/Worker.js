'use strict';
const {stdout, stderr} = require('node:process');
const Parser = require("./Parser");

process.on('message', async (coinName) => {
	console.log('GOT A MESSAGE from the primary process <', coinName, '>');

	const parserEvent = new Parser(coinName)

	// -> events list -------------------->

	parserEvent.on("error", (err) => {
		stderr.write(`got a < ${coinName} > worker error -> ` + err + '\n')
		// save err log *
		process.exit(1)
	})

	parserEvent.on("getList", async () => { await parserEvent.getWalletListByParams()})
	parserEvent.on("getBalance", async () => { await parserEvent.getBalance()})
	parserEvent.on("finish", async () => {
		await parserEvent.getStatsOnFinished()
		process.send(`${coinName} parser was done at ${new Date().toLocaleString()}`);
		process.exit(0)
	})

	await parserEvent.emit('getList');
	await parserEvent.emit('getBalance');
	// await parserEvent.emit('pay');
	await parserEvent.emit('finish');
})




