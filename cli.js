#!/usr/bin/env node

const fs = require('fs');
const args = process.argv.slice(2);
// Assumes this is your client folder; aka 'view' root
const execDir = process.cwd();

let config = {};

// Look for a user config, if not found load defaults
fs.readFile(`${execDir}/.rc.config.json`, 'utf8', (err, data) => {
	if (err && err.code === 'ENOENT') {
		console.log(`Loading default configuration...\n`);
		fs.readFile(`${__dirname}/.rc.config.json`, 'utf8', (err, data) => {
			if (err) {
				console.log(`Error loading default configuration...`, err);
			}
			config = JSON.parse(data);
			console.log(config);
		});
	}
	else if (!err) {
		console.log(`Loading user defined configuration... \n`);
		config = JSON.parse(data);
		console.log(config);
	}
});
