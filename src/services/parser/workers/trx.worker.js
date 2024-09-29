'use strict';

const coinName = 'trx';
// console.log(`${coinName} worker log -> `)
const parserEvent = require("../Parser");

parserEvent.emit('getList', coinName);
parserEvent.emit('getBalance');
parserEvent.emit('pay');
parserEvent.emit('finish')
process.send(`${coinName} parser was done at ${new Date().toLocaleString()}`);


