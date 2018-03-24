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
		if(data.params) {
			if(data.params.length > 0) {
				for(let i = 0; i < data.params.length; i++) data.params[i] = new DocumentedParam(this, data.params[i]);
			} else {
				data.params = undefined;
			}
		}
		if(data.returns) {
			let returnDescription;
			let returnNullable;
			if(data.returns[0].description) returnDescription = data.returns[0].description;
			if(data.returns[0].nullable) returnNullable = true;
			data.returns = new DocumentedVarType(this, data.returns[0].type);
			data.returns.directData.description = returnDescription;
			data.returns.directData.nullable = returnNullable;
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
			params: this.directData.params ? this.directData.params.map(p => p.serialize()) : undefined,
			returns: this.directData.returns ? this.directData.returns.serialize() : undefined,
			returnsDescription: this.directData.returnsDescription,
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
