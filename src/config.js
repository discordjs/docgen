const yargs = require('yargs');
const { version, homepage } = require('../package');

module.exports = yargs
	.usage('$0 [command] [options]')
	.example('$0 --source src --custom docs --output docs/docs.json')
	.example('$0 --config docgen.yml', 'Runs the generator using a config file')
	.example('$0 completion', 'Outputs Bash completion script')
	.epilogue(`discord.js-docgen v${version} by Amish Shah (Hydrabolt) and Schuyler Cebulskie (Gawdl3y): ${homepage}`)

	.option('source', {
		type: 'array',
		alias: ['s', 'i'],
		describe: 'Source directories to parse JSDocs in',
		demand: true,
		normalize: true
	})
	.option('custom', {
		type: 'string',
		alias: 'c',
		describe: 'Custom docs definition file to use',
		normalize: true
	})
	.option('root', {
		type: 'string',
		alias: 'r',
		describe: 'Root directory of the project',
		normalize: true,
		default: '.'
	})
	.option('output', {
		type: 'string',
		alias: 'o',
		describe: 'Path to output file',
		normalize: true
	})
	.option('spaces', {
		type: 'number',
		alias: 'S',
		describe: 'Number of spaces to use in output JSON',
		default: 0
	})
	.option('jsdoc', {
		type: 'string',
		alias: 'j',
		describe: 'Path to JSDoc config file',
		normalize: true
	})
	.option('verbose', {
		type: 'boolean',
		alias: 'V',
		describe: 'Logs extra information to the console',
		default: false
	})

	.option('config', {
		type: 'string',
		alias: 'C',
		describe: 'Path to JSON/YAML config file',
		group: 'Special:',
		normalize: true,
		config: true,
		configParser: configFile => {
			const extension = require('path').extname(configFile).toLowerCase();
			if(extension === '.json') {
				return JSON.parse(require('fs').readFileSync(configFile));
			} else if(extension === '.yml' || extension === '.yaml') {
				return require('js-yaml').safeLoad(require('fs').readFileSync(configFile));
			}
			throw new Error('Unknown config file type.');
		}
	})

	.help()
	.alias('help', 'h')
	.group('help', 'Special:')
	.version(version)
	.alias('version', 'v')
	.group('version', 'Special:')
	.completion('completion')
	.wrap(yargs.terminalWidth())
.argv;
