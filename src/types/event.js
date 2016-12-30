const DocumentedItem = require('./item');
const DocumentedItemMeta = require('./item-meta');
const DocumentedParam = require('./param');

class DocumentedEvent extends DocumentedItem {
	registerMetaInfo(data) {
		data.meta = new DocumentedItemMeta(this, data.meta);
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
			deprecated: this.directData.deprecated,
			params: this.directData.params ? this.directData.params.map(p => p.serialize()) : undefined,
			meta: this.directData.meta.serialize()
		};
	}
}

/*
{
  "id":"Client#event:guildMemberRolesUpdate",
  "longname":"Client#event:guildMemberRolesUpdate",
  "name":"guildMemberRolesUpdate",
  "scope":"instance",
  "kind":"event",
  "description":"Emitted whenever a Guild Member's Roles change - i.e. new role or removed role",
  "memberof":"Client",
  "params":[
    {
      "type":{
        "names":[
          "Guild"
        ]
      },
      "description":"the guild that the update affects",
      "name":"guild"
    },
    {
      "type":{
        "names":[
          "Array.<Role>"
        ]
      },
      "description":"the roles before the update",
      "name":"oldRoles"
    },
    {
      "type":{
        "names":[
          "Guild"
        ]
      },
      "description":"the roles after the update",
      "name":"newRoles"
    }
  ],
  "meta":{
    "lineno":91,
    "filename":"Guild.js",
    "path":"src/structures"
  },
  "order":110
}
*/

module.exports = DocumentedEvent;
