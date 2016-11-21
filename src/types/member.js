const DocumentedItem = require('./item');
const DocumentedItemMeta = require('./item');
const DocumentedVarType = require('./var-type');
const DocumentedParam = require('./param');

/*
{ id: 'Client#rest',
  longname: 'Client#rest',
  name: 'rest',
  scope: 'instance',
  kind: 'member',
  description: 'The REST manager of the client',
  memberof: 'Client',
  type: { names: [ 'RESTManager' ] },
  access: 'private',
  meta:
   { lineno: 32,
     filename: 'Client.js',
     path: 'src/client' },
  order: 11 }
*/

class DocumentedMember extends DocumentedItem {
	registerMetaInfo(data) {
		super.registerMetaInfo(data);
		this.directData = data;
		this.directData.meta = new DocumentedItemMeta(this, data.meta);
		this.directData.type = new DocumentedVarType(this, data.type);
		if(data.properties) {
			const newProps = [];
			for(const param of data.properties) newProps.push(new DocumentedParam(this, param));
			this.directData.properties = newProps;
		} else {
			data.properties = [];
		}
	}

	serialize() {
		super.serialize();
		const { name, description, type, access, meta, properties, readonly, scope } = this.directData;
		return {
			name,
			description,
			access,
			readonly,
			scope: scope !== 'instance' ? scope : undefined,
			type: type.serialize(),
			meta: meta.serialize(),
			props: properties.map(p => p.serialize())
		};
	}
}

module.exports = DocumentedMember;
