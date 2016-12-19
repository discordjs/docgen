#!/usr/bin/env node
const fs = require('fs-promise');
const path = require('path');
const jsdoc2md = require('jsdoc-to-markdown');
const Documentation = require('./documentation');
const config = require('./config');

if(config.verbose) console.log('Running with config: ', config);
const mainPromises = [null, null];

// Parse the JSDocs in all source directories
console.log('Parsing JSDocs in source files...');
const files = [];
for(const dir of config.source) files.push(`${dir}/*.js`, `${dir}/**/*.js`);
mainPromises[0] = jsdoc2md.getTemplateData({ files, configure: config.jsdoc }).then(data => {
	console.log(`${data.length} JSDoc items parsed.`);
	return data;
});

// Load the custom docs
if(config.custom) {
	console.log('Loading custom docs files...');
	const customDir = path.dirname(config.custom);

	// Figure out what type of definitions file we're loading
	let type;
	const defExtension = path.extname(config.custom).toLowerCase();
	if(defExtension === '.json') type = 'json';
	else if(defExtension === '.yml' || defExtension === '.yaml') type = 'yaml';
	else throw new TypeError('Unknown custom docs definition file type.');

	mainPromises[1] = fs.readFile(config.custom, 'utf-8').then(defContent => {
		// Parse the definition file
		let definitions;
		if(type === 'json') definitions = JSON.parse(defContent);
		else definitions = require('js-yaml').safeLoad(defContent);

		const custom = {};
		const filePromises = [];

		for(const cat of definitions) {
			// Add the category to the custom docs
			const catID = cat.id || cat.name.toLowerCase();
			const dir = path.join(customDir, cat.path || catID);
			const category = {
				name: cat.name || cat.id,
				files: {}
			};
			custom[catID] = category;

			// Add every file in the category
			for(const file of cat.files) {
				const fileRootPath = path.join(dir, file.path);
				const extension = path.extname(file.path);
				const fileID = file.id || path.basename(file.path, extension);
				category.files[fileID] = null;

				filePromises.push(fs.readFile(fileRootPath, 'utf-8').then(content => {
					category.files[fileID] = {
						name: file.name,
						type: extension.toLowerCase().replace(/^\./, ''),
						content,
						path: path.relative(config.root, fileRootPath).replace(/\\/g, '/')
					};
					if(config.verbose) console.log(`Loaded custom docs file ${catID}/${fileID}`);
				}));
			}
		}

		return Promise.all(filePromises).then(() => {
			const fileCount = Object.keys(custom).map(k => Object.keys(custom[k])).reduce((prev, c) => prev + c.length, 0);
			const categoryCount = Object.keys(custom).length;
			console.log(
				`${fileCount} custom docs file${fileCount !== 1 ? 's' : ''} in ` +
				`${categoryCount} categor${categoryCount !== 1 ? 'ies' : 'y'} loaded.`
			);
			return custom;
		});
	});
}

Promise.all(mainPromises).then(results => {
	const data = results[0];
	const custom = results[1];

	console.log(`Serializing documentation with format version ${Documentation.FORMAT_VERSION}...`);
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
}).catch(err => {
	console.error(err);
	process.exit(1);
});
