

const coinList = [
	'btc', 'eth', 'trx', 'ton'
] // , 'sol'

const availableCoins = [
	{ coinName: 'btc', coinApiName: 'bitcoin' },
	{ coinName: 'eth', coinApiName: 'ethereum' },
	{ coinName: 'trx', coinApiName: 'tron' },
	{ coinName: 'ton', coinApiName: 'the-open-network' },
	{ coinName: 'sol', coinApiName: 'solana' },
	// { coinName: 'bch', coinApiName: 'bitcoin-cash' },
	// { coinName: 'usdt', coinApiName: 'tether' },
	// { coinName: 'trx/usdt',coinApiName: 'tron' },
]

module.exports = {
	coinList,
	availableCoins,
}