'use strict';

// const {coinList} = require("../../../config");

// Example worker file (e.g., coin1.worker.js)
process.on('message', (msg) => {
	console.log(`Worker received: ${msg.msg}`); // Log the message received from the master
});

// Simulate some work in the worker
setTimeout(() => {
	process.send({ msg: "Finished work in worker!" }); // Send a message back to the master
}, 2000); // Adjust the timeout as needed