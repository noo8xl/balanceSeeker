'use strict';
const express = require('express');
const http = require('http');
const fs = require('fs');
const { join } = require('path');
const Bootstrap = require("./src/services/parser/Run");

const config = require('./src/config');

const app = express();
const path = join(__dirname, '/src/logs/errorLogger.txt')
const writer = fs.createReadStream(path, 'utf-8');

const server = http.createServer(app);

server.listen(config.port, config.host, () => {
	console.log(`Parser listening on  http://${config.host}:${config.port}/`)
	Bootstrap();
})
	.on('error', (err) => {
		writer
			.on('error', err => {
				console.error('got an error ', err);
			})
			.on('end', () => {
				console.log(`error log was saved to ${path}`)
			})
	})

