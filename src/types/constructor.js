const DocumentedItem = require('./item');
const DocumentedParam = require('./param');

class DocumentedConstructor extends DocumentedItem {
	registerMetaInfo(data) {
		if(data.params) {
			if(data.params.length > 0) {
				for(let i = 0; i < data.params.length; i++) data.params[i] = new DocumentedParam(this, data.params[i]);
			} else {
				data.params = undefined;
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
			params: this.directData.params ? this.directData.params.map(p => p.serialize()) : undefined
		};
	}
}

/*
{ id: 'Client()',
  longname: 'Client',
  name: 'Client',
  kind: 'constructor',
  description: 'Creates an instance of Client.',
  memberof: 'Client',
  params:
   [ { type: [Object],
       optional: true,
       description: 'options to pass to the client',
       name: 'options' } ],
  order: 10 }
*/

module.exports = DocumentedConstructor;
