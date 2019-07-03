
const chalk = require('chalk');
const log = console.log;
const fs = require('fs');

const logReactColors = input => {
	// #64DAFB -> React blue, #292C34 react dark grey
	log(chalk.hex('#64DAFB').bgHex('#292C34')(input));
}

// Add whitespace to a line to pad out terminal colors
const whitespaceAdder = (inp) => {
	if (typeof inp === `number`) {
		return new Array(inp).join(` `);
	} else if (typeof inp === `string`) {
		const len = inp.length > 90 ? 0 : 90 - inp.length;
		return inp + new Array(len).join(` `);
	} else {
		console.warn(`Can't add whitespace to a non-string or non-number value.`);
		return inp;
	}
}

// Display the ascii art
const logArt = () => {
	const art = fs.readFileSync(__dirname + '/asciiArt.txt', 'utf8');
	logReactColors(whitespaceAdder(art));
}

module.exports = {
	logReactColors: logReactColors,
	whitespaceAdder: whitespaceAdder,
	logArt: logArt
}