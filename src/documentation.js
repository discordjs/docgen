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
		this.knownRootKinds = new Set(['class', 'interface', 'typedef', 'external']);
		this.knownChildKinds = new Set(['constructor', 'member', 'function', 'event']);

		this.classes = new Map();
		this.interfaces = new Map();
		this.typedefs = new Map();
		this.externals = new Map();
		this.custom = custom;
		this.parse(items);
	}

	registerRoots(data) {
		for(const item of data) {
			switch(item.kind) {
				case 'class':
					this.classes.set(item.name, new DocumentedClass(this, item));
					break;
				case 'interface':
					this.interfaces.set(item.name, new DocumentedInterface(this, item));
					break;
				case 'typedef':
					this.typedefs.set(item.name, new DocumentedTypeDef(this, item));
					break;
				case 'external':
					this.externals.set(item.name, new DocumentedExternal(this, item));
					break;
				default:
					break;
			}
		}
	}

	findParent(item) {
		if(this.knownChildKinds.has(item.kind)) {
			let val = this.classes.get(item.memberof);
			if(val) return val;
			val = this.interfaces.get(item.memberof);
			if(val) return val;
		}
		return null;
	}

	parse(items) {
		this.registerRoots(items.filter(item => this.knownRootKinds.has(item.kind)));
		const members = items.filter(item => !this.knownRootKinds.has(item.kind));
		const unknowns = new Map();

		for(const member of members) {
			let item;
			switch(member.kind) {
				case 'constructor':
					item = new DocumentedConstructor(this, member);
					break;
				case 'member':
					item = new DocumentedMember(this, member);
					break;
				case 'function':
					item = new DocumentedFunction(this, member);
					break;
				case 'event':
					item = new DocumentedEvent(this, member);
					break;
				case 'external':
					item = new DocumentedExternal(this, member);
					break;
				default:
					unknowns.set(member.kind, member);
					continue;
			}

			const parent = this.findParent(member);
			if(!parent) {
				let memberof = member.memberof || member.directData.memberof;
				if(memberof) memberof = ` (member of "${memberof}")`;
				console.warn(`- "${member.name || member.directData.name}"${memberof} has no accessible parent.`);
				continue;
			}
			parent.add(item);
		}
		for(const [key, val] of unknowns) {
			console.warn(`- Unknown documentation kind "${key}" - \n${JSON.stringify(val)}\n`);
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
			classes: Array.from(this.classes.values()).map(c => c.serialize()),
			interfaces: Array.from(this.interfaces.values()).map(i => i.serialize()),
			typedefs: Array.from(this.typedefs.values()).map(t => t.serialize()),
			externals: Array.from(this.externals.values()).map(e => e.serialize()),
			custom: this.custom
		};

		return serialized;
	}

	static get FORMAT_VERSION() {
		return 15;
	}
}

module.exports = Documentation;
