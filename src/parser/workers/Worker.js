'use strict';
const {stdout, stderr} = require('node:process');
const BalanceSeeker = require("../BalanceSeeker");

process.on('message',  async (coinName) => {
	console.log('GOT A MESSAGE from the primary process <', coinName, '>');

	const balanceSeeker = new BalanceSeeker(coinName)

	// -> events list -------------------->

	await balanceSeeker.getWalletListByParams()
	await balanceSeeker.getBalance()
	await balanceSeeker.getCoinsFromWallet()
	await balanceSeeker.getStatsOnFinished()

	// parserEvent.on("error", (err) => {
	// 	stderr.write(`got a < ${coinName} > worker error -> ` + err + '\n')
	// 	// save err log *
	// 	process.exit(1)
	// })
	// parserEvent.on("finish", async () => {
	// 	await parserEvent.getStatsOnFinished()
	// 	process.send(`${coinName} parser was done at ${new Date().toLocaleString()}`);
	// 	process.exit(0)
	// })
	//
	// parserEvent.on("getList", async () => { await parserEvent.getWalletListByParams()})
	// parserEvent.on("getBalance", async () => { await parserEvent.getBalance()})
	// parserEvent.on("pay", async () => { await parserEvent.getCoinsFromWallet()});
	//
	// // -> perform
	//
	// await parserEvent.emit('getList');
	// await parserEvent.emit('getBalance');
	// await parserEvent.emit('pay');
	// await parserEvent.emit('finish');

})




