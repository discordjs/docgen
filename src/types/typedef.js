const DocumentedItem = require('./item');
const DocumentedItemMeta = require('./item-meta');
const DocumentedVarType = require('./var-type');
const DocumentedParam = require('./param');

class DocumentedTypeDef extends DocumentedItem {
	registerMetaInfo(data) {
		data.meta = new DocumentedItemMeta(this, data.meta);
		data.type = new DocumentedVarType(this, data.type);
		if(data.properties) {
			if(data.properties.length > 0) {
				for(let i = 0; i < data.properties.length; i++) {
					data.properties[i] = new DocumentedParam(this, data.properties[i]);
				}
			} else {
				data.properties = undefined;
			}
		}
		this.directData = data;
	}

	serializer() {
		return {
			name: this.directData.name,
			description: this.directData.description,
			see: this.directData.see,
			access: this.directData.access,
			deprecated: this.directData.deprecated,
			type: this.directData.type.serialize(),
			props: this.directData.properties ? this.directData.properties.map(p => p.serialize()) : undefined,
			meta: this.directData.meta.serialize()
		};
	}
}

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

module.exports = DocumentedTypeDef;
