const DocumentedItem = require('./item');
const DocumentedItemMeta = require('./item-meta');

class DocumentedExternal extends DocumentedItem {
	registerMetaInfo(data) {
		data.meta = new DocumentedItemMeta(this, data.meta);
		this.directData = data;
	}

	serializer() {
		return {
			name: this.directData.name,
			description: this.directData.description,
			see: this.directData.see,
			meta: this.directData.meta.serialize()
		};
	}
}

module.exports = DocumentedExternal;
