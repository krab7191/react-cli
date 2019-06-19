#!/usr/bin/env node

const fs = require('fs');
const args = process.argv.slice(2);
// Assumes this is your client folder; aka 'view' root
const execDir = process.cwd();

let config = {};

console.log(`Welcome to React CLI!\nLoading configs...\n`);

// Look for a user config, if not found load defaults
fs.readFile(`${execDir}/.rc.config.json`, 'utf8', (err, data) => {
	if (err && err.code === 'ENOENT') {
		console.log(`Default configuration...\n`);
		fs.readFile(`${__dirname}/.rc.config.json`, 'utf8', (err, data) => {
			if (err) {
				console.log(`Error loading default configuration...`, err);
			}
			config = JSON.parse(data);
			main();
		});
	}
	else if (!err) {
		console.log(`User defined configuration... \n`);
		config = JSON.parse(data);
		main();
	}
});

const main = () => {
	console.log(config, `\n`);
	if (args[0]) {
		switch (args[0]) {
			case 'g':
				console.log('Generate invoked...');
				break;

			default:
				console.log(`Unknown command ${args[0]}`);
				break;
		}
	}
	else {
		console.log('Please specify a command to run.');
	}
}
