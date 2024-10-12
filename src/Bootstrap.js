const cluster = require("node:cluster")
const childProcess = require("node:child_process");
const {cpus} = require("node:os");
const {join} = require("node:path");
const {stdout, stderr} = require("node:process");

const coinList = require('./config/config')

function Bootstrap() {

	let clusterRange = coinList.length > cpus().length ? cpus().length : coinList.length
	let workerPath = join(__dirname, `workers/Worker.js`) 	// -> the main worker path

	if(cluster.isPrimary) {

		for (let i = 0; i < clusterRange; i++) {

			cluster.fork()  // -> create a new cluster
			let worker = cluster.workers[i+1]   // -> get the current cluster by id
			// stdout.write('worker -> ' + worker.state + '\n')

			worker
				.on('online', () => {
					let child = childProcess.fork(workerPath) // -> create a child process in the new cluster
					// child process events list
					child
						.on("message", message => {
							stdout.write('got a message: ' + message + '\n')
						})
						.on("error", err => {
							stderr.write(err.toString())
							process.exit(1)
						})
						.on("exit", code => {
							stdout.write(`process ${child.pid} done with code ` + code + '\n')
							child.kill('SIGINT')
							worker.disconnect()
						})

					child.send(coinList[i])
				})
				.on('error', err => {
					stderr.write(err.toString())
					process.exit(1)
				})
				.on('exit', code => {
					stdout.write(`cluster with id ${worker.id} done with code ` + code + ' \n')
					stdout.write('worker state -> ' + worker.state + '\n')
				})
		}
	} else {
		// do some
	}
}

module.exports = Bootstrap