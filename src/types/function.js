const DocumentedItem = require('./item');
const DocumentedItemMeta = require('./item-meta');
const DocumentedVarType = require('./var-type');
const DocumentedParam = require('./param');

/*
{
  "id":"ClientUser#sendTTSMessage",
  "longname":"ClientUser#sendTTSMessage",
  "name":"sendTTSMessage",
  "scope":"instance",
  "kind":"function",
  "inherits":"User#sendTTSMessage",
  "inherited":true,
  "implements":[
    "TextBasedChannel#sendTTSMessage"
  ],
  "description":"Send a text-to-speech message to this channel",
  "memberof":"ClientUser",
  "params":[
    {
      "type":{
        "names":[
          "String"
        ]
      },
      "description":"the content to send",
      "name":"content"
    }
  ],
  "examples":[
    "// send a TTS message..."
  ],
  "returns":[
    {
      "type":{
        "names":[
          "Promise.<Message>"
        ]
      }
    }
  ],
  "meta":{
    "lineno":38,
    "filename":"TextBasedChannel.js",
    "path":src/structures/interface"
  },
  "order":293
}
  */

class DocumentedFunction extends DocumentedItem {
	registerMetaInfo(data) {
		super.registerMetaInfo(data);
		this.directData = data;
		this.directData.meta = new DocumentedItemMeta(this, data.meta);
		this.directData.returns = new DocumentedVarType(this, data.returns ? data.returns[0].type : { names: ['void'] });
		const newParams = [];
		for(const param of data.params) newParams.push(new DocumentedParam(this, param));
		this.directData.params = newParams;
	}

	serialize() {
		super.serialize();
		const { name, description, examples, inherits, inherited, meta, returns, params, access, scope } = this.directData;
		const serialized = {
			access,
			name,
			description,
			examples,
			inherits,
			inherited,
			implements: this.directData.implements,
			scope: scope !== 'instance' ? scope : undefined,
			meta: meta.serialize(),
			returns: returns.serialize(),
			params: params.map(p => p.serialize())
		};
		return serialized;
	}
}

module.exports = DocumentedFunction;
