const cluster = require("node:cluster")
const childProcess = require("node:child_process");
const {join} = require("node:path");

const {coinList} = require('../../config')

function Bootstrap() {

	// wor
	let workerPath = join(__dirname, `Worker.js`);

	if(cluster.isPrimary) {

		for (let i = 0; i < coinList.length; i++) {
			// create a new cluster
			cluster.fork();
			// get the current cluster by id
			let worker = cluster.workers[i+1]

			worker
				.on('online', () => {
					// create a child process in the new cluster
					let cp = childProcess.fork(workerPath)

					// child process events list
					cp
					.on("message", message => console.log(message))
					.on("error", err => console.log(err))
					.on("exit", code => console.log('done with code', code))

					cp.send(coinList[i])
				})
				.on('error', err => console.log(err))
				.on('exit', code => console.log('done with code', code))


		}
	} else {

	}
}

module.exports = Bootstrap