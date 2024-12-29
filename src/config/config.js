const coinList = ["btc", "eth", "trx", "ton"]; // , 'sol'
//const coinList = ["btc"];

const receiverAddressList = [
  { coinName: "btc", address: "address1" },
  { coinName: "eth", address: "address2" },
  { coinName: "trx", address: "address3" },
  { coinName: "ton", address: "address4" },
];

const availableCoins = [
  { coinName: "btc", coinApiName: "bitcoin" },
  { coinName: "eth", coinApiName: "ethereum" },
  { coinName: "trx", coinApiName: "tron" },
  { coinName: "ton", coinApiName: "the-open-network" },
];

module.exports = {
  coinList,
  availableCoins,
  receiverAddressList,
};
