class DocumentedItem {
	constructor(parent, info) {
		this.parent = parent;
		this.directData = null;

		try {
			this.registerMetaInfo(info);
		} catch(err) {
			err.message = `Error while loading ${
				info && info.id ? `${info.id} (${this.constructor.name})` : this.constructor.name
			}: ${err.message}`;
			throw err;
		}
	}

	serialize() {
		try {
			return this.serializer();
		} catch(err) {
			err.message = `Error while serializing ${
				this.directData && this.directData.id ?
				`${this.directData.id} (${this.constructor.name})` :
				this.constructor.name
			}: ${err.message}`;
			throw err;
		}
	}

	registerMetaInfo() { return; }
	serializer() { return; }
}

module.exports = DocumentedItem;
