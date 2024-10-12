const axios = require("axios")
const {availableCoins} = require('../../config/config')

async function GetRate(coinName, fiatName) {
	// let rateData;
	const coinNameForUrl = await getCoinApiName(coinName)
	const getRateUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${coinNameForUrl}&vs_currencies=${fiatName}`

	const data = await axios(getRateUrl)
		.then((res) => { return res.data })
		.catch((e) => { throw new Error(`Can't get a rate coz ${e.message}`) })

	// rateData = {
	// 	coinName: this.coinName,
	// 	fiatName: fiatName,
	// 	coinBalance: balance,
	// 	fiatValue: data[coinNameForUrl][fiatName]
	// }
	//
	// console.log("rate obj is -> ", rateData);
	// return rateData

	return data[coinNameForUrl][fiatName]
}

async function GetBalance(address) {
	let balance;
	const coinData = await axios(`https://blockchain.info/balance?active=${address}`)
		.then((res) => { return { balanceData: res.data, status: res.status }})
		.catch((e) => { throw new Error(`Can't get balance. Caught an error ${e.message}`)} )


	// console.log('coinData => ', coinData);
	const keysList = Object.keys(coinData.balanceData)
	for (let i = 0; i < keysList.length - 1; i++) {
		if (keysList[i] === this.address) {
			balance = keysList[0].final_balance
			break;
		}
	}

	console.log('received balance: ', balance);
	return Number(balance)
}

async function getCoinApiName(coin) {
	for (let i = 0; i <= availableCoins.length - 1; i++) {
	console.log('iter => ', availableCoins[i]);
	if (coin === availableCoins[i].coinName)
		return availableCoins[i].coinApiName
}
}

module.exports = {
	GetBalance,
	GetRate
}