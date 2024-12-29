const axios = require("axios");
const { availableCoins } = require("../../config/config");

async function GetRate(coinName, fiatName) {
  // let rateData;
  const coinNameForUrl = await getCoinApiName(coinName);
  const getRateUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${coinNameForUrl}&vs_currencies=${fiatName}`;

  const data = await axios(getRateUrl)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      throw new Error(`Can't get a rate coz ${e.message}`);
    });
  return data[coinNameForUrl][fiatName];
}

async function getCoinApiName(coin) {
  for (let i = 0; i <= availableCoins.length - 1; i++) {
    // console.log("iter => ", availableCoins[i]);
    if (coin === availableCoins[i].coinName) return availableCoins[i].coinApiName;
  }
}

module.exports = GetRate;
