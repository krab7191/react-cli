#!/usr/bin/env node

const fs = require('fs');
const args = process.argv.slice(2);
// Assumes this is your client folder; aka 'view' root
const execDir = process.cwd();

let config = {};

const loadConfigs = type => {
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
				generate(type);
			});
		}
		else if (!err) {
			console.log(`User defined configuration... \n`);
			config = JSON.parse(data);
			generate(type);
		}
	});

}

const main = () => {
	if (args[0]) {
		const command = args[0].toLowerCase();
		switch (command) {
			case 'gc':
				loadConfigs('c');
				break;
			case 'gp':
				loadConfigs('p');
				break;
			case 'version' || '--version' || '-v':
				displayVersion();
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

const displayVersion = () => {
	fs.readFile(`${__dirname}/package.json`, 'utf8', function (err, data) {
		if (err) throw err;
		const { version } = JSON.parse(data);
		console.log(`\nReact-cli version ${version}\n`);
	});
}

const generate = type => {
	console.log(`Generating ${type}`);
}

main();
