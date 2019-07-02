
const inquirer = require('inquirer');
const fs = require('fs');
const chalk = require('chalk');
const log = console.log;
const { exec } = require('child_process');

const art = fs.readFileSync(__dirname + '/../asciiArt.txt', 'utf8');

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
								message: 'No package file detected. You don\'t appear to be in a node folder. It\'s recommended to run React-cli from your react project root. Create the src folders and continue, or continue without creating?',
								name: 'confirm',
								type: 'list',
								choices: ["Create 'src' and continue", "Continue without creating", "Exit setup"]
							}
						])
						.then(ans => {
							if (ans.confirm === "Create 'src' and continue") {
								const mkdir = exec('mkdir -p ./src/Components && mkdir ./src/Pages', { cwd: str }, function (err, stdout, stdin) {
									reactLogger(whitespaceAdder(null, 90));
									reactLogger(` . . . Creating source folder . . . `);
									reactLogger(whitespaceAdder(null, 90));
									reactLogger(`Created`);
									reactLogger(`- src`);
									reactLogger(`   |_ Components`);
									reactLogger(`   |_ Pages`);
									reactLogger(whitespaceAdder(null, 90));
									initConfig(str);
								});
								logArt();
							}
							else if (ans.confirm === "Continue without creating") {
								reactLogger(whitespaceAdder(null, 90));
								initConfig(str);
							} else {
								process.exit(0);
							}
						});
				}
			}
			else {
				logArt();
				initConfig(str);
			}
		});
	}
};

const initConfig = creationDir => {
	inquirer.prompt([
		{
			message: `\nWelcome to React-CLI. We will ask you a few questions about your project workflow to generate a custom config and make component generation quick and easy. The config can always be superseded by command line arguments.\n\nWhat is the path to your component folder?`,
			name: "componentDirPath",
			type: 'input',
			default: "./src/Components"
		},
		{
			message: `What is the path to your pages / frontend routes folder?`,
			name: "pageDirPath",
			type: 'input',
			default: "./src/Pages"
		},
		{
			message: `What is your default file extension?`,
			name: "suffix",
			type: 'input',
			default: "jsx"
		},
		{
			message: `Do you want to create Class or Functional components by default?`,
			name: "componentType",
			type: 'list',
			choices: ["functional", "class"]
		},
		{
			message: `What type of component export pattern do you want to use by default? (Enter \`rc help\` to read more about this)`,
			name: "exportType",
			type: 'list',
			choices: ["default", "wildcard"]
		},
		{
			message: `Do you want React-CLI to automatically convert your component names to Pascale case? Ex. imgCard -> ImgCard`,
			name: "casingFix",
			type: 'list',
			choices: ["true", "false"]
		},
		{
			message: `Do you follow a containerized component pattern?`,
			name: "containerize",
			type: 'list',
			choices: ["false", "true"]
		},
		{
			message: `Do you want Class components to be created with state by default?`,
			name: "classStateful",
			type: 'list',
			choices: ["true", "false"]
		},
		{
			message: `Do you want Functional components to be created with state hooks by default?`,
			name: "functionHooks",
			type: 'list',
			choices: ["false", "true"]
		},
		{
			message: `When providing 2 component names do you want React-CLI to create the necessary parent folder if it doesn't exist, and nest the child inside it? (Otherwise an error will be thrown) Ex. \`rc gc PhotoCard PhotoContainer\` will create 'PhotoContainer' if it doesn't already exist, and create 'PhotoCard' component inside`,
			name: "nest",
			type: 'list',
			choices: ["false", "true"]
		}
	]).then(ans => {
		const contents = convertObjToStrictJson(ans, creationDir);
		fs.writeFile(`${creationDir}/.rcrc.json`, contents, err => {
			if (err) {
				reactLogger(err);
			}
			else {
				reactLogger(whitespaceAdder(null, 90));
				reactLogger(`Config file created successfully!`);
				reactLogger(whitespaceAdder(null, 90));
			}
		});
	}).catch(err => { throw err });
}

// Convert the output from inquirer to JSON (double quote keys and values)
const convertObjToStrictJson = (obj, root) => {
	const keys = Object.keys(obj);
	const vals = Object.values(obj);
	let JsonObj = `{\n`;
	keys.forEach((key, i) => {
		JsonObj = JsonObj + '"' + key + '":"' + vals[i] + `",\n`;
	});
	return JsonObj + `"projectRoot":"${root}"\n}`;
}

// Add whitespace to a line to pad out terminal colors
const whitespaceAdder = (str, num) => {
	if (num) {
		return new Array(num).join(` `);
	} else {
		const len = str.length > 90 ? 0 : 90 - str.length;
		return str + new Array(len).join(` `);
	}
}

// Display the ascii art
const logArt = () => {
	reactLogger(art);
}

const reactLogger = input => {
	// #64DAFB -> React blue, #292C34 react dark grey
	log(chalk.hex('#64DAFB').bgHex('#292C34')(whitespaceAdder(input)));
}