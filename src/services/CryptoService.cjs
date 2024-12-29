const { receiverAddressList } = require("../config/config");

class CryptoService {
  #coinName;

  constructor(coinName) {
    this.#coinName = coinName;
  }

  async getBalance(address, fiatName) {
    let cmd = await this.#command(["gb", this.#coinName, address, fiatName]);
    let arr = cmd.split(" ");

    let result = {
      coinName: arr[0],
      coinBalance: Number(arr[1]),
      currencyType: arr[2],
      fiatValue: Number(arr[3]),
    };

    console.log("cmd result is  -> ", result);
    return;
  }

  // item representation is :
  //   { address: "bc1qmvr0tpqtz7yk3g9rfhl02tfdp2r60csg3q3yq5", amount: 0.0 },
  async sendTransaction(item) {
    console.log("sendTransaction called with -> ", item);
    let addressTo = await this.#getAnAddressToSend();
    // let response = await this.#command([
    //   "tsx",
    //   this.#coinName,
    //   item.address,
    //   addressTo,
    //   item.amount.toString(),
    // ]);
    // console.log("send tsx resp is => ", response);
    // return;
  }

  async #command(args) {
    let result = "";
    let child = spawn(this.CMD, args);

    child.stdout.pipe(process.stdout);
    child.stdout.on("data", (chunk) => {
      result += chunk.toString();
    });

    child.on("error", (err) => {
      console.error("child error");
      console.log("err is -> ", err);
      process.exit(1);
    });

    return new Promise((resolve) => {
      child.on("exit", (code) => {
        console.log("exit with ", code);
        resolve(result);
      });
    });
  }

  async #getAnAddressToSend() {
    for (let i = 0; i <= receiverAddressList.length; i++)
      if (receiverAddressList[i].coinName === this.#coinName) return receiverAddressList[i].address;
  }
}

module.exports = CryptoService;
