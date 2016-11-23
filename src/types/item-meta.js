const DocumentedItem = require('./item');

const cwd = `${process.cwd()}\\`.replace(/\\/g, '/');

class DocumentedItemMeta extends DocumentedItem {
	registerMetaInfo(data) {
		this.directData = {
			line: data.lineno,
			file: data.filename,
			path: data.path.replace(/\\/g, '/').replace(cwd, '')
		};
	}

	serialize() {
		return {
			line: this.directData.line,
			file: this.directData.file,
			path: this.directData.path
		};
	}
}

/*
   { lineno: 7,
     filename: 'VoiceChannel.js',
     path: 'src/structures' },
*/

module.exports = DocumentedItemMeta;
