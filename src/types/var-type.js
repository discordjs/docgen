const DocumentedItem = require('./item');

class DocumentedVarType extends DocumentedItem {
	registerMetaInfo(data) {
		this.directData = data;
	}

	serializer() {
		const names = [];
		for(const name of this.directData.names) names.push(this.constructor.splitVarName(name));
		if(!this.directData.description && !this.directData.nullable) return names;
		return {
			types: names,
			description: this.directData.description,
			nullable: this.directData.nullable
		};
	}

	static splitVarName(str) {
		if(str === '*') return ['*'];
		str = str.replace(/\./g, '');
		const matches = str.match(/([\w*]+)([^\w*]+)/g);
		const output = [];
		if(matches) {
			for(const match of matches) {
				const groups = match.match(/([\w*]+)([^\w*]+)/);
				output.push([groups[1], groups[2]]);
			}
		} else {
			output.push([str.match(/([\w*]+)/g)[0]]);
		}
		return output;
	}
}

/*
{
  "names":[
    "String"
  ]
}
*/

module.exports = DocumentedVarType;
