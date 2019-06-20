
const inquirer = require('inquirer');
const fs = require('fs');
const chalk = require('chalk');
const log = console.log;

const art = fs.readFileSync(__dirname + '/../asciArt.txt', 'utf8');

// Inquirer functionality for generating config file
module.exports = {
	main: function (str) {
		fs.readFile(`${str} /package.json`, 'utf8', function (err, data) {
			if (err) {
				if (err.code === 'ENOENT') {
					inquirer
						.prompt([
							{
								message: 'No package file detected. You don\'t appear to be in a node folder. It\'s recommended to run React-cli from your react project root. Continue anyway?',
								name: 'confirm',
								type: 'list',
								choices: ["Yes", "No"]
							}
						])
						.then(ans => {
							if (ans.confirm === 'Yes') {
								initConfig();
							}
							else {
								process.exit(0);
							}
						});
				}
			}
			else {
				initConfig();
			}
		});
	}
};

const initConfig = () => {
	log(chalk.black.bgCyan(art));
	// console.log(asciArt);
}