#!/usr/bin/env node

const fs = require('fs');
const args = process.argv.slice(2);
// Assumes this is your client folder; aka 'view' root
const execDir = process.cwd();
// Import functionality for the 'config' command
const conf = require('./config/configGenerator');
// Terminal message helpers
const log = require('./helpers').logReactColors;
const pad = require('./helpers').whitespaceAdder;

const componentGenerator = require('./generators/componentGenerator');

const main = () => {
	if (args[0]) {
		const command = args[0].toLowerCase();
		if (command === 'gc') {
			loadConfigs('c');
		} else if (command === 'gp') {
			loadConfigs('p');
		} else if (command === 'config') {
			conf.main(execDir);
		} else if (/^version$|^--version$|^-v$/i.test(command)) {
			displayVersion();
		} else if (/^help$|^--help$|^-h$/i.test(command)) {
			displayHelp();
		} else {
			log(pad(`React-cli: command not found: ${args[0]}`));
			log(pad('Type \'rc help\' to display documentation'));
		}
	}
	else {
		log(pad('Please specify a command to run.'));
		log(pad('Type \'rc help\' to display documentation'));
	}
}

const loadConfigs = type => {
	log(pad(`Loading config...\n`));

	// Read config, look for project dir to find userConfig
	fs.readFile(`${__dirname}/.rcrc.json`, 'utf8', (err, data) => {
		if (err) {
			log(`Error loading default configuration...`)
			log(err);
			process.exit(0);
		}
		const { projectRoot } = JSON.parse(data);
		if (projectRoot.length !== 0) {
			// There's a project path, look for config
			fs.readFile(`${projectRoot}/.rcrc.json`, 'utf8', (err, conf) => {
				if (err && err.code === 'ENOENT') {
					componentGenerator(type, args, JSON.parse(data));
				} else {
					componentGenerator(type, args, JSON.parse(conf));
				}
			});
		} else {
			// No project root in config, try reading from execution dir (user created config file without running `rc config`)
			fs.readFile(`${execDir}/.rcrc.json`, 'utf8', (err, uConf) => {
				if (err && err.code === 'ENOENT') {
					componentGenerator(type, args, JSON.parse(data));
				} else {
					componentGenerator(type, args, JSON.parse(uConf));
				}
			});
		}
	});
}

const displayVersion = () => {
	fs.readFile(`${__dirname}/package.json`, 'utf8', function (err, data) {
		if (err) {
			log(err);
			log(pad(`ERR! The React CLI package is missing its package.json. This is not usual behavior. Try uninstalling and reinstalling the package.`));
		}
		log(pad(90));
		log(pad(`React-cli version ${JSON.parse(data).version}`));
		log(pad(90));
	});
}
const displayHelp = () => {
	fs.readFile(`${__dirname}/README.md`, 'utf8', function (err, data) {
		if (err) {
			log(pad(`ERR! No readme found.`));
		}
		const api = data.substring(data.indexOf('## `rc <command> <options> <name>`'), data.indexOf('## Config options:') - 1);
		log(pad(90));
		log(pad(api));
		log(pad(90));
	});
}



main();