class DocumentedItem {
	constructor(parent, info) {
		this.parent = parent;
		this.directData = null;

		try {
			this.registerMetaInfo(info);
		} catch(err) {
			err.message = `Error while loading ${this.detailedName(info)}: ${err.message}`;
			throw err;
		}
	}

	serialize() {
		try {
			return this.serializer();
		} catch(err) {
			err.message = `Error while serializing ${this.detailedName(this.directData)}: ${err.message}`;
			throw err;
		}
	}

	/* eslint-disable no-empty-function */
	registerMetaInfo() {}
	serializer() {}
	/* eslint-enable no-empty-function */

	detailedName(data) {
		if(!data) return this.constructor.name;
		if(data.id) return `${data.id} (${this.constructor.name})`;
		if(data.name) return `${data.name} (${this.constructor.name})`;
		return this.constructor.name;
	}
}

module.exports = DocumentedItem;
