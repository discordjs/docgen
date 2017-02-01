const path = require('path');
const DocumentedClass = require('./types/class');
const DocumentedInterface = require('./types/interface');
const DocumentedTypeDef = require('./types/typedef');
const DocumentedConstructor = require('./types/constructor');
const DocumentedMember = require('./types/member');
const DocumentedFunction = require('./types/function');
const DocumentedEvent = require('./types/event');
const DocumentedExternal = require('./types/external');
const version = require('../package').version;

/**
 * Class that does stuff
 */
class Documentation {
	constructor(items, custom) {
		this.rootTypes = {
			class: [DocumentedClass, 'classes'],
			interface: [DocumentedInterface, 'interfaces'],
			typedef: [DocumentedTypeDef, 'typedefs'],
			external: [DocumentedExternal, 'externals']
		};

		this.childTypes = {
			'constructor': DocumentedConstructor, // eslint-disable-line quote-props
			member: DocumentedMember,
			function: DocumentedFunction,
			event: DocumentedEvent
		};

		for(const type in this.rootTypes) this[this.rootTypes[type][1]] = new Map();
		this.custom = custom;
		this.parse(items);
	}

	registerRoots(items) {
		let i = 0;
		while(i < items.length) {
			const item = items[i];
			if(this.rootTypes[item.kind] instanceof Array) {
				const [Type, key] = this.rootTypes[item.kind];
				this[key].set(item.name, new Type(this, item));
				items.splice(i, 1);
			} else {
				++i;
			}
		}
	}

	findParent(item) {
		if(this.childTypes[item.kind]) {
			for(const type in this.rootTypes) {
				const parent = this[this.rootTypes[type][1]].get(item.memberof);
				if(parent) return parent;
			}
		}

		return null;
	}

	parse(items) {
		this.registerRoots(items);

		for(const member of items) {
			let item;
			if(this.childTypes[member.kind]) item = new this.childTypes[member.kind](this, member);
			else console.warn(`- Unknown documentation kind "${item.kind}" - \n${JSON.stringify(item)}\n`);

			const parent = this.findParent(member);
			if(parent) {
				parent.add(item);
				continue;
			}

			const name = member.name || (member.directData ? member.directData.name : 'UNKNOWN');
			let info = [];

			const memberof = member.memberof || (member.directData ? member.directData.memberof : null);
			if(memberof) info.push(`member of "${memberof}"`);

			const meta = member.meta ? member.meta.directData : member.directData && member.directData.meta ? {
				path: member.directData.meta.path,
				file: member.directData.meta.file || member.directData.meta.filename,
				line: member.directData.meta.line || member.directData.meta.lineno
			} : null;
			if(meta) info.push(`${path.join(meta.path, meta.file)}${meta.line ? `:${meta.line}` : ''}`);

			info = info.length > 0 ? ` (${info.join(', ')})` : '';
			console.warn(`- "${name}"${info} has no accessible parent.`);
			if(!name && info.length === 0) console.warn('Raw object:', member);
		}
	}

	serialize() {
		const meta = {
			generator: version,
			format: this.constructor.FORMAT_VERSION,
			date: Date.now()
		};

		const serialized = {
			meta,
			custom: this.custom
		};

		for(const type in this.rootTypes) {
			const key = this.rootTypes[type][1];
			serialized[key] = Array.from(this[key].values()).map(i => i.serialize());
		}

		return serialized;
	}

	static get FORMAT_VERSION() {
		return 19;
	}
}

module.exports = Documentation;
