
const log = require('../helpers').logReactColors;
const pad = require('../helpers').whitespaceAdder;

module.exports = function componentGenerator(type, args, config) {
	const path = type === 'c' ? config.componentDirPath : config.pageDirPath;
	const cName = type === 'c' ? 'component' : 'page';
	config.projectRoot.length !== 0 && log(pad(`Generating ${cName} at: ${config.projectRoot}${path}`));
	config.projectRoot.length === 0 && log(pad('No project root configured'));
}