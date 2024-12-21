"use strict";

const cluster = require("cluster");
const childProcess = require("node:child_process");
const { cpus } = require("node:os");
const { join } = require("node:path");
const { stdout, stderr } = require("node:process");

const { coinList } = require("./config/config.js");

function Bootstrap() {
  let clusterRange = coinList.length > cpus().length ? cpus().length : coinList.length;
  let workerPath = join(__dirname, `parser/workers/Worker.cjs`); // -> the main worker path

  console.log(cluster.isPrimary);

  if (cluster.isPrimary) {
    console.log("clasteryfy");
    for (let i = 0; i < clusterRange; i++) {
      cluster.fork(); // -> create a new cluster
      cluster.on("error", (err) => console.log(err.toString()));
      let worker = cluster.workers[i + 1]; // -> get the current cluster by id
      stdout.write("worker -> " + worker.state + "\n");

      worker
        .on("online", () => {
          // -> create a child process in the new cluster
          let child = childProcess.fork(workerPath);
          // child process events list
          child
            .on("message", (message) => {
              stdout.write(`got a message from <_ updateWorker ${worker.pid} _>: ` + message + "\n");
            })
            .on("error", (err) => console.log(err.toString()))
            .on("exit", (code) => {
              stdout.write(`process ${child.pid} done with code ` + code + "\n");
              child.kill("SIGINT");
              worker.disconnect();
            });

          child.send(coinList[i]);
        })
        .on("error", (err) => console.log(err.toString()))
        .on("exit", (code) => {
          stdout.write(`cluster with id ${worker.id} done with code ` + code + " \n");
          stdout.write("worker state -> " + worker.state + "\n");
        });
    }
  } else {
    // do some
    console.log("perform else  ");
  }
}

module.exports = Bootstrap;
