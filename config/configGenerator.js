
const inquirer = require('inquirer');
const fs = require('fs');
const chalk = require('chalk');
const log = console.log;
const { exec } = require('child_process');

const art = fs.readFileSync(__dirname + '/../asciArt.txt', 'utf8');

// Inquirer functionality for generating config file
module.exports = {
	// str is a directory string. (Usually current directory)
	main: function (str) {
		fs.readFile(`${str}/package.json`, 'utf8', function (err, data) {
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
								const mkdir = exec('mkdir -p ./src/Components && mkdir ./src/Pages', { cwd: str }, function (err, stdout, stdin) {
									cyanLogger(`\n . . . Creating source folder . . . \n`);
									cyanLogger(`Created                             \n- src                               \n   |_ Components                    \n   |_ Pages                         \n                                    `)
								});
								mkdir.on('exit', function (code) {
									// exit code is code
								});
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
	cyanLogger(art);
	// console.log(asciArt);
}

const cyanLogger = input => {
	log(chalk.black.bgCyan(input));
}