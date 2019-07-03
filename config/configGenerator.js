
const inquirer = require('inquirer');
const fs = require('fs');
const chalk = require('chalk');
const { exec } = require('child_process');
const art = require('../helpers').logArt;
const log = require('../helpers').logReactColors;
const pad = require('../helpers').whitespaceAdder;

// Inquirer functionality for generating config file
module.exports = {
	// str is a directory string. (Current directory)
	main: function (str) {
		fs.readFile(`${str}/package.json`, 'utf8', function (err, data) {
			if (err) {
				if (err.code === 'ENOENT') {
					inquirer
						.prompt([
							{
								message: 'No package file detected. You don\'t appear to be in a node folder. It\'s recommended to run the config script from your react project root. Create the src folders anyway and continue, or continue without creating?',
								name: 'confirm',
								type: 'list',
								choices: ["Create 'src' and continue", "Continue without creating", "Exit setup"]
							}
						])
						.then(ans => {
							if (ans.confirm === "Create 'src' and continue") {
								exec('mkdir -p ./src/Components && mkdir ./src/Pages', { cwd: str }, function (err, stdout, stdin) {
									log(pad(90));
									log(pad(` . . . Creating source folder . . . `));
									log(pad(90));
									log(pad(`Created`));
									log(pad(`- src`));
									log(pad(`   |_ Components`));
									log(pad(`   |_ Pages`));
									log(pad(90));
									initConfig(str);
								});
								art();
							}
							else if (ans.confirm === "Continue without creating") {
								art();
								initConfig(str);
							} else {
								process.exit(0);
							}
						});
				}
			}
			else {
				art();
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
				log(pad(err));
			}
			else {
				log(pad(90));
				log(pad(`Config file created successfully!`));
				log(pad(90));
				// Determine if React CLI is being run from a global or local install,
				// save the root if local is found
				let rcParent = __dirname.substring(0, __dirname.lastIndexOf('/'));
				rcParent = rcParent.substring(0, rcParent.lastIndexOf('/'));
				isLocalInstall(saveProjectRoot, { dir: rcParent, projectRoot: creationDir });
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

const isLocalInstall = (successCallback, optionsObj) => {
	const options = { ...optionsObj };
	const { dir } = options;

	exec('ls | grep node_modules', { cwd: dir }, function (error, stdout) {
		if (stdout.length !== 0) {
			// Node modules found! Look for package.json
			exec('ls | grep package.json', { cwd: dir }, function (error, stdout) {
				if (stdout.length !== 0) {
					// package.json found! It's a local install, save rootDir
					successCallback(optionsObj);
				}
				else if (error) {
					// log(pad(`Node modules found, but no package.json. Running global React-cli install`))
					return;
				} else {
					log(`Something very weird happened`);
				}
			});
		} else if (error) {
			// node_modules not found, go up a level and recurse
			options.dir = dir.substring(0, dir.lastIndexOf('/'));
			isLocalInstall(successCallback, options);
		} else {
			log('Something very weird happened');
		}
	});
}

const saveProjectRoot = options => {
	const conf = __dirname.substring(0, __dirname.lastIndexOf('/'));
	fs.readFile(`${conf}/.rcrc.json`, 'utf8', (err, data) => {
		if (err) throw err;
		const obj = JSON.parse(data);
		obj.projectRoot = options.projectRoot;
		fs.writeFile(`${conf}/.rcrc.json`, JSON.stringify(obj), (err) => {
			if (err) throw err;
		});
	});
}