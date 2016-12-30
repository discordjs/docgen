const DocumentedItem = require('./item');
const DocumentedVarType = require('./var-type');

class DocumentedParam extends DocumentedItem {
	registerMetaInfo(data) {
		data.type = new DocumentedVarType(this, data.type);
		this.directData = data;
	}

	serializer() {
		return {
			name: this.directData.name,
			description: this.directData.description,
			optional: this.directData.optional,
			default: this.directData.defaultvalue,
			variable: this.directData.variable,
			nullable: this.directData.nullable,
			type: this.directData.type.serialize()
		};
	}
}

/*
{
    "type":{
        "names":[
          "Guild"
        ]
      },
      "description":"the roles after the update",
      "name":"newRoles"
    }
*/

module.exports = DocumentedParam;
