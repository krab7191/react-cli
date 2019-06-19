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
		if (command === 'gc') {
			loadConfigs('c');
		} else if (command === 'gp') {
			loadConfigs('p');
		} else if (/^version$|^--version$|^-v$/i.test(command)) {
			displayVersion();
		} else if (/^help$|^--help$|^-h$/i.test(command)) {
			displayHelp();
		} else {
			console.log(`Unknown command '${args[0]}'`);
			console.log('Type \'rc help\' to display documentation');
		}
	}
	else {
		console.log('Please specify a command to run.');
		console.log('Type \'rc help\' to display documentation');
	}
}

const displayVersion = () => {
	fs.readFile(`${__dirname}/package.json`, 'utf8', function (err, data) {
		if (err) throw err;
		const { version } = JSON.parse(data);
		console.log(`\nReact-cli version ${version}\n`);
	});
}
const displayHelp = () => {
	fs.readFile(`${__dirname}/README.md`, 'utf8', function (err, data) {
		if (err) throw err;
		const api = data.substring(data.indexOf('## `rc <command> <options> <name>`'), data.indexOf('## Config options:') - 1);
		console.log(`\n${api}\n`);
	});
}

const generate = type => {
	console.log(`Generating ${type}`);
}

main();
