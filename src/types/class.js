const DocumentedItem = require('./item');
const DocumentedItemMeta = require('./item-meta');
const DocumentedConstructor = require('./constructor');
const DocumentedFunction = require('./function');
const DocumentedMember = require('./member');
const DocumentedEvent = require('./event');

class DocumentedClass extends DocumentedItem {
	constructor(docParent, data) {
		super(docParent, data);
		this.props = new Map();
		this.methods = new Map();
		this.events = new Map();
	}

	add(item) {
		if(item instanceof DocumentedConstructor) {
			if(this.construct) throw new Error(`Doc ${this.directData.name} already has constructor`);
			this.construct = item;
		} else if(item instanceof DocumentedFunction) {
			const prefix = item.directData.scope === 'static' ? 's-' : '';
			if(this.methods.has(prefix + item.directData.name)) {
				throw new Error(`Doc ${this.directData.name} already has method ${item.directData.name}`);
			}
			this.methods.set(prefix + item.directData.name, item);
		} else if(item instanceof DocumentedMember) {
			if(this.props.has(item.directData.name)) {
				throw new Error(`Doc ${this.directData.name} already has prop ${item.directData.name}`);
			}
			this.props.set(item.directData.name, item);
		} else if(item instanceof DocumentedEvent) {
			if(this.events.has(item.directData.name)) {
				throw new Error(`Doc ${this.directData.name} already has event ${item.directData.name}`);
			}
			this.events.set(item.directData.name, item);
		}
	}

	registerMetaInfo(data) {
		this.directData = data;
		this.directData.meta = new DocumentedItemMeta(this, data.meta);
	}

	serializer() {
		return {
			name: this.directData.name,
			description: this.directData.description,
			see: this.directData.see,
			extends: this.directData.augments,
			implements: this.directData.implements,
			access: this.directData.access,
			abstract: this.directData.virtual,
			deprecated: this.directData.deprecated,
			construct: this.construct ? this.construct.serialize() : undefined,
			props: this.props.size > 0 ? Array.from(this.props.values()).map(p => p.serialize()) : undefined,
			methods: this.methods.size > 0 ? Array.from(this.methods.values()).map(m => m.serialize()) : undefined,
			events: this.events.size > 0 ? Array.from(this.events.values()).map(e => e.serialize()) : undefined,
			meta: this.directData.meta.serialize()
		};
	}
}

/*
{ id: 'VoiceChannel',
	longname: 'VoiceChannel',
	name: 'VoiceChannel',
	scope: 'global',
	kind: 'class',
	augments: [ 'GuildChannel' ],
	description: 'Represents a Server Voice Channel on Discord.',
	meta:
	 { lineno: 7,
		 filename: 'VoiceChannel.js',
		 path: 'src/structures' },
	order: 232 }
*/

module.exports = DocumentedClass;
