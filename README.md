# react-cli
A flexible set of command line tools which mimics Angular's component generation functionality for some common React design patterns.

## `rc <command> <options> <name>`

- command: ['gc', 'gp', 'help' | '--help' | '-h', 'config', 'version' | '--version' | '-v' ]
	- gc <options> <name>: Generate a component following command line options and falling back to defaults
	- gp <options> <name>: Generate a page component following command line arguments, and falling back to defaults
	- help: Print this help documentation
	- config: Answer a set of questions in order to generate a custom config file for your specific workflow
	- version: Print the installed version of React-cli

- options: 
	- -o <output directory>: Specifies directory to write to. Default: ./src/components | ./src/pages respectively
	- -s <suffix>: Specify the suffix to use for files. Default: 'jsx'
	- -t <type>: Specify the componentType
	- -e <type>: Specify the exportType: 
		Default: 
		```
		// index.js
		export { default } from './Component';
		```
		Wildcard: (more useful for named exports, TS)
		```
		// index.js
		export * from './Component';
		```
	- -c : Instructs to containerize the component
	- -n : Instructs to nest component in existing component folder. Requires parent folder name after component name, for example `rc gc -n Brand Header` will generate a 'Brand' subcomponent of existing 'Header' component


## Config options:

- componentDirPath: The relative path from your root to the folder where your components reside

- pageDirPath: The relative path to the directory where your page components reside. May be called 'routes'; whatever you call the folder which holds your frontend routes.

- suffix: 'js' | 'jsx' | 'ts' | 'tsx' : The file type you want generated

- componentType: 'functional' | 'class' : Class components will be stateful by default, and functional components stateless

- exportType: 'default' | 'wildcard' : Define how your component's index.js exports your component's exports. Default results in `export { default } from './<ComponentName>';` and wildcard results in `export * from './<ComponentName>'`

- casingFix: true | false : If true, component names will be converted to uppercase if lowercase

- containerize: true | false : If true, a stateful (container) parent component will be created which renders a stateless (presentational) component child

- classStateful: Default true. Whether or not to generate state in your class component

- functionHooks: Default false. Whether or not to generate hook code in your functional component

- nest: Default false. If true the component will be generated as a child of an existing component