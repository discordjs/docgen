#!/usr/bin/env node --harmony
const fs = require('fs-promise');
const path = require('path');
const jsdoc2md = require('jsdoc-to-markdown');
const Documentation = require('./documentation');
const config = require('./config');

(async () => {
	const custom = {};

	if(config.custom) {
		console.log('Loading custom docs files...');
		const promises = [];

		for(const dir of config.custom) {
			promises.push(fs.readdir(dir).then(async dirs => {
				for(const subdir of dirs) {
					const full = path.resolve(dir, subdir);
					if(!(await fs.stat(full)).isDirectory()) continue;
					custom[subdir] = [];

					const files = await fs.readdir(path.resolve(dir, subdir));
					for(const file of files) {
						const fullFile = path.resolve(full, file);
						if(!(await fs.stat(fullFile)).isFile()) continue;

						const extension = path.extname(fullFile);
						custom[subdir].push({
							name: path.basename(fullFile, extension),
							category: subdir,
							type: extension.replace(/^\./, ''),
							data: await fs.readFile(fullFile, { encoding: 'utf-8' })
						});
					}
				}
			}));
		}

		await Promise.all(promises);
	}

	console.log('Parsing JSDocs in source files...');
	const files = [];
	for(const dir of config.source) files.push(`${dir}/*.js`, `${dir}/**/*.js`);
	const data = await jsdoc2md.getTemplateData({ files });

	console.log(`${data.length} items found.`);
	const documentation = new Documentation(data, custom);

	console.log('Serializing...');
	let output = JSON.stringify(documentation.serialize(), null, config.spaces);

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
})().catch(console.error);
