#!/usr/bin/env node --harmony
const fs = require('fs-promise');
const path = require('path');
const jsdoc2md = require('jsdoc-to-markdown');
const Documentation = require('./documentation');
const config = require('./config');

const mainPromises = [null, null];

// Parse the JSDocs in all source directories
console.log('Parsing JSDocs in source files...');
const files = [];
for(const dir of config.source) files.push(`${dir}/*.js`, `${dir}/**/*.js`);
mainPromises[0] = jsdoc2md.getTemplateData({ files });

// Load the custom docs files
if(config.custom) {
	console.log('Loading custom docs files...');
	const walkPromises = [];
	const custom = {};

	for(let dir of config.custom) {
		dir = path.resolve(dir);
		walkPromises.push(fs.walk(dir, {
			filter: item => {
				// Make sure we're only going one level deep
				const sepMatches = path.relative(dir, item).match(/\/|\\/g);
				return !sepMatches || sepMatches.length === 1;
			}
		}).then(items => {
			const readPromises = [];

			for(const item of items) {
				// Ensure we're loading a file, and the file isn't in the base directory
				if(!item.stats.isFile()) continue;
				const dirname = path.dirname(item.path);
				if(dirname === dir) continue;

				// Read the file and add an entry for it
				readPromises.push(fs.readFile(item.path, { encoding: 'utf-8' }).then(content => {
					const dirBasename = path.basename(dirname);
					if(!custom[dirBasename]) custom[dirBasename] = [];

					const extension = path.extname(item.path);
					custom[dirBasename].push({
						name: path.basename(item.path, extension),
						type: extension.replace(/^\./, ''),
						content
					});

					if(config.verbose) console.log(`Loaded custom docs file ${item.path}`);
				}));
			}

			return Promise.all(readPromises);
		}));
	}

	mainPromises[1] = Promise.all(walkPromises).then(() => custom);
}

Promise.all(mainPromises).then(results => {
	const data = results[0];
	const custom = results[1];

	console.log(`${data.length} JSDoc items found.`);
	const fileCount = Object.values(custom).reduce((prev, c) => prev + c.length, 0);
	const categoryCount = Object.keys(custom).length;
	console.log(`${fileCount} custom docs files found in ${categoryCount} categor${categoryCount !== 1 ? 'ies' : 'y'}.`);

	console.log('Serializing...');
	const docs = new Documentation(data, custom);
	let output = JSON.stringify(docs.serialize(), null, config.spaces);

	if(config.compress) {
		console.log('Compressing...');
		output = require('zlib').deflateSync(output).toString('utf8');
	}

	if(config.output) {
		console.log(`Writing to ${config.output}...`);
		fs.writeFileSync(config.output, output);
	}

	console.log('Done!');
	process.exit(0);
}).catch(console.error);
