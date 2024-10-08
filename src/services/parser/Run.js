const cluster = require("node:cluster")
const childProcess = require("node:child_process");
const {cpus} = require("node:os");
const {join} = require("node:path");
const {stdout, stderr} = require("node:process");

const {coinList} = require('../../config')

function Bootstrap() {

	let clusterRange = coinList.length > cpus().length ? cpus().length : coinList.length
	let workerPath = join(__dirname, `Worker.js`) 	// -> the main worker path

	if(cluster.isPrimary) {

		for (let i = 0; i < clusterRange; i++) {

			cluster.fork()  // -> create a new cluster
			let worker = cluster.workers[i+1]   // -> get the current cluster by id
			worker
				.on('online', () => {
					let cp = childProcess.fork(workerPath) // -> create a child process in the new cluster

					// child process events list
					cp
					.on("message", message => {
						stdout.write('got a message: ' + message + '\n')
					})
					.on("error", err => {
						stderr.write(err.message)
						process.exit(1)
					})
					.on("exit", code => stderr.write('done with code' + code + '\n'))

					cp.send(coinList[i])
				})
				.on('error', err => {
					stderr.write(err.message)
					process.exit(1)
				})
				.on('exit', code => {
					stdout.write('done with code' + code + '\n')
				})


		}
	} else {
		// console.log('THE MAIN')
	}
}

module.exports = Bootstrap