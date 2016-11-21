const DocumentedItem = require('./item');
const DocumentedItemMeta = require('./item-meta');
const DocumentedVarType = require('./var-type');
const DocumentedParam = require('./param');

/*
{ id: 'StringResolvable',
  longname: 'StringResolvable',
  name: 'StringResolvable',
  scope: 'global',
  kind: 'typedef',
  description: 'Data that can be resolved to give a String...',
  type: { names: [ 'String', 'Array', 'Object' ] },
  meta:
   { lineno: 142,
     filename: 'ClientDataResolver.js',
     path: 'src/client' },
  order: 37 }
*/

class DocumentedTypeDef extends DocumentedItem {
	registerMetaInfo(data) {
		super.registerMetaInfo(data);
		this.props = new Map();
		this.directData = data;
		this.directData.meta = new DocumentedItemMeta(this, data.meta);
		this.directData.type = new DocumentedVarType(this, data.type);
		data.properties = data.properties || [];
		for(const prop of data.properties) this.props.set(prop.name, new DocumentedParam(this, prop));
	}

	serialize() {
		super.serialize();
		const { name, description, type, access, meta } = this.directData;
		const serialized = {
			name,
			description,
			type: type.serialize(),
			access,
			meta: meta.serialize()
		};
		serialized.properties = Array.from(this.props.values()).map(p => p.serialize());
		return serialized;
	}
}

module.exports = DocumentedTypeDef;
