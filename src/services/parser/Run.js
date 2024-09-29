const cluster = require("node:cluster")
const childProcess = require("node:child_process");
const {join} = require("node:path");

const {coinList} = require('../../config')

function Bootstrap() {

	if(cluster.isPrimary) {

		for (let i = 0; i < coinList.length; i++) {
			cluster.fork();
			let worker = cluster.workers[i+1]

			worker
				.on('online', () => {
					let cp = childProcess.fork(join(__dirname, `workers/${coinList[i]}.worker.js`))

					cp
					.on("message", message => console.log(message))
					.on("error", err => console.log(err))
					.on("exit", code => console.log('done with code', code))

				})
				.on('error', err => console.log(err))
				.on('exit', code => console.log('done with code', code))
		}
	} else {

	}
}

module.exports = Bootstrap